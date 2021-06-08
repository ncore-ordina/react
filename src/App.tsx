import { AuthenticatedRoute } from "auth/components/AuthenticatedRoute/AuthenticatedRoute";
import { Login } from "auth/components/Login/Login";
import { AuthContext } from "auth/contexts/AuthContext";
import { settings } from "auth/oidc-settings";
import { UserManager } from "oidc-client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { ClientsPage } from "./clients";
import {
  Header,
  NavItems,
  Sidenav,
  SidenavContainer,
  SidenavContent,
} from "./components";
import { ProductsPage } from "./products/pages";
import { Routes } from "./routes";

const navItems: [] = [];

const authenticatedNavItems = [
  ...navItems,
  {
    name: "clients",
    route: Routes.CLIENTS,
  },
  {
    name: "products",
    route: Routes.PRODUCTS,
  },
];

export function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { isAuthenticated, isInitialized } = useContext(AuthContext);

  const userManager = useRef<UserManager>();
  useEffect(() => {
    userManager.current = new UserManager(settings);
    userManager.current.getUser().then((user) => {
      if (user === null) {
        userManager.current!.signinRedirect();
      }
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <Header
        title="NCore Rules!"
        handleClickMenuButton={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex flex-1 flex-auto">
        <SidenavContainer>
          <Sidenav isSidenavOpen={isSidebarOpen}>
            <NavItems
              navItems={isAuthenticated() ? authenticatedNavItems : navItems}
            />
          </Sidenav>
          <SidenavContent>
            {isInitialized && (
              <Switch>
                <AuthenticatedRoute
                  path={Routes.PRODUCTS}
                  redirectRoute={Routes.LOGIN}
                >
                  <ProductsPage />
                </AuthenticatedRoute>
                <AuthenticatedRoute
                  path={Routes.CLIENTS}
                  redirectRoute={Routes.LOGIN}
                >
                  <ClientsPage />
                </AuthenticatedRoute>
                <Route path={Routes.LOGIN}>
                  <Login />
                </Route>
              </Switch>
            )}
          </SidenavContent>
        </SidenavContainer>
      </div>
    </div>
  );
}

export default App;
