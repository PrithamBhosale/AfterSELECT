import { Key, Link2, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TableName } from '@/data/sampleTables';

interface SchemaRelationshipProps {
  highlightedTables?: TableName[];
}

const tables = [
  {
    name: 'customers',
    icon: '📋',
    columns: [
      { name: 'id', type: 'PK', isPK: true },
      { name: 'first_name', type: 'VARCHAR' },
      { name: 'country', type: 'VARCHAR' },
      { name: 'score', type: 'INT' },
    ]
  },
  {
    name: 'orders',
    icon: '📦',
    columns: [
      { name: 'order_id', type: 'PK', isPK: true },
      { name: 'customer_id', type: 'FK', isFK: true, references: 'customers.id' },
      { name: 'sales', type: 'DECIMAL' },
      { name: 'order_date', type: 'DATE' },
    ]
  },
  {
    name: 'products',
    icon: '🛍️',
    columns: [
      { name: 'product_id', type: 'PK', isPK: true },
      { name: 'product_name', type: 'VARCHAR' },
      { name: 'category', type: 'VARCHAR' },
      { name: 'price', type: 'DECIMAL' },
    ]
  },
  {
    name: 'employees',
    icon: '👥',
    columns: [
      { name: 'employee_id', type: 'PK', isPK: true },
      { name: 'first_name', type: 'VARCHAR' },
      { name: 'last_name', type: 'VARCHAR' },
      { name: 'department', type: 'VARCHAR' },
      { name: 'salary', type: 'DECIMAL' },
    ]
  },
];

const SchemaRelationship = ({ highlightedTables = [] }: SchemaRelationshipProps) => {
  const isHighlighted = (table: string) => highlightedTables.includes(table as TableName);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Database className="w-4 h-4 text-orange-500" />
        <span className="font-semibold text-sm text-slate-700">Entity Relationship Diagram</span>
      </div>

      <p className="text-xs text-slate-500 mb-4">
        Understanding how tables connect helps you write effective JOINs
      </p>

      {/* ERD Grid */}
      <div className="grid grid-cols-2 gap-3">
        {tables.map((table) => (
          <div
            key={table.name}
            className={cn(
              "rounded-lg border overflow-hidden transition-all",
              isHighlighted(table.name)
                ? "border-green-300 bg-green-50/50 shadow-sm"
                : "border-slate-200 bg-white"
            )}
          >
            {/* Table Header */}
            <div className={cn(
              "px-2.5 py-2 text-xs font-semibold flex items-center gap-1.5",
              isHighlighted(table.name)
                ? "bg-green-100 text-green-700"
                : "bg-slate-50 text-slate-700"
            )}>
              <span>{table.icon}</span>
              <span>{table.name}</span>
              {isHighlighted(table.name) && (
                <span className="ml-auto text-[9px] bg-green-500 text-white px-1 py-0.5 rounded">
                  Used
                </span>
              )}
            </div>

            {/* Columns */}
            <div className="p-2 space-y-1">
              {table.columns.map((col) => (
                <div
                  key={col.name}
                  className="flex items-center gap-1.5 text-xs"
                >
                  {col.isPK ? (
                    <Key className="w-3 h-3 text-yellow-500 shrink-0" />
                  ) : col.isFK ? (
                    <Link2 className="w-3 h-3 text-blue-500 shrink-0" />
                  ) : (
                    <span className="w-3 h-3 shrink-0" />
                  )}
                  <span className={cn(
                    "font-mono",
                    col.isPK ? "font-semibold text-slate-800" :
                      col.isFK ? "text-blue-600" : "text-slate-600"
                  )}>
                    {col.name}
                  </span>
                  <span className="text-[9px] text-slate-400 ml-auto">
                    {col.isPK ? 'PK' : col.isFK ? 'FK' : col.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Relationships */}
      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
        <h4 className="text-xs font-semibold text-slate-700 mb-2">Relationships</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-blue-600">customers.id</span>
            <span className="text-slate-400">→</span>
            <span className="font-mono text-blue-600">orders.customer_id</span>
            <span className="text-slate-400 text-[10px] ml-auto">1:N</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 pt-2 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <Key className="w-3 h-3 text-yellow-500" /> Primary Key
        </span>
        <span className="flex items-center gap-1">
          <Link2 className="w-3 h-3 text-blue-500" /> Foreign Key
        </span>
      </div>
    </div>
  );
};

export default SchemaRelationship;
