import React from 'react';


interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
}

export function DataTable<T>({ columns, data, keyField }: DataTableProps<T>) {
  return (
    <div className="w-full overflow-auto rounded-md border border-slate-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={`px-4 py-3 font-medium ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={String(row[keyField]) || i} className="hover:bg-slate-50">
                {columns.map((col, j) => (
                  <td key={j} className={`px-4 py-3 ${col.className || ''}`}>
                    {typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : (row[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
