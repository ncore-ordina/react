import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  match,
  useHistory,
} from "react-router-dom";
import { Page, ReadOnly } from "../../../components";
import { ClientsTable, CreateClient, EditClient } from "../../containers";
import { useSelector } from "react-redux";
import { selectIsReadOnly } from "../../../state/selectors";

export function ClientsPage() {
  const { url, path }: match = useRouteMatch();
  const { push } = useHistory();
  const isReadOnly = useSelector(selectIsReadOnly);
  const gotToCreateClient = () => push(`${url}/create`);

  return (
    <Switch>
      <Route exact path={path}>
        <Page
          title="Clients"
          onCreateButtonClick={isReadOnly ? undefined : gotToCreateClient}
        >
          <ClientsTable></ClientsTable>
        </Page>
      </Route>
      <Route exact path={`${path}/create`}>
        <Page title="Create client">
          {isReadOnly ? <ReadOnly /> : <CreateClient />}
        </Page>
      </Route>
      <Route exact path={`${path}/:clientId/edit`}>
        <Page title="Edit client">
          {isReadOnly ? <ReadOnly /> : <EditClient />}
        </Page>
      </Route>
    </Switch>
  );
}
