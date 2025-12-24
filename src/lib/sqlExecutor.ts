import initSqlJs, { Database } from 'sql.js';

type QueryResult = {
  data: Record<string, any>[] | null;
  message: string | null;
  isError: boolean;
};

let db: Database | null = null;
let dbInitPromise: Promise<void> | null = null;

// Initialize the SQLite database with sample data
async function initDatabase(): Promise<void> {
  if (db) return;

  const SQL = await initSqlJs({
    // Load sql.js wasm from CDN
    locateFile: (file: string) => `https://sql.js.org/dist/${file}`
  });

  db = new SQL.Database();

  // Create tables
  db.run(`
    CREATE TABLE customers (
      id INTEGER PRIMARY KEY,
      first_name TEXT,
      country TEXT,
      score INTEGER
    )
  `);

  db.run(`
    CREATE TABLE orders (
      order_id INTEGER PRIMARY KEY,
      customer_id INTEGER,
      sales REAL,
      order_date TEXT,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
  `);

  db.run(`
    CREATE TABLE products (
      product_id INTEGER PRIMARY KEY,
      product_name TEXT,
      category TEXT,
      price REAL
    )
  `);

  db.run(`
    CREATE TABLE employees (
      employee_id INTEGER PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      department TEXT,
      salary INTEGER
    )
  `);

  // Insert sample data - customers
  db.run(`INSERT INTO customers VALUES (1, 'John', 'USA', 500)`);
  db.run(`INSERT INTO customers VALUES (2, 'Maria', 'Germany', 750)`);
  db.run(`INSERT INTO customers VALUES (3, 'Ahmed', 'France', 300)`);
  db.run(`INSERT INTO customers VALUES (4, 'Yuki', 'Japan', 890)`);
  db.run(`INSERT INTO customers VALUES (5, 'Carlos', 'USA', 150)`);

  // Insert sample data - orders
  db.run(`INSERT INTO orders VALUES (101, 1, 250.00, '2024-01-15')`);
  db.run(`INSERT INTO orders VALUES (102, 2, 450.50, '2024-02-20')`);
  db.run(`INSERT INTO orders VALUES (103, 1, 125.00, '2024-03-10')`);
  db.run(`INSERT INTO orders VALUES (104, 4, 890.00, '2024-04-05')`);
  db.run(`INSERT INTO orders VALUES (105, 3, 67.50, '2024-05-12')`);

  // Insert sample data - products
  db.run(`INSERT INTO products VALUES (1, 'Laptop', 'Electronics', 999.99)`);
  db.run(`INSERT INTO products VALUES (2, 'Headphones', 'Electronics', 149.99)`);
  db.run(`INSERT INTO products VALUES (3, 'Coffee Maker', 'Appliances', 79.50)`);
  db.run(`INSERT INTO products VALUES (4, 'Desk Chair', 'Furniture', 299.00)`);
  db.run(`INSERT INTO products VALUES (5, 'Monitor', 'Electronics', 349.99)`);

  // Insert sample data - employees
  db.run(`INSERT INTO employees VALUES (1, 'Sarah', 'Johnson', 'Sales', 65000)`);
  db.run(`INSERT INTO employees VALUES (2, 'Mike', 'Chen', 'Engineering', 85000)`);
  db.run(`INSERT INTO employees VALUES (3, 'Lisa', 'Williams', 'Marketing', 55000)`);
  db.run(`INSERT INTO employees VALUES (4, 'David', 'Brown', 'Sales', 72000)`);
  db.run(`INSERT INTO employees VALUES (5, 'Emma', 'Davis', 'Engineering', 92000)`);
}

// Ensure database is initialized (singleton pattern)
function ensureInitialized(): Promise<void> {
  if (!dbInitPromise) {
    dbInitPromise = initDatabase();
  }
  return dbInitPromise;
}

