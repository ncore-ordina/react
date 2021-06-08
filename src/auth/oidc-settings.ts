const clientRoot = "http://localhost:3000/";

export const settings = {
  authority:
    "https://react-accelerator-keycloak.azurewebsites.net/auth/realms/react-base-app",
  client_id: "reactjs-base-app",
  response_type: "code",
  redirect_uri: `${clientRoot}signin-callback.html`,
  post_logout_redirect_uri: `${clientRoot}`,
};
