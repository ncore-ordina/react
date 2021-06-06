import React, { useState } from "react";
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

const navItems = [
  {
    name: "products",
    route: Routes.PRODUCTS,
  },
  {
    name: "clients",
    route: Routes.CLIENTS,
  },
];

export function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  return (
    <div className="w-full h-full flex flex-col">
      <Header
        title="NCore Rules!"
        handleClickMenuButton={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex flex-1 flex-auto">
        <SidenavContainer>
          <Sidenav isSidenavOpen={isSidebarOpen}>
            <NavItems navItems={navItems} />
          </Sidenav>
          <SidenavContent>
            <Switch>
              <Route path={Routes.PRODUCTS}>
                <ProductsPage />
              </Route>
              <Route path={Routes.CLIENTS}>
                <ClientsPage />
              </Route>
            </Switch>
          </SidenavContent>
        </SidenavContainer>
      </div>
    </div>
  );
}

export default App;