// Pre-validation for learners - catches common mistakes before sending to SQLite
// This is important because SQL allows things like "column1 column2" as aliasing,
// but beginners often forget commas, so we want to catch this.
function validateQueryForLearners(query: string): { isValid: boolean; error?: string } {
  const upperQuery = query.toUpperCase();

  // Only validate SELECT queries
  if (!upperQuery.trim().startsWith('SELECT')) {
    return { isValid: true };
  }

  // Extract the SELECT clause (between SELECT and FROM)
  const selectMatch = query.match(/SELECT\s+([\s\S]*?)\s+FROM/i);
  if (!selectMatch) {
    return { isValid: true }; // Let SQLite handle missing FROM
  }

  const selectClause = selectMatch[1].trim();

  // Skip if it's SELECT *
  if (selectClause === '*' || selectClause.toUpperCase() === 'DISTINCT *') {
    return { isValid: true };
  }

  // Remove string literals to avoid false positives
  const cleanedClause = selectClause
    .replace(/'[^']*'/g, '""') // Replace string literals
    .replace(/--.*$/gm, '') // Remove comments
    .replace(/\([^)]*\)/g, '()'); // Simplify function calls

  // Check for patterns that look like forgotten commas
  // Pattern: identifier followed by whitespace then another identifier (not AS, or SQL keywords)
  const lines = cleanedClause.split(/\n/);
  const sqlKeywords = ['as', 'from', 'where', 'and', 'or', 'not', 'in', 'is', 'null', 'like', 'between', 'case', 'when', 'then', 'else', 'end', 'distinct', 'all', 'top'];

  for (let i = 0; i < lines.length - 1; i++) {
    const currentLine = lines[i].trim();
    const nextLine = lines[i + 1].trim();

    // Skip empty lines
    if (!currentLine || !nextLine) continue;

    // Check if current line ends with an identifier (no comma)
    // and next line starts with an identifier (not a keyword)
    const currentEndsWithIdentifier = /^[a-z_]\w*$/i.test(currentLine) || /[a-z_]\w*$/i.test(currentLine.split(/\s+/).pop() || '');
    const nextStartsWithIdentifier = /^[a-z_]\w*$/i.test(nextLine.split(/\s+/)[0] || '');
    const nextFirstWord = (nextLine.split(/\s+/)[0] || '').toLowerCase();

    // If current line doesn't end with comma and next line starts with identifier (not a keyword)
    if (!currentLine.endsWith(',') && currentEndsWithIdentifier && nextStartsWithIdentifier) {
      if (!sqlKeywords.includes(nextFirstWord) && nextFirstWord !== 'from') {
        return {
          isValid: false,
          error: `Syntax error: Missing comma after '${currentLine.split(/\s+/).pop()}'. Each column must be separated by a comma. Did you mean to write:\n\n${currentLine},\n${nextLine}\n\nExample: SELECT col1, col2, col3 FROM table`
        };
      }
    }
  }

  // Also check within single lines for consecutive identifiers without commas
  const tokens = cleanedClause.replace(/\s+/g, ' ').split(' ');
  for (let i = 0; i < tokens.length - 1; i++) {
    const current = tokens[i].replace(/,$/g, '');
    const next = tokens[i + 1];

    // Skip if current ends with comma
    if (tokens[i].endsWith(',')) continue;

    // Skip SQL keywords
    if (sqlKeywords.includes(current.toLowerCase()) || sqlKeywords.includes(next.toLowerCase())) continue;

    // Skip if it looks like "column AS alias" pattern
    if (next.toLowerCase() === 'as') continue;
    if (i > 0 && tokens[i - 1].toLowerCase() === 'as') continue;

    // Check for two consecutive identifiers
    const isCurrentIdentifier = /^[a-z_]\w*$/i.test(current);
    const isNextIdentifier = /^[a-z_]\w*$/i.test(next);

    if (isCurrentIdentifier && isNextIdentifier) {
      // This looks like "column1 column2" without comma - likely a forgotten comma
      // Note: This IS valid SQL (it's aliasing), but for learners we want to catch it
      return {
        isValid: false,
        error: `Possible missing comma: '${current} ${next}' looks like you forgot a comma between columns. In SQL, 'column1 column2' means 'column1 AS column2' (aliasing).\n\nIf you want both columns, use: ${current}, ${next}\nIf you want to alias '${current}' as '${next}', use: ${current} AS ${next}`
      };
    }
  }

  return { isValid: true };
}

