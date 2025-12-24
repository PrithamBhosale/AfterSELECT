import { Table, AlertCircle, CheckCircle2, Terminal, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsPanelProps {
  results: Record<string, any>[] | null;
  message: string | null;
  isError: boolean;
}

const ResultsPanel = ({ results, message, isError }: ResultsPanelProps) => {
  // Show loading state
  if (message === 'Executing query...') {
    return (
      <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border-b border-blue-200">
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          <span className="text-xs font-medium text-blue-600">Executing</span>
        </div>

        {/* Loading State */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-600 text-sm font-medium mb-1">Running your query...</p>
          <p className="text-slate-400 text-xs">Please wait while we process your SQL</p>
        </div>
      </div>
    );
  }

  if (!results && !message) {
    return (
      <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
          <Terminal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Output</span>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
            <Table className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">No results yet</p>
          <p className="text-slate-400 text-xs">Run your query to see results here</p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className={cn(
          "flex items-center gap-2 px-4 py-2.5 border-b",
          isError
            ? "bg-red-50 border-red-200"
            : "bg-green-50 border-green-200"
        )}>
          {isError ? (
            <AlertCircle className="w-4 h-4 text-red-500" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          )}
          <span className={cn(
            "text-xs font-medium",
            isError ? "text-red-600" : "text-green-600"
          )}>
            {isError ? "Error" : "Success"}
          </span>
        </div>

        {/* Message */}
        <div className="flex-1 p-4 overflow-auto">
          <div className={cn(
            "flex items-start gap-3 p-4 rounded-lg",
            isError ? "bg-red-50" : "bg-green-50"
          )}>
            {isError ? (
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className={cn(
                "font-semibold text-sm mb-1",
                isError ? "text-red-700" : "text-green-700"
              )}>
                {isError ? "Query Error" : "Query Executed Successfully!"}
              </h4>
              <p className={cn(
                "text-sm",
                isError ? "text-red-600" : "text-green-600"
              )}>
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (results && results.length > 0) {
    const columns = Object.keys(results[0]);

    return (
      <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-green-50 border-b border-green-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-green-700">Query executed successfully</span>
          </div>
          <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-medium">
            {results.length} row{results.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Results Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 border-b border-slate-200">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="px-4 py-2 text-xs font-mono whitespace-nowrap"
                    >
                      {row[col] === null ? (
                        <span className="text-slate-400 italic">NULL</span>
                      ) : typeof row[col] === 'number' ? (
                        <span className="text-blue-600">{String(row[col])}</span>
                      ) : (
                        <span className="text-slate-700">{String(row[col])}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <Terminal className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-medium text-slate-500">Output</span>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-slate-400 text-sm">No results to display</p>
      </div>
    </div>
  );
};

export default ResultsPanel;
