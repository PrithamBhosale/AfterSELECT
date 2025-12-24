import { sampleTables, TableName } from '@/data/sampleTables';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DataPreviewProps {
  defaultExpanded?: boolean;
  highlightedTables?: TableName[];
}

const tableIcons: Record<TableName, string> = {
  customers: '📋',
  orders: '📦',
  products: '🛍️',
  employees: '👥',
};

const DataPreview = ({ defaultExpanded = true, highlightedTables = [] }: DataPreviewProps) => {
  const [expandedTables, setExpandedTables] = useState<Set<TableName>>(() => {
    // Expand highlighted tables by default, or first table if none highlighted
    if (highlightedTables.length > 0) {
      return new Set(highlightedTables);
    }
    return new Set(['customers'] as TableName[]);
  });

  const isHighlighted = (table: string) => highlightedTables.includes(table as TableName);

  const toggleTable = (tableName: TableName) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  const renderTable = (tableName: TableName) => {
    const data = sampleTables[tableName];
    if (!data || data.length === 0) return null;
    const isOpen = expandedTables.has(tableName);
    const highlighted = isHighlighted(tableName);

    return (
      <div
        key={tableName}
        className={cn(
          "rounded-lg border overflow-hidden transition-all",
          highlighted
            ? "border-green-300 bg-green-50/30"
            : "border-slate-200 bg-white"
        )}
      >
        {/* Table Header */}
        <button
          onClick={() => toggleTable(tableName)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors",
            highlighted
              ? "bg-green-50 hover:bg-green-100/80"
              : "bg-slate-50 hover:bg-slate-100"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{tableIcons[tableName]}</span>
            <span className={cn(
              "font-semibold text-sm",
              highlighted ? "text-green-700" : "text-slate-700"
            )}>
              {tableName}
            </span>
            {highlighted && (
              <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded font-medium">
                Used
              </span>
            )}
          </div>
          <svg
            className={cn(
              "w-4 h-4 transition-transform",
              highlighted ? "text-green-600" : "text-slate-400",
              isOpen && "rotate-180"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Table Content */}
        {isOpen && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-t border-slate-200 bg-slate-50">
                  {Object.keys(data[0]).map((col) => (
                    <th
                      key={col}
                      className="px-3 py-2 text-left font-mono font-semibold text-slate-600 whitespace-nowrap border-r border-slate-100 last:border-r-0"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row, i) => (
                  <tr
                    key={i}
                    className={cn(
                      "hover:bg-slate-50 transition-colors",
                      i % 2 === 0 ? "bg-white" : "bg-slate-25"
                    )}
                  >
                    {Object.values(row).map((val, j) => (
                      <td
                        key={j}
                        className="px-3 py-1.5 font-mono text-slate-700 whitespace-nowrap border-r border-slate-50 last:border-r-0"
                      >
                        {val === null
                          ? <span className="text-slate-400 italic">NULL</span>
                          : typeof val === 'number'
                            ? <span className="text-blue-600">{String(val)}</span>
                            : String(val)
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {(Object.keys(sampleTables) as TableName[]).map(renderTable)}
    </div>
  );
};

export default DataPreview;