// Execute a SQL query using real SQLite
export async function executeQueryAsync(query: string): Promise<QueryResult> {
  try {
    await ensureInitialized();

    if (!db) {
      return {
        data: null,
        message: 'Database not initialized. Please try again.',
        isError: true,
      };
    }

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return {
        data: null,
        message: 'Please enter a SQL query.',
        isError: true,
      };
    }

    // Pre-validate for common learner mistakes before sending to SQLite
    const validation = validateQueryForLearners(trimmedQuery);
    if (!validation.isValid) {
      return {
        data: null,
        message: validation.error || 'Invalid query syntax.',
        isError: true,
      };
    }

    // Execute the query
    const results = db.exec(trimmedQuery);

    if (results.length === 0) {
      // Query executed but returned no results (e.g., DDL or empty SELECT)
      const upperQuery = trimmedQuery.toUpperCase();
      if (upperQuery.startsWith('SELECT')) {
        return {
          data: [],
          message: 'Query executed successfully. No rows returned.',
          isError: false,
        };
      } else if (upperQuery.startsWith('INSERT')) {
        return {
          data: null,
          message: 'INSERT executed successfully. Row(s) added.',
          isError: false,
        };
      } else if (upperQuery.startsWith('UPDATE')) {
        return {
          data: null,
          message: 'UPDATE executed successfully. Row(s) modified.',
          isError: false,
        };
      } else if (upperQuery.startsWith('DELETE')) {
        return {
          data: null,
          message: 'DELETE executed successfully. Row(s) removed.',
          isError: false,
        };
      } else if (upperQuery.startsWith('CREATE')) {
        return {
          data: null,
          message: 'CREATE executed successfully.',
          isError: false,
        };
      } else if (upperQuery.startsWith('DROP')) {
        return {
          data: null,
          message: 'DROP executed successfully.',
          isError: false,
        };
      } else if (upperQuery.startsWith('ALTER')) {
        return {
          data: null,
          message: 'ALTER executed successfully.',
          isError: false,
        };
      }
      return {
        data: null,
        message: 'Query executed successfully.',
        isError: false,
      };
    }

    // Convert results to array of objects
    const result = results[0];
    const columns = result.columns;
    const values = result.values;

    const data = values.map(row => {
      const obj: Record<string, any> = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });

    return {
      data,
      message: null,
      isError: false,
    };

  } catch (error) {
    // SQLite will throw real SQL errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Clean up the error message to be more user-friendly
    let friendlyMessage = errorMessage;

    // Common SQLite error patterns
    if (errorMessage.includes('no such table')) {
      const match = errorMessage.match(/no such table: (\w+)/);
      friendlyMessage = match
        ? `Error: Table '${match[1]}' does not exist. Available tables: customers, orders, products, employees`
        : errorMessage;
    } else if (errorMessage.includes('no such column')) {
      const match = errorMessage.match(/no such column: (\w+)/);
      friendlyMessage = match
        ? `Error: Column '${match[1]}' does not exist in the specified table.`
        : errorMessage;
    } else if (errorMessage.includes('syntax error')) {
      friendlyMessage = `SQL Syntax Error: ${errorMessage}. Check your query for typos, missing commas, or incorrect keywords.`;
    } else if (errorMessage.includes('near')) {
      // SQLite often says "near 'something': syntax error"
      friendlyMessage = `SQL Error: ${errorMessage}`;
    }

    return {
      data: null,
      message: friendlyMessage,
      isError: true,
    };
  }
}

// Synchronous wrapper for backwards compatibility (shows loading state)
export function executeQuery(query: string): QueryResult {
  // This is a synchronous stub - the actual async execution happens in the component
  // We return a loading indicator that will be replaced by the async result
  return {
    data: null,
    message: 'Executing query...',
    isError: false,
  };
}

// Export initialization function for preloading
export { ensureInitialized as initSqlDatabase };
