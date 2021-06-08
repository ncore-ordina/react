import { FetchContext } from "auth/contexts/FetchContext";
import { Client, ClientForm } from "clients";
import React, { useContext, useEffect, useState } from "react";
import { match, useHistory, useRouteMatch } from "react-router-dom";

export function EditClient() {
  const {
    params: { clientId },
  }: match<{ clientId: string }> = useRouteMatch();
  const { push } = useHistory();
  const [client, setClient] = useState<Client | undefined>(undefined);
  const goBackToClients = () => push("/clients");
  const authAxios = useContext(FetchContext);
  const retrieveClient = async () => {
    const result = (await authAxios(`/clients/${clientId}`)).data;
    setClient(result);
  };
  const onEditClient = async (clientFields: Partial<Client>) => {
    await authAxios.put(`/clients/${clientId}`, clientFields);
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
