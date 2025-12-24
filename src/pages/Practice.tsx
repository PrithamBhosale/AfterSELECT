import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SQLEditor from '@/components/SQLEditor';
import ResultsPanel from '@/components/ResultsPanel';
import DataPreview from '@/components/DataPreview';
import SyntaxReference from '@/components/SyntaxReference';
import SchemaRelationship from '@/components/SchemaRelationship';
import { sqlCurriculum, getTotalQueryCount, SQLQuery } from '@/data/sqlCurriculum';
import { executeQueryAsync, initSqlDatabase } from '@/lib/sqlExecutor';
import { useProgress } from '@/hooks/useProgress';
import { Check, ChevronRight, ChevronLeft, Trophy, Grid3X3, Lightbulb, BookOpen, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TableName } from '@/data/sampleTables';

// Detect which tables are used in the query
const detectTablesUsed = (query: string): TableName[] => {
  const lowerQuery = query.toLowerCase();
  const tables: TableName[] = [];
  if (lowerQuery.includes('customers')) tables.push('customers');
  if (lowerQuery.includes('orders')) tables.push('orders');
  if (lowerQuery.includes('products')) tables.push('products');
  if (lowerQuery.includes('employees')) tables.push('employees');
  return tables;
};

// Detect SQL concepts from the query
const detectConcepts = (query: string): string[] => {
  const upperQuery = query.toUpperCase();
  const concepts: string[] = [];

  // Query Basics
  if (upperQuery.includes('SELECT')) concepts.push('SELECT');
  if (upperQuery.includes('SELECT *')) concepts.push('SELECT *');
  if (upperQuery.includes('FROM')) concepts.push('FROM');
  if (/\bAS\b/.test(upperQuery)) concepts.push('AS');
  if (upperQuery.includes('DISTINCT')) concepts.push('DISTINCT');

  // Filtering
  if (upperQuery.includes('WHERE')) concepts.push('WHERE');
  if (upperQuery.includes(' AND ') || upperQuery.includes(' OR ')) concepts.push('AND / OR');
  if (/\bIN\s*\(/.test(upperQuery)) concepts.push('IN');
  if (upperQuery.includes('BETWEEN')) concepts.push('BETWEEN');
  if (upperQuery.includes('LIKE')) concepts.push('LIKE');
  if (upperQuery.includes('IS NULL')) concepts.push('IS NULL');
  if (upperQuery.includes('IS NOT NULL')) concepts.push('IS NOT NULL');
  if (/\bNOT\b/.test(upperQuery)) concepts.push('NOT');

  // Sorting & Limiting
  if (upperQuery.includes('ORDER BY')) concepts.push('ORDER BY');
  if (/\bASC\b/.test(upperQuery)) concepts.push('ASC / DESC');
  if (/\bDESC\b/.test(upperQuery)) concepts.push('ASC / DESC');
  if (upperQuery.includes('TOP ') || upperQuery.includes('LIMIT')) concepts.push('TOP / LIMIT');
  if (upperQuery.includes('OFFSET')) concepts.push('OFFSET');

  // Aggregation
  if (upperQuery.includes('GROUP BY')) concepts.push('GROUP BY');
  if (upperQuery.includes('HAVING')) concepts.push('HAVING');
  if (/\bCOUNT\s*\(/.test(upperQuery)) concepts.push('COUNT');
  if (/\bSUM\s*\(/.test(upperQuery)) concepts.push('SUM');
  if (/\bAVG\s*\(/.test(upperQuery)) concepts.push('AVG');
  if (/\bMIN\s*\(/.test(upperQuery) || /\bMAX\s*\(/.test(upperQuery)) concepts.push('MIN / MAX');

  // JOINs
  if (upperQuery.includes('INNER JOIN')) concepts.push('INNER JOIN');
  if (upperQuery.includes('LEFT JOIN')) concepts.push('LEFT JOIN');
  if (upperQuery.includes('RIGHT JOIN')) concepts.push('RIGHT JOIN');
  if (upperQuery.includes('FULL JOIN') || upperQuery.includes('FULL OUTER JOIN')) concepts.push('FULL JOIN');
  if (upperQuery.includes('CROSS JOIN')) concepts.push('CROSS JOIN');
  if (upperQuery.includes('JOIN') && !concepts.some(c => c.includes('JOIN'))) concepts.push('INNER JOIN');

  // Subqueries
  if (/\(\s*SELECT/.test(upperQuery)) concepts.push('Subquery');
  if (upperQuery.includes('EXISTS')) concepts.push('EXISTS');
  if (/\bANY\s*\(/.test(upperQuery) || /\bALL\s*\(/.test(upperQuery)) concepts.push('ANY / ALL');

  // SET Operations
  if (upperQuery.includes('UNION ALL')) concepts.push('UNION ALL');
  else if (upperQuery.includes('UNION')) concepts.push('UNION');
  if (upperQuery.includes('INTERSECT')) concepts.push('INTERSECT');
  if (upperQuery.includes('EXCEPT')) concepts.push('EXCEPT');

  // DDL
  if (upperQuery.includes('CREATE TABLE')) concepts.push('CREATE TABLE');
  if (upperQuery.includes('ALTER TABLE')) concepts.push('ALTER TABLE');
  if (upperQuery.includes('DROP TABLE')) concepts.push('DROP TABLE');
  if (upperQuery.includes('TRUNCATE')) concepts.push('TRUNCATE');

  // DML
  if (upperQuery.includes('INSERT INTO') || upperQuery.includes('INSERT ')) concepts.push('INSERT INTO');
  if (/\bUPDATE\b/.test(upperQuery) && upperQuery.includes('SET')) concepts.push('UPDATE');
  if (/\bDELETE\s+FROM/.test(upperQuery)) concepts.push('DELETE');

  // String Functions
  if (/\bCONCAT\s*\(/.test(upperQuery)) concepts.push('CONCAT');
  if (/\bUPPER\s*\(/.test(upperQuery) || /\bLOWER\s*\(/.test(upperQuery)) concepts.push('UPPER / LOWER');
  if (/\bTRIM\s*\(/.test(upperQuery)) concepts.push('TRIM');
  if (/\bSUBSTRING\s*\(/.test(upperQuery)) concepts.push('SUBSTRING');
  if (/\bLEN\s*\(/.test(upperQuery) || /\bLENGTH\s*\(/.test(upperQuery)) concepts.push('LEN / LENGTH');
  if (/\bREPLACE\s*\(/.test(upperQuery)) concepts.push('REPLACE');
  if (/\bLEFT\s*\(/.test(upperQuery) || /\bRIGHT\s*\(/.test(upperQuery)) concepts.push('LEFT / RIGHT');

  // Date Functions
  if (/\bGETDATE\s*\(/.test(upperQuery) || /\bNOW\s*\(/.test(upperQuery)) concepts.push('GETDATE / NOW');
  if (/\bYEAR\s*\(/.test(upperQuery) || /\bMONTH\s*\(/.test(upperQuery) || /\bDAY\s*\(/.test(upperQuery)) concepts.push('YEAR / MONTH / DAY');
  if (/\bDATEADD\s*\(/.test(upperQuery)) concepts.push('DATEADD');
  if (/\bDATEDIFF\s*\(/.test(upperQuery)) concepts.push('DATEDIFF');
  if (/\bFORMAT\s*\(/.test(upperQuery)) concepts.push('FORMAT');
  if (/\bDATETRUNC\s*\(/.test(upperQuery)) concepts.push('DATETRUNC');
  if (/\bDATENAME\s*\(/.test(upperQuery)) concepts.push('DATENAME');
  if (/\bEOMONTH\s*\(/.test(upperQuery)) concepts.push('EOMONTH');

  // CASE & Conditionals
  if (upperQuery.includes('CASE WHEN') || upperQuery.includes('CASE ')) concepts.push('CASE WHEN');
  if (/\bCOALESCE\s*\(/.test(upperQuery)) concepts.push('COALESCE');
  if (/\bNULLIF\s*\(/.test(upperQuery)) concepts.push('NULLIF');
  if (/\bIIF\s*\(/.test(upperQuery)) concepts.push('IIF');

  // Window Functions
  if (/\bROW_NUMBER\s*\(/.test(upperQuery)) concepts.push('ROW_NUMBER');
  if (/\bRANK\s*\(/.test(upperQuery) || /\bDENSE_RANK\s*\(/.test(upperQuery)) concepts.push('RANK / DENSE_RANK');
  if (/\bNTILE\s*\(/.test(upperQuery)) concepts.push('NTILE');
  if (upperQuery.includes('OVER')) concepts.push('OVER');
  if (upperQuery.includes('PARTITION BY')) concepts.push('PARTITION BY');
  if (/\bLAG\s*\(/.test(upperQuery) || /\bLEAD\s*\(/.test(upperQuery)) concepts.push('LAG / LEAD');
  if (/\bFIRST_VALUE\s*\(/.test(upperQuery) || /\bLAST_VALUE\s*\(/.test(upperQuery)) concepts.push('FIRST_VALUE / LAST_VALUE');
  if (/\bCUME_DIST\s*\(/.test(upperQuery)) concepts.push('CUME_DIST');

  // Other
  if (/\bROUND\s*\(/.test(upperQuery)) concepts.push('ROUND');
  if (/\bABS\s*\(/.test(upperQuery)) concepts.push('ABS');
  if (/\bCAST\s*\(/.test(upperQuery)) concepts.push('CAST');
  if (/\bCONVERT\s*\(/.test(upperQuery)) concepts.push('CONVERT');
  if (upperQuery.includes('WITH ') && !upperQuery.includes('WITH NOLOCK')) concepts.push('CTE');

  return [...new Set(concepts)]; // Remove duplicates
};

interface FlatQuery extends SQLQuery {
  moduleTitle: string;
  moduleIcon: string;
  lessonTitle: string;
  globalIndex: number;
}

const Practice = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { completedCount, totalQueries, progressPercent, markCompleted, isCompleted, getFirstIncomplete } = useProgress();
  const [activeTab, setActiveTab] = useState<'schema' | 'reference' | 'relationships'>('schema');
  const [isExecuting, setIsExecuting] = useState(false);

  // Pre-initialize the database when component mounts
  useEffect(() => {
    initSqlDatabase().catch(console.error);
  }, []);

  // Flatten all queries into a single array
  const allQueries: FlatQuery[] = useMemo(() => {
    const queries: FlatQuery[] = [];
    let globalIndex = 0;
    sqlCurriculum.forEach(module => {
      module.lessons.forEach(lesson => {
        lesson.queries.forEach(query => {
          queries.push({
            ...query,
            moduleTitle: module.title,
            moduleIcon: module.icon,
            lessonTitle: lesson.title,
            globalIndex: globalIndex++,
          });
        });
      });
    });
    return queries;
  }, []);

  // Find starting position from URL param or first incomplete query
  const getStartingIndex = useCallback(() => {
    const urlIndex = searchParams.get('q');
    if (urlIndex !== null) {
      const idx = parseInt(urlIndex, 10);
      if (!isNaN(idx) && idx >= 0 && idx < allQueries.length) {
        return idx;
      }
    }
    const firstIncomplete = getFirstIncomplete();
    if (firstIncomplete) {
      const idx = allQueries.findIndex(q => q.id === firstIncomplete);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  }, [allQueries, getFirstIncomplete, searchParams]);

  const [currentIndex, setCurrentIndex] = useState(getStartingIndex);
  const [results, setResults] = useState<Record<string, any>[] | null>(null);
  const [resultSets, setResultSets] = useState<{ columns: string[]; rows: Record<string, any>[] }[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Update index when URL param changes
  useEffect(() => {
    const urlIndex = searchParams.get('q');
    if (urlIndex !== null) {
      const idx = parseInt(urlIndex, 10);
      if (!isNaN(idx) && idx >= 0 && idx < allQueries.length && idx !== currentIndex) {
        setCurrentIndex(idx);
        setResults(null);
        setResultSets(null);
        setMessage(null);
        setIsError(false);
      }
    }
  }, [searchParams, allQueries.length]);

  const currentQuery = allQueries[currentIndex];
  const isCurrentCompleted = currentQuery ? isCompleted(currentQuery.id) : false;

  const handleRunQuery = useCallback(async (query: string) => {
    setIsExecuting(true);
    setMessage('Executing query...');
    setIsError(false);
    setResults(null);
    setResultSets(null);

    try {
      // Execute the user's query
      const userResult = await executeQueryAsync(query, currentQuery?.setupSql);
      setResults(userResult.data);
      setResultSets(userResult.resultSets);

      // If user query has an error, show it
      if (userResult.isError) {
        setMessage(userResult.message);
        setIsError(true);
        return;
      }

      // For SELECT queries, validate against the expected solution
      if (currentQuery) {
        const userQueryUpper = query.trim().toUpperCase();
        const isSelectQuery = userQueryUpper.startsWith('SELECT') || userQueryUpper.startsWith('WITH');

        // Skip validation for DDL/DML queries (CREATE, INSERT, UPDATE, DELETE, etc.)
        const isDDLorDML = /^(CREATE|ALTER|DROP|INSERT|UPDATE|DELETE|TRUNCATE|EXEC)/i.test(query.trim());

        if (isSelectQuery && !isDDLorDML && currentQuery.query) {
          // Execute the reference solution to get expected results
          const expectedResult = await executeQueryAsync(currentQuery.query, currentQuery.setupSql);

          if (!expectedResult.isError && expectedResult.data) {
            // Compare results
            const userColumns = userResult.data && userResult.data.length > 0
              ? Object.keys(userResult.data[0]).map(c => c.toLowerCase()).sort()
              : [];
            const expectedColumns = expectedResult.data.length > 0
              ? Object.keys(expectedResult.data[0]).map(c => c.toLowerCase()).sort()
              : [];

            // Check column match
            const columnsMatch = JSON.stringify(userColumns) === JSON.stringify(expectedColumns);

            if (!columnsMatch) {
              const expectedColsStr = expectedResult.data.length > 0
                ? Object.keys(expectedResult.data[0]).join(', ')
                : '(none)';
              const actualColsStr = userResult.data && userResult.data.length > 0
                ? Object.keys(userResult.data[0]).join(', ')
                : '(none)';

              setMessage(`Column mismatch!\n\nExpected columns: ${expectedColsStr}\nYour columns: ${actualColsStr}\n\nHint: Make sure you're selecting the exact columns specified in the task.`);
              setIsError(true);
              return;
            }

            // Check row count
            const expectedRowCount = expectedResult.data.length;
            const actualRowCount = userResult.data ? userResult.data.length : 0;

            if (expectedRowCount !== actualRowCount) {
              setMessage(`Row count mismatch!\n\nExpected: ${expectedRowCount} row(s)\nYour result: ${actualRowCount} row(s)\n\nHint: Check your WHERE clause, JOIN conditions, or filters.`);
              setIsError(true);
              return;
            }

            // Check data content
            if (expectedRowCount > 0 && actualRowCount > 0) {
              const normalizeValue = (v: unknown): string => {
                if (v === null || v === undefined) return 'NULL';
                if (typeof v === 'number') return Number.isInteger(v) ? String(v) : v.toFixed(2);
                return String(v).trim();
              };

              const rowToString = (row: Record<string, unknown>, cols: string[]): string => {
                return cols.map(c => {
                  const key = Object.keys(row).find(k => k.toLowerCase() === c);
                  return normalizeValue(key ? row[key] : null);
                }).join('|');
              };

              // Check if the expected query has ORDER BY - if so, order matters!
              const expectedQueryUpper = currentQuery.query.toUpperCase();
              const orderByMatters = expectedQueryUpper.includes('ORDER BY');

              const expectedStrings = expectedResult.data
                .map(row => rowToString(row, expectedColumns));
              const actualStrings = userResult.data!
                .map(row => rowToString(row, expectedColumns));

              let dataMatches: boolean;

              if (orderByMatters) {
                // Order-sensitive comparison - rows must be in exact same order
                dataMatches = JSON.stringify(expectedStrings) === JSON.stringify(actualStrings);

                if (!dataMatches) {
                  setMessage(`Order mismatch!\n\nYour query returned the correct data, but in the wrong order.\n\nHint: This task requires a specific ORDER BY clause. Check that you're sorting by the correct column(s) and direction (ASC/DESC).`);
                  setIsError(true);
                  return;
                }
              } else {
                // Order-independent comparison - just check same data exists
                const sortedExpected = [...expectedStrings].sort();
                const sortedActual = [...actualStrings].sort();
                dataMatches = JSON.stringify(sortedExpected) === JSON.stringify(sortedActual);

                if (!dataMatches) {
                  setMessage(`Data mismatch!\n\nYour query returned different values than expected.\n\nHint: Check your query logic - the columns and row count are correct, but the data values differ.`);
                  setIsError(true);
                  return;
                }
              }
            }
          }
        }

        // All validations passed - mark as complete
        setMessage(userResult.message || 'Query executed successfully.');
        setIsError(false);
        markCompleted(currentQuery.id);

        if (completedCount + 1 === totalQueries) {
          setShowCelebration(true);
        }
      } else {
        setMessage(userResult.message);
        setIsError(userResult.isError);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'An error occurred');
      setIsError(true);
    } finally {
      setIsExecuting(false);
    }
  }, [currentQuery, markCompleted, completedCount, totalQueries]);

  const goToQuery = useCallback((index: number) => {
    if (index >= 0 && index < allQueries.length) {
      setCurrentIndex(index);
      setResults(null);
      setResultSets(null);
      setMessage(null);
      setIsError(false);
      // Update URL to match current query
      navigate(`/practice?q=${index}`, { replace: true });
    }
  }, [allQueries.length, navigate]);

  const goNext = useCallback(() => goToQuery(currentIndex + 1), [currentIndex, goToQuery]);
  const goPrev = useCallback(() => goToQuery(currentIndex - 1), [currentIndex, goToQuery]);

  if (!currentQuery) return null;

  const tablesUsed = currentQuery.tablesUsed || detectTablesUsed(currentQuery.query);
  const conceptsCovered = currentQuery.conceptsCovered || detectConcepts(currentQuery.query);

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowCelebration(false)}>
          <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md mx-4 transform animate-bounce-in">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Congratulations! 🎉</h2>
            <p className="text-slate-500 mb-6">You've completed all {totalQueries} SQL queries! You're now an SQL master!</p>
            <button
              onClick={() => setShowCelebration(false)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Navigation */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img src="/logo.svg" alt="AfterSELECT" className="w-8 h-8" />
              <span className="font-bold text-lg hidden sm:flex">
                <span className="text-blue-600">After</span>
                <span className="text-orange-500">SELECT</span>
              </span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <button
              onClick={() => navigate('/explore')}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium"
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="hidden md:inline">All Queries</span>
            </button>
          </div>

          {/* Center: Query Navigation */}
          <div className="flex items-center gap-2 lg:gap-4">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className={cn(
                "p-2 rounded-lg transition-all",
                currentIndex === 0
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg">
              <span className="text-sm font-semibold text-slate-700">{currentIndex + 1}</span>
              <span className="text-slate-400">/</span>
              <span className="text-sm text-slate-500">{allQueries.length}</span>
            </div>

            <button
              onClick={goNext}
              disabled={currentIndex === allQueries.length - 1}
              className={cn(
                "p-2 rounded-lg transition-all",
                currentIndex === allQueries.length - 1
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right: Progress */}
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-32 lg:w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-500">{Math.round(progressPercent)}%</span>
              </div>
            </div>
            {progressPercent === 100 && <Trophy className="w-5 h-5 text-yellow-500" />}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Problem Description */}
        <div className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-5 lg:p-6">
            {/* Problem Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{currentQuery.moduleIcon}</span>
                <span className="text-sm font-medium text-slate-500">{currentQuery.moduleTitle}</span>
                <span className="text-slate-300">•</span>
                <span className="text-sm text-slate-400">{currentQuery.lessonTitle}</span>
              </div>

              <div className="flex items-start justify-between gap-3 mb-4">
                <h1 className="text-xl lg:text-2xl font-bold text-slate-800 leading-tight">
                  {currentQuery.title}
                </h1>
                <div className="flex items-center gap-2 shrink-0">
                  {isCurrentCompleted && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                      <Check className="w-3 h-3" />
                      Done
                    </span>
                  )}
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium",
                    currentQuery.difficulty === 'beginner' && "bg-green-50 text-green-600",
                    currentQuery.difficulty === 'intermediate' && "bg-orange-50 text-orange-600",
                    currentQuery.difficulty === 'advanced' && "bg-purple-50 text-purple-600"
                  )}>
                    {currentQuery.difficulty.charAt(0).toUpperCase() + currentQuery.difficulty.slice(1)}
                  </span>
                </div>
              </div>

              <p
                className="text-slate-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: currentQuery.description.replace(
                    /\*\*([^*]+)\*\*/g,
                    '<strong class="font-semibold text-slate-800">$1</strong>'
                  )
                }}
              />
            </div>

            {/* Concepts Covered */}
            {conceptsCovered.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Concepts</h3>
                <div className="flex flex-wrap gap-1.5">
                  {conceptsCovered.map(concept => (
                    <span
                      key={concept}
                      className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-slate-100 my-6" />

            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-4">
              <button
                onClick={() => setActiveTab('schema')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-all",
                  activeTab === 'schema'
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
                <span>Schema</span>
              </button>
              <button
                onClick={() => setActiveTab('reference')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-all",
                  activeTab === 'reference'
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <BookOpen className="w-4 h-4" />
                <span>Reference</span>
              </button>
              <button
                onClick={() => setActiveTab('relationships')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-all",
                  activeTab === 'relationships'
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Lightbulb className="w-4 h-4" />
                <span>ERD</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-0">
              {activeTab === 'schema' && (
                <DataPreview defaultExpanded highlightedTables={tablesUsed} />
              )}
              {activeTab === 'reference' && (
                <SyntaxReference currentConcepts={conceptsCovered} />
              )}
              {activeTab === 'relationships' && (
                <SchemaRelationship highlightedTables={tablesUsed} />
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Editor and Results */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
          {/* Editor Area */}
          <div className="flex-1 p-4 lg:p-6 overflow-hidden flex flex-col gap-4">
            {/* SQL Editor */}
            <div className="flex-1 min-h-[200px]">
              <SQLEditor
                key={currentQuery.id}
                initialQuery={currentQuery.query}
                onRun={handleRunQuery}
              />
            </div>

            {/* Results Panel */}
            <div className="flex-1 min-h-[150px] overflow-hidden">
              <ResultsPanel results={results} resultSets={resultSets} message={message} isError={isError} />
            </div>
          </div>

          {/* Bottom Action Bar */}
          {!isError && (results !== null || message) && currentIndex < allQueries.length - 1 && (
            <div className="border-t border-slate-200 bg-white px-4 lg:px-6 py-4 flex-shrink-0">
              <button
                onClick={goNext}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-green-500/20"
              >
                <span>Continue to Next Query</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Practice;
