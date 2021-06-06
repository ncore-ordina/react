import { ClientTableData } from "clients";
import React from "react";

interface Props {
  client: ClientTableData;
  children: React.ReactNode;
}

export function ClientRow({ client, children }: Props) {
  return (
    <tr>
      <td className="border px-4 py-2">{client.id}</td>
      <td className="border px-4 py-2">{client.name}</td>
      <td className="border px-4 py-2"> {children}</td>
    </tr>
  );
}
