# Authentication - Chapter 0

In front of you you have an app, that uses the Axios library to call our API.
In this first chapter, we will install the oidc-client-js library and use it to authenticate ourselves.
By doing this, we will get some user information and a JWT (JSON Web Token) that we can use later to make authorized calls to the backend.

## Oidc-client
This is a generic library that implements the OIDC protocol.
There are some other solutions out there, such as MSAL from Microsoft which should work very well wit Azure AD.
But we choose to use oidc-client-js, because it is the most generic one and should be able 
to integrate well with any authorization server that implements the OIDC protocol. This is cool, because it allows us to
change authorization server in the future.

```
npm install oidc-client --save
```

## Configuring oidc-client
`oidc-client` will need some information for us to work properly.
Create a new file `src/auth/oidc-settings.ts` where we can save our project specific settings. 
```
mkdir src/auth
touch src/auth/oidc-settings.ts
```

To get authorization working, there is very minimal configuration needed. 
The `authority` is our authorization server, which is responsible for providing us with a JWT.
The `client_id` must be the same as the client id in the authorization server, so this has been configured in keycloak.
The `response_type` is what we expect to get after we authenticate, we define here `code` since we want to implement
the code flow, and expect an authorization code as response. By default this setting is set to `id_token`, in which case
the implicit flow is implemented. 
Since we configured that we want an authorization code as response, our `redirect_uri` points to a url that will
make an AJAX call to the authority to exchange the authorization code for an access token (JWT). We will implement this
html page in a minute. Out of the box, all of this will happen with PKCE under the hood. 
The `post_logout_redirect_uri` is where you'd like to be redirected to after a logout.
```
const clientRoot = "http://localhost:3000/";

export const settings = {
  authority: "https://keycloak.ordina-jworks.io/auth/realms/react-base-app",
  client_id: "reactjs-base-app",
  response_type: "code",
  redirect_uri: `${clientRoot}signin-callback.html`,
  post_logout_redirect_uri: `${clientRoot}`,
};
```

## use UserManager to log in.
Now that we have our configuration ready, we can create an instance of the `UserManager` class which comes with the oidc-client library.
When we call the `signInRedirect()` method it will redirect us to our authorization server with all the correct
parameters (such as `redirectUrl`, and `code_challenge` for PKCE).

Let's do this in the `App` component for now, we will move it to a better location later.

The following code will check if the userManager already has a user, for this it will check in the sessionStorage if there 
is a JWT available. 
If there is no user present, we will redirect our browser to the authorization server where we can login. 

FYI, you can also configure to store tokens elsewhere, for example in localStorage so that it works in multiple tabs, 
or in the application memory for security reasons.
```tsx
export function App() {
    
    const userManager = useRef<UserManager>();
    useEffect(() => {
        userManager.current = new UserManager(settings);
        userManager.current.getUser().then(user => {
            if (user === null) {
                userManager.current!.signinRedirect();
            }
        });
    }, []);
```

## signin-callback.html
Once we've succesfully logged in, the browser will redirect us to ${clientRoot}signin-callback.html` (as configured), 
with an authorization code as a queryparam.
On this page we will implement the logic to exchange this authorization code for an access token.

We could've chosen to be redirected to a route in your application and handle the exchange between authorization code and JWT there.
In stead we will create an html page that only imports the minimized version of the oidc-client lib, and do the exchange here.
This way, we avoid having to load the whole react application for this exchange.

create the html file in our public folder
```
touch public/signin-callback.html
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <title>Authentification callback processing..</title>
</head>

<body>
    <noscript>
        You need to enable JavaScript to run this app.
    </noscript>

    <h1>Authentification callback processing...</h1>

    <script src="oidc-client.slim.min.js"></script>
    <script>
        new Oidc.UserManager({ response_mode: "query" }).signinRedirectCallback().then(function () {
            window.location = "index.html";
        }).catch(function (e) {
            console.error(e);
        });
    </script>

</body>
</html>
```

As you can see, this html page loads a minimized version of the `oidc-client` and calls the `signinRedirectCallback` method.
This will make an AJAX call, exchanging the authorization code for an access token (and the access token will be stored in sessionStorage).
On success, it will navigate to `index.html` and thus open our application.

You might have noticed that we actually don't have the `oidc-client.slim.min.js` file present!
To fix this you can download this file from the [oidc-client github repo](https://github.com/IdentityModel/oidc-client-js/tree/dev/dist)
and copy it into the `/public` folder.
Or run this command from the root of your project.
```
curl https://raw.githubusercontent.com/IdentityModel/oidc-client-js/dev/dist/oidc-client.slim.min.js --output public/oidc-client.slim.min.js
```

## Result

So if everything went well, you should be able to login when you open the application. 
Then after all the redirecting is done, you should be able to check the sessionStorage and see a JWT, and some userinfo,
You are authenticated and have an access token!
