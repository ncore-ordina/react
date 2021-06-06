import React, { useEffect, useState } from "react";
import { ClientForm, Client } from "clients";
import { match, useRouteMatch, useHistory } from "react-router-dom";
import axios from "axios";

export function EditClient() {
  const {
    params: { clientId },
  }: match<{ clientId: string }> = useRouteMatch();
  const { push } = useHistory();
  const [client, setClient] = useState<Client | undefined>(undefined);
  const goBackToClients = () => push("/clients");
  const retrieveClient = async () => {
    const result = (
      await axios(`${process.env.REACT_APP_API_URL}/clients/${clientId}`)
    ).data;
    setClient(result);
  };
  const onEditClient = async (clientFields: Partial<Client>) => {
    await axios.put(
      `${process.env.REACT_APP_API_URL}/clients/${clientId}`,
      clientFields
    );
    goBackToClients();
  };

  useEffect(() => {
    retrieveClient();
    // eslint-disable-next-line
  }, []);

  return client ? (
    <ClientForm
      client={client}
      onSubmit={onEditClient}
      onCancel={goBackToClients}
    ></ClientForm>
  ) : null;
}
