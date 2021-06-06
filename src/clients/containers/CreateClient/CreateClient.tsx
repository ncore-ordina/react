import React from "react";
import { useHistory } from "react-router-dom";
import { Client, ClientForm } from "clients";
import axios from "axios";

export function CreateClient() {
  const { push } = useHistory();
  const goBackToClients = () => push("/clients");
  const onCreateClient = async (newClient: Partial<Client>) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/clients`, newClient);
    goBackToClients();
  };

  return (
    <ClientForm
      onSubmit={onCreateClient}
      onCancel={goBackToClients}
    ></ClientForm>
  );
}
