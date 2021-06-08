import { FetchContext } from "auth/contexts/FetchContext";
import axios from "axios";
import { Client, ClientRow, ClientTableData } from "clients";
import {
  ActionButton,
  ActionButtonMenu,
  ActionButtonType,
  Table,
} from "components";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { match, useHistory, useRouteMatch } from "react-router-dom";
import { selectIsReadOnly } from "../../../state/selectors";

export function ClientsTable() {
  const [clients, setClients] = useState<Client[] | undefined>(undefined);
  const { url }: match = useRouteMatch();
  const { push } = useHistory();
  const isReadOnly = useSelector(selectIsReadOnly);
  const authAxios = useContext(FetchContext);
  const retrieveClients = async () => {
    console.log(authAxios.defaults);
    const result = (await authAxios.get(`/clients`)).data;
    setClients(result);
  };

  useEffect(() => {
    retrieveClients();
  }, []);

  const onDeleteClient = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await axios.delete(`${process.env.REACT_APP_API_URL}/clients/${id}`);
      await retrieveClients();
    }
  };

  const clientTableData = clients?.map<ClientTableData>((client) => ({
    id: client.id,
    name: `${client.firstName} ${client.lastName}`,
  }));

  return (
    <Table
      headers={["Id", "Name"]}
      data={clientTableData}
      renderRow={(client: ClientTableData) => (
        <ClientRow key={client.id} client={client}>
          <ActionButtonMenu disabled={isReadOnly}>
            <ActionButton
              className="mr-4"
              type={ActionButtonType.EDIT}
              label="Edit"
              onClick={() => {
                push(`${url}/${client.id}/edit`);
              }}
            />
            <ActionButton
              type={ActionButtonType.DELETE}
              label="Delete"
              onClick={() => {
                onDeleteClient(client.id);
              }}
            />
          </ActionButtonMenu>
        </ClientRow>
      )}
    ></Table>
  );
}
