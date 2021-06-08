import { FetchContext } from "auth/contexts/FetchContext";
import { Client, ClientForm } from "clients";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

export function CreateClient() {
  const { push } = useHistory();
  const goBackToClients = () => push("/clients");
  const authAxios = useContext(FetchContext);
  const onCreateClient = async (newClient: Partial<Client>) => {
    await authAxios.post(`/clients`, newClient);
    goBackToClients();
  };

  return (
    <ClientForm
      onSubmit={onCreateClient}
      onCancel={goBackToClients}
    ></ClientForm>
  );
}
