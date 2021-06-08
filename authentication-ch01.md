# Authentication - Chapter 1

In this chapter we will learn how to share the auth state throughout the app, and we will use this info to protect
certain routes.
To do this, we will use React's `Context` API.

## Context API
If we wanted to use the `user` object on a deeply nested component, we would have to pass it all the way from the `App`
component down to that component using the `props`.
React provides an API that we can use to share variables in a certain part of the application.
This is called the `Context`. 
When we call the `createContext` function from the React library that creates a context in which you can put the variables you'd like to share.
This function returns an object that holds both a `Provider` component and a `Consumer` component.
2. Provider: All children (nested components) of this `Provider` component will have direct access to the variables in the context.
3. Consumer: This is a component that subscribes to the context changes.
To access the variables in the context in a certain component, we wrap the component inside this `Consumer` component.
The `Consumer` component can then pass the current context value to the wrapped component. 

```tsx
const user = {name: 'Simon', uid: '1234'}
const ExampleContext = React.createContext();
//wrap your app in a Provider for the ExampleContext
<ExampleContext.Provider value={user}><App /></ExampleContext.Provider>
// Anywere nested under the App component you can wrap a component that needs access to the ExampleContext with the Consumer component
<ExampleContext.Consumer>
	{value => <MyDeeplyNestedChildComponent user={value}/>}
</ExampleContext.Consumer>
```

Now, since the creation of [hooks](https://reactjs.org/docs/hooks-intro.html), there is an alternative way of accessing
the value in a context.
```tsx
import React, { useContext } from "react";
import {ExampleContext }from '../contexts/ExampleContext.tsx'
const WelcomeComponent = () => {
    const user = useContext(ExampleContext)
    return <h1>Helllo {user.name}</h1>
}
```
You still have to make sure that the `WelcomeComponent` is part of the application that is nested inside the `Provider`
component. Usually you just wrap the `Provider` component around the `App` component, this way you share data throughout
the application.

## AuthContext
Now let's pull out that `UserManager` logic from the `App` component, and create a `Context` and `Provider` to hold this
logic. 

Create a file `src/auth/contexts/AuthContext.tsx`, and copy in the code below.
As you can see, we create a wrapper (`AuthProvider`) around the `Provider` component from the `Context`.
In this wrapper we can initialize the `UserManager`, and to handle `AuthState` changes, and we can pass
the correct data to the `Provider` component.
We then render the `children` prop inside the `Provider`.
Read [this](https://reactjs.org/docs/jsx-in-depth.html#children-in-jsx) if you don't know what this `children` prop is.
The short explanation is than when we wrap our `AuthProvider` component around another component (for example `App`), then
this nested component (`App`) will be passed in the `children` prop automatically. This is default `React` behaviour.

Lastly, you might think it's weird that we pass an arrow function to the `useState` hook for the `UserManager`.
This is called a [lazy initial state](https://reactjs.org/docs/hooks-reference.html#lazy-initial-state).
It will make only call this logic on the initial render. 
If we'd use `useState(new UserManager())` it would call `new UserManager()` on every render.
```tsx
import React, { createContext, useEffect, useState } from "react";
import { Profile, User, UserManager } from "oidc-client";
import { settings } from "../oidc-settings";

interface AuthState {
    token: string;
    expiresAt: number;
    userInfo: Profile;
}

interface IAuthContext {
    authState: AuthState | null;
    isAuthenticated: () => boolean;
    login: () => void;
    logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
    authState: null,
    isAuthenticated: () => false,
    login: () => {},
    logout: () => {}
});
const {Provider} = AuthContext;

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [userManager] = useState(() =>new UserManager(settings));
    const [authState, setAuthState] = useState<AuthState | null>(null);

    useEffect(() => {
        loadUser()
    }, []);

    const login = () => userManager.signinRedirect();

    const logout = () => {
        userManager.signoutRedirect();
        setAuthState(null);
    };

    const loadUser = () =>
        userManager.getUser().then((user) => {
            if (user && !user.expired) {
                setAuthInfo(user);
            }
        });

    const isAuthenticated = () => {
        if (!authState?.userInfo || !authState.expiresAt) {
            return false;
        }
        return new Date().getTime() / 1000 < authState.expiresAt;
    };

    const setAuthInfo = ({id_token, profile, expires_at}: User) => {
        setAuthState({
            token: id_token,
            userInfo: profile,
            expiresAt: expires_at,
        });
    };

    return (
        <Provider
            value={{
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

If we now wrap `AuthProvider` around the `App` component, then we can access to the `AuthContext` in any component
inside our application. 

```tsx
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
            <App />
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
```

## use our AuthContext
Let's change 2 things in our `Header` component.
We want the lock icon to be hidden when the user is not logged in, so that the app is always read-only.
And we want to add a user menu, that can be used to login and logout.

First of all, let's pull in the `AuthContext` using the `useContext` API, and conditionally render the lockIcon
```tsx
  {isAuthenticated() && (
    <Lock
      isOpen={!isReadOnly}
      onClick={() => dispatch(toggleReadOnly())}
      className={"ml-auto"}
    />
  )}
```

In the `src/components/Header` folder you can find the `UserMenu` component pre-made for you, have a quick look at it
and then position it next to the `Lock` component in the `Header`. Make sure to pass the necessary props.

