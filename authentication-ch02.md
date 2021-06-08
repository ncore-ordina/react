# Authentication - Chapter 2

Now that we have exposed the `AuthContext`, we can use this information to hide and protect our routes.

## Hide the clients Route
First of all, let's hide the `clients` navigation item in the sidenav when you're logged out.
You can change this in `App.tsx`
```tsx
const navItems = [
  {
    name: "products",
    route: Routes.PRODUCTS,
  },
];

const authenticatedNavItems = [
  ...navItems,
  {
    name: "clients",
    route: Routes.CLIENTS,
  },
];
//...

const {isAuthenticated} = useContext(AuthContext);

//...
  <Sidenav isSidenavOpen={isSidebarOpen}>
    <NavItems
      navItems={isAuthenticated() ? authenticatedNavItems : navItems}
    />
  </Sidenav>
```
Get the `isAuthenticated` from the `AuthContext`, just like we've done before in the `Header`

## Guard the clients route
Of course, a visitor could still directly go to the `/clients` url, this should be avoided too when he/she is not authenticated.
To guard the `/clients` route we can use the `render` prop on the `Route` component from `react-router`.
With this prop, you can pass an arrow function to implement conditional routing.
In this function will check if the user is authenticated before routing to `ClientsPage`. 
And if the user is not authenticated we will redirect him to `/login/`, using the `Redirect` component from `react-router`

```tsx
// App.tsx
import { Switch, Route, Redirect } from "react-router-dom";
// ... 
<Route path='/clients' render={() => 
        isAuthenticated()  
         ? <ClientsPage/>
         : <Redirect to='/login' />
    }></Route>
```
Again, change this code in your `App.tsx`. 
We're still missing a `Login` component on the `/login` route for this to work. This is a special component.
We will not implement our own login page, in stead we redirect to the login page on the Auth server.
This is a best practice, so that our app can outsource all the security around username/password handling.
In other words, the `Login` component will not render anything. It will however implement a hook that redirects us to
the login page on the Auth server (by calling `authContext.login()`). This is called a *Renderless component*.
Add this component to our auth module (`src/auth/components/Login/Login.tsx`)
```tsx 
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

export const Login = () => {
  const { login } = useContext(AuthContext);
  useEffect(() => {login()}, []);
  return <></>;
};
```
And finally add a `Route` component to `App.tsx`, to route to the `Login` component.
```tsx
<Switch>
// ... 
  <Route path={Routes.LOGIN}>
    <Login />
  </Route>
</Switch>
```

## AuthenticatedRoute component
If we'd want to hide & guard our `/products` route now as well, you'd know what to do.
Simply hide it in the sidenav and do some conditional routing with the `render` prop on the `Route` component.
It'd be much nicer if we'd DRY this code up a bit though, because if we have many routes to guard we would be 
copy/pasting a lot of this conditional routing.

In stead, let's create a `AuthenticatedRoute` that will hold all this logic.
Let's add it to our `auth` module again.
```tsx
// src/auth/components/AuthenticatedRoute/AuthenticatedRoute.tsx
import React, { ReactNode, useContext } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

type Props  = {
  children: ReactNode;
  redirectRoute: string;
} & RouteProps;

export const AuthenticatedRoute = ({ children, redirectRoute, ...rest }: Props) => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <Route {...rest} render={() => 
        (isAuthenticated()
            ? children
            : <Redirect to={redirectRoute} />)}
    ></Route>
  );
};
```
Some things to note in this component.
1. We destructure all the props (except the `redirectRoute` and the `children`) into a variable called, and spread it again
into the `Route` component. This allows us to use this `AuthenticatedRoute` almost like a normal `Route` component, 
as it will pass all the props through. This syntax is built into ES6, and you can read more about it
[here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
2. We render the `children` prop, which are the nested components, remember? We've explained this pattern in ch01.

We can now use this component in our `Switch` component.
```tsx
//App.tsx
<Switch>
    <AuthenticatedRoute path={Routes.PRODUCTS} redirectRoute={Routes.LOGIN}>
        <ProductsPage/>
    </AuthenticatedRoute>
    <AuthenticatedRoute path={Routes.CLIENTS} redirectRoute={Routes.LOGIN}>
        <ClientsPage/>
    </AuthenticatedRoute>
    <Route path={Routes.LOGIN}>
        <Login/>
    </Route>
</Switch>
```

In your sidenav you should also hide the `products` item. In stead, show a `login` item when you're unauthenticated.

## Render the protected routes after initialization of the oidc library.
There's still kind of a bug in our app now.
Let's say we're on the `/products` page & we refresh the app. Even when there is an active
user in the `sessionStorage` available, our app will still route to '/login'. 
This will cause the app to be redirected to Keycloak, because of some cookies, we will
be redirected with a new token right away, but to the homepage (our `redirectUrl`).
This is so because when the app starts up, our context initially does not have a user, it will need to wait for the
`loadUser` promise to resolve, so the `AuthenticatedRoute` will redirect us too early away.

To resolve this we will add some more state to the context to indicate whether the oidc library is initialized already.
Add this flag to the `AuthContext`.
```tsx
interface IAuthContext {
    //...  
    isInitialized: boolean;
}

export const AuthContext = createContext<IAuthContext>({
    //...  
    isInitialized: false,
});
const {Provider} = AuthContext;

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    //...
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    useEffect(() => {
        loadUser().then(() => setIsInitialized(true));
    }, []);
    
    //...

    return (
        <Provider
            value={{
                isInitialized,
                authState,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </Provider>
    );
};
```

Now we can delay rendering of the `AuthenticatedRoute` components until the oidc client is initialized.
```tsx
const { isAuthenticated, isInitialized } = useContext(AuthContext);

{isInitialized && <Switch>
    <AuthenticatedRoute path={Routes.PRODUCTS} redirectRoute={Routes.LOGIN}>
        <ProductsPage/>
    </AuthenticatedRoute>
    <AuthenticatedRoute path={Routes.CLIENTS} redirectRoute={Routes.LOGIN}>
        <ClientsPage/>
    </AuthenticatedRoute>
    <Route path={Routes.LOGIN}>
        <Login/>
    </Route>
</Switch>}
```