import { Code2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SyntaxReferenceProps {
  currentConcepts?: string[];
}

const syntaxCategories = [
  {
    category: 'Query Basics',
    items: [
      { keyword: 'SELECT', description: 'Choose columns to retrieve', example: 'SELECT column1, column2' },
      { keyword: 'SELECT *', description: 'Select all columns', example: 'SELECT * FROM table' },
      { keyword: 'FROM', description: 'Specify the source table', example: 'FROM table_name' },
      { keyword: 'AS', description: 'Alias for columns or tables', example: 'SELECT name AS customer_name' },
      { keyword: 'DISTINCT', description: 'Remove duplicate rows', example: 'SELECT DISTINCT country' },
    ]
  },
  {
    category: 'Filtering',
    items: [
      { keyword: 'WHERE', description: 'Filter rows with conditions', example: "WHERE score > 100" },
      { keyword: 'AND / OR', description: 'Combine multiple conditions', example: "WHERE a = 1 AND b = 2" },
      { keyword: 'IN', description: 'Match any value in a list', example: "WHERE country IN ('USA', 'UK')" },
      { keyword: 'BETWEEN', description: 'Range of values (inclusive)', example: 'WHERE score BETWEEN 100 AND 500' },
      { keyword: 'LIKE', description: 'Pattern matching with wildcards', example: "WHERE name LIKE 'J%'" },
      { keyword: 'IS NULL', description: 'Check for NULL values', example: 'WHERE email IS NULL' },
      { keyword: 'NOT', description: 'Negate a condition', example: 'WHERE NOT country = \'USA\'' },
    ]
  },
  {
    category: 'Sorting & Limiting',
    items: [
      { keyword: 'ORDER BY', description: 'Sort results', example: 'ORDER BY score DESC' },
      { keyword: 'ASC / DESC', description: 'Ascending or descending order', example: 'ORDER BY name ASC' },
      { keyword: 'TOP / LIMIT', description: 'Limit number of rows', example: 'SELECT TOP 10 * FROM table' },
      { keyword: 'OFFSET', description: 'Skip rows before returning', example: 'LIMIT 10 OFFSET 20' },
    ]
  },
  {
    category: 'Aggregation',
    items: [
      { keyword: 'GROUP BY', description: 'Group rows for aggregation', example: 'GROUP BY country' },
      { keyword: 'HAVING', description: 'Filter groups (after GROUP BY)', example: 'HAVING COUNT(*) > 5' },
      { keyword: 'COUNT', description: 'Count rows', example: 'SELECT COUNT(*) FROM table' },
      { keyword: 'SUM', description: 'Sum of values', example: 'SELECT SUM(sales) FROM orders' },
      { keyword: 'AVG', description: 'Average of values', example: 'SELECT AVG(score) FROM customers' },
      { keyword: 'MIN / MAX', description: 'Minimum or maximum value', example: 'SELECT MAX(price) FROM products' },
    ]
  },
  {
    category: 'JOINs',
    items: [
      { keyword: 'INNER JOIN', description: 'Rows matching in both tables', example: 'FROM a INNER JOIN b ON a.id = b.a_id' },
      { keyword: 'LEFT JOIN', description: 'All from left + matches from right', example: 'FROM a LEFT JOIN b ON a.id = b.a_id' },
      { keyword: 'RIGHT JOIN', description: 'All from right + matches from left', example: 'FROM a RIGHT JOIN b ON a.id = b.a_id' },
      { keyword: 'FULL JOIN', description: 'All rows from both tables', example: 'FROM a FULL JOIN b ON a.id = b.a_id' },
      { keyword: 'CROSS JOIN', description: 'Cartesian product of tables', example: 'FROM a CROSS JOIN b' },
      { keyword: 'SELF JOIN', description: 'Join table to itself', example: 'FROM emp e1 JOIN emp e2 ON e1.mgr = e2.id' },
    ]
  },
  {
    category: 'Subqueries',
    items: [
      { keyword: 'Subquery', description: 'Query inside another query', example: 'WHERE id IN (SELECT id FROM ...)' },
      { keyword: 'EXISTS', description: 'Check if subquery returns rows', example: 'WHERE EXISTS (SELECT 1 FROM ...)' },
      { keyword: 'ANY / ALL', description: 'Compare with subquery results', example: 'WHERE score > ANY (SELECT ...)' },
    ]
  },
  {
    category: 'SET Operations',
    items: [
      { keyword: 'UNION', description: 'Combine results (unique)', example: 'SELECT a FROM t1 UNION SELECT a FROM t2' },
      { keyword: 'UNION ALL', description: 'Combine results (with duplicates)', example: 'SELECT a FROM t1 UNION ALL SELECT a FROM t2' },
      { keyword: 'INTERSECT', description: 'Common rows between queries', example: 'SELECT a FROM t1 INTERSECT SELECT a FROM t2' },
      { keyword: 'EXCEPT', description: 'Rows in first but not second', example: 'SELECT a FROM t1 EXCEPT SELECT a FROM t2' },
    ]
  },
  {
    category: 'DDL (Data Definition)',
    items: [
      { keyword: 'CREATE TABLE', description: 'Create a new table', example: 'CREATE TABLE users (id INT, name VARCHAR)' },
      { keyword: 'ALTER TABLE', description: 'Modify table structure', example: 'ALTER TABLE users ADD email VARCHAR(100)' },
      { keyword: 'DROP TABLE', description: 'Delete a table', example: 'DROP TABLE users' },
      { keyword: 'TRUNCATE', description: 'Remove all rows from table', example: 'TRUNCATE TABLE users' },
    ]
  },
  {
    category: 'DML (Data Manipulation)',
    items: [
      { keyword: 'INSERT INTO', description: 'Add new rows', example: "INSERT INTO users VALUES (1, 'John')" },
      { keyword: 'UPDATE', description: 'Modify existing rows', example: "UPDATE users SET name = 'Jane' WHERE id = 1" },
      { keyword: 'DELETE', description: 'Remove rows', example: 'DELETE FROM users WHERE id = 1' },
    ]
  },
  {
    category: 'String Functions',
    items: [
      { keyword: 'CONCAT', description: 'Concatenate strings', example: "CONCAT(first_name, ' ', last_name)" },
      { keyword: 'UPPER / LOWER', description: 'Change case', example: 'UPPER(name)' },
      { keyword: 'TRIM', description: 'Remove leading/trailing spaces', example: 'TRIM(name)' },
      { keyword: 'SUBSTRING', description: 'Extract part of string', example: 'SUBSTRING(name, 1, 3)' },
      { keyword: 'LEN / LENGTH', description: 'String length', example: 'LEN(name)' },
      { keyword: 'REPLACE', description: 'Replace substring', example: "REPLACE(name, 'old', 'new')" },
    ]
  },
  {
    category: 'Date Functions',
    items: [
      { keyword: 'GETDATE / NOW', description: 'Current date and time', example: 'SELECT GETDATE()' },
      { keyword: 'YEAR / MONTH / DAY', description: 'Extract date parts', example: 'YEAR(order_date)' },
      { keyword: 'DATEADD', description: 'Add interval to date', example: 'DATEADD(day, 7, order_date)' },
      { keyword: 'DATEDIFF', description: 'Difference between dates', example: 'DATEDIFF(day, start, end)' },
      { keyword: 'FORMAT', description: 'Format date as string', example: "FORMAT(date, 'yyyy-MM-dd')" },
    ]
  },
  {
    category: 'CASE & Conditionals',
    items: [
      { keyword: 'CASE WHEN', description: 'Conditional logic', example: "CASE WHEN score > 500 THEN 'High' ELSE 'Low' END" },
      { keyword: 'COALESCE', description: 'Return first non-NULL value', example: 'COALESCE(email, phone, \'N/A\')' },
      { keyword: 'NULLIF', description: 'Return NULL if values equal', example: 'NULLIF(a, b)' },
      { keyword: 'IIF', description: 'Inline IF statement', example: "IIF(score > 500, 'High', 'Low')" },
    ]
  },
  {
    category: 'Window Functions',
    items: [
      { keyword: 'ROW_NUMBER', description: 'Sequential row number', example: 'ROW_NUMBER() OVER (ORDER BY id)' },
      { keyword: 'RANK / DENSE_RANK', description: 'Rank with/without gaps', example: 'RANK() OVER (ORDER BY score DESC)' },
      { keyword: 'OVER', description: 'Define window for function', example: 'SUM(sales) OVER (PARTITION BY region)' },
      { keyword: 'PARTITION BY', description: 'Divide into groups', example: 'OVER (PARTITION BY country)' },
      { keyword: 'LAG / LEAD', description: 'Access previous/next row', example: 'LAG(sales, 1) OVER (ORDER BY date)' },
    ]
  },
];

const SyntaxReference = ({ currentConcepts = [] }: SyntaxReferenceProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Check if a keyword is highlighted (in use)
  const isHighlighted = (keyword: string) => {
    const lowerKeyword = keyword.toLowerCase();
    return currentConcepts.some(concept => {
      const lowerConcept = concept.toLowerCase();
      // Exact match
      if (lowerConcept === lowerKeyword) return true;
      // Partial match (e.g., "ORDER BY" matches "order by")
      if (lowerConcept.includes(lowerKeyword) || lowerKeyword.includes(lowerConcept)) return true;
      // Handle combined keywords like "ASC / DESC"
      if (lowerKeyword.includes('/')) {
        const parts = lowerKeyword.split('/').map(p => p.trim());
        if (parts.some(p => lowerConcept.includes(p) || p.includes(lowerConcept))) return true;
      }
      return false;
    });
  };

  // Auto-expand categories that have highlighted items
  const categoriesWithHighlights = syntaxCategories.filter(cat =>
    cat.items.some(item => isHighlighted(item.keyword))
  ).map(cat => cat.category);

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set([...categoriesWithHighlights, 'Query Basics'])
  );

  // Update expanded categories when concepts change
  useEffect(() => {
    const catsWithHighlights = syntaxCategories.filter(cat =>
      cat.items.some(item => isHighlighted(item.keyword))
    ).map(cat => cat.category);

    if (catsWithHighlights.length > 0) {
      setExpandedCategories(prev => new Set([...prev, ...catsWithHighlights]));
    }
  }, [currentConcepts]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Code2 className="w-4 h-4 text-purple-500" />
        <span className="font-semibold text-sm text-slate-700">SQL Syntax Reference</span>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {syntaxCategories.map((cat) => (
          <div
            key={cat.category}
            className="rounded-lg border border-slate-200 overflow-hidden bg-white"
          >
            <button
              onClick={() => toggleCategory(cat.category)}
              className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
              <span className="font-medium text-xs text-slate-700">{cat.category}</span>
              <ChevronDown className={cn(
                "w-4 h-4 text-slate-400 transition-transform",
                expandedCategories.has(cat.category) && "rotate-180"
              )} />
            </button>

            {expandedCategories.has(cat.category) && (
              <div className="p-2 space-y-1.5">
                {cat.items.map((item) => (
                  <div
                    key={item.keyword}
                    className={cn(
                      "p-2 rounded-md transition-all",
                      isHighlighted(item.keyword)
                        ? "bg-green-50 border border-green-200"
                        : "bg-slate-50/50"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={cn(
                        "font-mono font-semibold text-xs",
                        isHighlighted(item.keyword) ? "text-green-600" : "text-blue-600"
                      )}>
                        {item.keyword}
                      </span>
                      {isHighlighted(item.keyword) && (
                        <span className="text-[9px] bg-green-500 text-white px-1 py-0.5 rounded font-medium">
                          in use
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mb-1">{item.description}</p>
                    <code className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded block overflow-x-auto">
                      {item.example}
                    </code>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SyntaxReference;
