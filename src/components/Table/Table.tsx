import React from "react";

type ExtendedType = { id: string } & { [key: string]: any };

interface TableProps<T> {
  headers: string[];
  data: T[] | undefined;
  renderRow: (item: T) => React.ReactNode;
}

export function Table<T extends ExtendedType>({
  headers,
  data,
  renderRow,
}: TableProps<T>) {
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <table className="table-auto w-full">
      <thead>
        <tr className="bg-gray-200">
          {headers.map((header) => (
            <th key={header} className="border px-4 py-2 text-left">
              {header}
            </th>
          ))}
          <th className="border px-4 py-2 text-left"></th>
        </tr>
      </thead>
      <tbody>
        {data.length ? (
          data.map((item) => renderRow(item))
        ) : (
          <tr>
            <td className="border px-4 py-2" colSpan={headers.length + 1}>
              No data
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
