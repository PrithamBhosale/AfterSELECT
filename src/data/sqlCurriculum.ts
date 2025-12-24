export interface SQLQuery {
  id: string;
  title: string;
  description: string;
  query: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  hint?: string;
  explanation?: string;
  tablesUsed?: ('customers' | 'orders' | 'products' | 'employees')[];
  conceptsCovered?: string[];
  /** Expected columns that must be returned by the query (case-insensitive). If set, validation will check that the result contains EXACTLY these columns. */
  expectedColumns?: string[];
}

export interface SQLLesson {
  id: string;
  title: string;
  description: string;
  queries: SQLQuery[];
}

export interface SQLModule {
  id: string;
  title: string;
  icon: string;
  color: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';
  description: string;
  lessons: SQLLesson[];
}

export const sqlCurriculum: SQLModule[] = [
  // MODULE 1: SELECT Queries
  {
    id: 'select',
    title: 'SELECT Queries',
    icon: '🔍',
    color: 'blue',
    description: 'Master the fundamentals of retrieving data',
    lessons: [
      {
        id: 'select-basics',
        title: 'Basic SELECT',
        description: 'Retrieve data from tables',
        queries: [
          { id: 'sel-1', title: 'Select All Columns', description: 'Using the **customers** table, write a SELECT * query to retrieve all columns and all rows', query: `SELECT *\nFROM customers`, difficulty: 'beginner' },
          { id: 'sel-2', title: 'Select All Orders', description: 'Using the **orders** table, write a SELECT * query to retrieve all order data', query: `SELECT *\nFROM orders`, difficulty: 'beginner' },
          { id: 'sel-3', title: 'Select Specific Columns', description: 'From the **customers** table, retrieve only the first_name, country, and score columns (do not use SELECT *)', query: `SELECT \n    first_name,\n    country, \n    score\nFROM customers`, difficulty: 'beginner', expectedColumns: ['first_name', 'country', 'score'] },
        ]
      },
      {
        id: 'select-where',
        title: 'WHERE Clause',
        description: 'Filter data with conditions',
        queries: [
          { id: 'sel-4', title: 'Filter Non-Zero Scores', description: 'From the **customers** table, select all columns but only show customers whose score is not equal to 0', query: `SELECT *\nFROM customers\nWHERE score != 0`, difficulty: 'beginner' },
          { id: 'sel-5', title: 'Filter by Country', description: 'From the **customers** table, select all columns but only show customers from Germany', query: `SELECT *\nFROM customers\nWHERE country = 'Germany'`, difficulty: 'beginner' },
          { id: 'sel-6', title: 'Specific Columns with Filter', description: 'From the **customers** table, select only the first_name and country columns for customers from Germany', query: `SELECT\n    first_name,\n    country\nFROM customers\nWHERE country = 'Germany'`, difficulty: 'beginner', expectedColumns: ['first_name', 'country'] },
        ]
      },
      {
        id: 'select-orderby',
        title: 'ORDER BY',
        description: 'Sort your results',
        queries: [
          { id: 'sel-7', title: 'Sort Descending', description: 'From the **customers** table, retrieve all columns and sort by score from highest to lowest (DESC)', query: `SELECT *\nFROM customers\nORDER BY score DESC`, difficulty: 'beginner' },
          { id: 'sel-8', title: 'Sort Ascending', description: 'From the **customers** table, retrieve all columns and sort by score from lowest to highest (ASC)', query: `SELECT *\nFROM customers\nORDER BY score ASC`, difficulty: 'beginner' },
          { id: 'sel-9', title: 'Sort by Text', description: 'From the **customers** table, retrieve all columns and sort alphabetically by country name (A-Z)', query: `SELECT *\nFROM customers\nORDER BY country ASC`, difficulty: 'beginner' },
          { id: 'sel-10', title: 'Multiple Sort Columns', description: 'From the **customers** table, sort first by country (A-Z), then by score (highest first) within each country', query: `SELECT *\nFROM customers\nORDER BY country ASC, score DESC`, difficulty: 'intermediate' },
          { id: 'sel-11', title: 'WHERE + ORDER BY', description: 'From the **customers** table, select first_name, country, and score for customers with non-zero scores, sorted by highest score first', query: `SELECT\n    first_name,\n    country,\n    score\nFROM customers\nWHERE score != 0\nORDER BY score DESC`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'select-groupby',
        title: 'GROUP BY',
        description: 'Aggregate data into groups',
        queries: [
          { id: 'sel-12', title: 'Sum by Group', description: 'From the **customers** table, group by country and calculate the total score for each country using SUM(). Name the result column "total_score"', query: `SELECT \n    country,\n    SUM(score) AS total_score\nFROM customers\nGROUP BY country`, difficulty: 'intermediate' },
          { id: 'sel-13', title: 'Multiple Aggregates', description: 'From the **customers** table, group by country and show both total_score (SUM) and total_customers (COUNT)', query: `SELECT \n    country,\n    SUM(score) AS total_score,\n    COUNT(id) AS total_customers\nFROM customers\nGROUP BY country`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'select-having',
        title: 'HAVING',
        description: 'Filter grouped results',
        queries: [
          { id: 'sel-14', title: 'HAVING with AVG', description: 'From the **customers** table, group by country and show only countries where the average score is greater than 430. Display country and avg_score', query: `SELECT\n    country,\n    AVG(score) AS avg_score\nFROM customers\nGROUP BY country\nHAVING AVG(score) > 430`, difficulty: 'intermediate' },
          { id: 'sel-15', title: 'WHERE + HAVING', description: 'From the **customers** table, first exclude zero scores (WHERE), then group by country and filter to show only groups with average score > 430 (HAVING)', query: `SELECT\n    country,\n    AVG(score) AS avg_score\nFROM customers\nWHERE score != 0\nGROUP BY country\nHAVING AVG(score) > 430`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'select-distinct-top',
        title: 'DISTINCT & TOP',
        description: 'Unique values and limiting results',
        queries: [
          { id: 'sel-16', title: 'DISTINCT Values', description: 'From the **customers** table, get a list of unique country names (no duplicates) using DISTINCT', query: `SELECT DISTINCT country\nFROM customers`, difficulty: 'beginner' },
          { id: 'sel-17', title: 'TOP N Rows', description: 'From the **customers** table, retrieve only the first 3 rows using TOP 3', query: `SELECT TOP 3 *\nFROM customers`, difficulty: 'beginner' },
          { id: 'sel-18', title: 'Top with ORDER BY', description: 'From the **customers** table, get the 3 customers with the highest scores using TOP 3 and ORDER BY', query: `SELECT TOP 3 *\nFROM customers\nORDER BY score DESC`, difficulty: 'beginner' },
          { id: 'sel-19', title: 'Bottom N Analysis', description: 'From the **customers** table, find the 2 customers with the lowest scores using TOP 2 and ORDER BY ASC', query: `SELECT TOP 2 *\nFROM customers\nORDER BY score ASC`, difficulty: 'beginner' },
          { id: 'sel-20', title: 'Recent Orders', description: 'From the **orders** table, get the 2 most recent orders by sorting by order_date in descending order', query: `SELECT TOP 2 *\nFROM orders\nORDER BY order_date DESC`, difficulty: 'beginner' },
        ]
      },
      {
        id: 'select-combined',
        title: 'Combining Everything',
        description: 'Put it all together',
        queries: [
          { id: 'sel-21', title: 'Complete Query', description: 'From the **customers** table: exclude zero scores (WHERE), group by country, filter groups with avg > 430 (HAVING), and sort by highest average first. Show country and avg_score', query: `SELECT\n    country,\n    AVG(score) AS avg_score\nFROM customers\nWHERE score != 0\nGROUP BY country\nHAVING AVG(score) > 430\nORDER BY AVG(score) DESC`, difficulty: 'advanced' },
          { id: 'sel-22', title: 'Multiple Queries', description: 'Write two separate SELECT * statements in one batch: first from **customers**, then from **orders** (use semicolon to separate)', query: `SELECT * FROM customers;\nSELECT * FROM orders;`, difficulty: 'beginner' },
          { id: 'sel-23', title: 'Static Values', description: 'Write two queries that select constant values without any table: first SELECT 123 AS static_number, then SELECT \'Hello\' AS static_string', query: `SELECT 123 AS static_number;\n\nSELECT 'Hello' AS static_string;`, difficulty: 'beginner' },
          { id: 'sel-24', title: 'Add Constant Column', description: 'From the **customers** table, select id, first_name, and add a constant column customer_type with value \'New Customer\' for all rows', query: `SELECT\n    id,\n    first_name,\n    'New Customer' AS customer_type\nFROM customers`, difficulty: 'intermediate' },
        ]
      }
    ]
  },

  // MODULE 2: DDL
  {
    id: 'ddl',
    title: 'Data Definition (DDL)',
    icon: '🏗️',
    color: 'green',
    description: 'Create and modify database structures',
    lessons: [
      {
        id: 'ddl-create',
        title: 'CREATE TABLE',
        description: 'Create new database tables',
        queries: [
          { id: 'ddl-1', title: 'Create Table', description: 'Create a new **persons** table with columns: id (INT NOT NULL), person_name (VARCHAR(50) NOT NULL), birth_date (DATE), phone (VARCHAR(15) NOT NULL), and a PRIMARY KEY on id', query: `CREATE TABLE persons (\n    id INT NOT NULL,\n    person_name VARCHAR(50) NOT NULL,\n    birth_date DATE,\n    phone VARCHAR(15) NOT NULL,\n    CONSTRAINT pk_persons PRIMARY KEY (id)\n)`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'ddl-alter',
        title: 'ALTER TABLE',
        description: 'Modify existing tables',
        queries: [
          { id: 'ddl-2', title: 'Add Column', description: 'Using ALTER TABLE on **persons**, add a new column "email" with type VARCHAR(50) NOT NULL', query: `ALTER TABLE persons\nADD email VARCHAR(50) NOT NULL`, difficulty: 'intermediate' },
          { id: 'ddl-3', title: 'Drop Column', description: 'Using ALTER TABLE on **persons**, remove the "phone" column from the table', query: `ALTER TABLE persons\nDROP COLUMN phone`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'ddl-drop',
        title: 'DROP TABLE',
        description: 'Delete tables from database',
        queries: [
          { id: 'ddl-4', title: 'Drop Table', description: 'Write a DROP TABLE statement to permanently delete the **persons** table and all its data', query: `DROP TABLE persons`, difficulty: 'intermediate' },
        ]
      }
    ]
  },

  // MODULE 3: DML
  {
    id: 'dml',
    title: 'Data Manipulation (DML)',
    icon: '✏️',
    color: 'orange',
    description: 'Insert, update, and delete data',
    lessons: [
      {
        id: 'dml-insert',
        title: 'INSERT',
        description: 'Add new data to tables',
        queries: [
          { id: 'dml-1', title: 'Insert Multiple Rows', description: 'Insert 2 rows into **customers** (id, first_name, country, score) with values: (6, \'Anna\', \'USA\', NULL) and (7, \'Sam\', NULL, 100)', query: `INSERT INTO customers (id, first_name, country, score)\nVALUES \n    (6, 'Anna', 'USA', NULL),\n    (7, 'Sam', NULL, 100)`, difficulty: 'beginner' },
          { id: 'dml-2', title: 'Insert Single Row', description: 'Insert one row into **customers**: id=8, first_name=\'Max\', country=\'USA\', score=368', query: `INSERT INTO customers (id, first_name, country, score)\nVALUES (8, 'Max', 'USA', 368)`, difficulty: 'beginner' },
          { id: 'dml-3', title: 'Insert Without Columns', description: 'Insert into **customers** without column names: (9, \'Andreas\', \'Germany\', NULL). Values must match column order', query: `INSERT INTO customers \nVALUES \n    (9, 'Andreas', 'Germany', NULL)`, difficulty: 'intermediate' },
          { id: 'dml-4', title: 'Partial Insert', description: 'Insert into **customers** with only id=10 and first_name=\'Sahra\'. Other columns will be NULL', query: `INSERT INTO customers (id, first_name)\nVALUES \n    (10, 'Sahra')`, difficulty: 'beginner' },
          { id: 'dml-5', title: 'Insert from SELECT', description: 'Copy data from **customers** into **persons** using INSERT...SELECT. Map first_name→person_name, use NULL for birth_date, \'Unknown\' for phone', query: `INSERT INTO persons (id, person_name, birth_date, phone)\nSELECT\n    id,\n    first_name,\n    NULL,\n    'Unknown'\nFROM customers`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'dml-update',
        title: 'UPDATE',
        description: 'Modify existing data',
        queries: [
          { id: 'dml-6', title: 'Update Single Column', description: 'In the **customers** table, UPDATE score to 0 for the row where id = 6', query: `UPDATE customers\nSET score = 0\nWHERE id = 6`, difficulty: 'beginner' },
          { id: 'dml-7', title: 'Update Multiple Columns', description: 'In the **customers** table, UPDATE both score=0 and country=\'UK\' for the row where id = 10', query: `UPDATE customers\nSET score = 0,\n    country = 'UK'\nWHERE id = 10`, difficulty: 'beginner' },
          { id: 'dml-8', title: 'Update NULL Values', description: 'In the **customers** table, UPDATE all rows where score IS NULL to set score = 0', query: `UPDATE customers\nSET score = 0\nWHERE score IS NULL`, difficulty: 'intermediate' },
          { id: 'dml-9', title: 'Verify Update', description: 'From the **customers** table, SELECT all rows where score IS NULL to verify no NULL scores remain', query: `SELECT *\nFROM customers\nWHERE score IS NULL`, difficulty: 'beginner' },
        ]
      },
      {
        id: 'dml-delete',
        title: 'DELETE',
        description: 'Remove data from tables',
        queries: [
          { id: 'dml-10', title: 'Preview Before Delete', description: 'From the **customers** table, SELECT all rows where id > 5 (preview before DELETE)', query: `SELECT *\nFROM customers\nWHERE id > 5`, difficulty: 'beginner' },
          { id: 'dml-11', title: 'Delete with WHERE', description: 'From the **customers** table, DELETE all rows where id > 5', query: `DELETE FROM customers\nWHERE id > 5`, difficulty: 'intermediate' },
          { id: 'dml-12', title: 'Delete All Rows', description: 'Use DELETE without WHERE to remove all rows from the **persons** table (table structure remains)', query: `DELETE FROM persons`, difficulty: 'intermediate' },
          { id: 'dml-13', title: 'TRUNCATE Table', description: 'Use TRUNCATE TABLE to quickly remove all rows from **persons** (faster than DELETE)', query: `TRUNCATE TABLE persons`, difficulty: 'intermediate' },
        ]
      }
    ]
  },

  // MODULE 4: Filtering
  {
    id: 'filtering',
    title: 'Filtering Data',
    icon: '🎯',
    color: 'red',
    description: 'Use operators to filter query results',
    lessons: [
      {
        id: 'filter-comparison',
        title: 'Comparison Operators',
        description: 'Use =, <>, >, <, >=, <=',
        queries: [
          { id: 'flt-1', title: 'Equal To', description: 'From the **customers** table, SELECT all rows where country = \'Germany\' using the = operator', query: `SELECT *\nFROM customers\nWHERE country = 'Germany'`, difficulty: 'beginner' },
          { id: 'flt-2', title: 'Not Equal To', description: 'From the **customers** table, SELECT all rows where country is NOT \'Germany\' using the <> operator', query: `SELECT *\nFROM customers\nWHERE country <> 'Germany'`, difficulty: 'beginner' },
          { id: 'flt-3', title: 'Greater Than', description: 'From the **customers** table, SELECT all rows where score > 500 using the > operator', query: `SELECT *\nFROM customers\nWHERE score > 500`, difficulty: 'beginner' },
          { id: 'flt-4', title: 'Greater Than or Equal', description: 'From the **customers** table, SELECT all rows where score >= 500', query: `SELECT *\nFROM customers\nWHERE score >= 500`, difficulty: 'beginner' },
          { id: 'flt-5', title: 'Less Than', description: 'From the **customers** table, SELECT all rows where score < 500', query: `SELECT *\nFROM customers\nWHERE score < 500`, difficulty: 'beginner' },
          { id: 'flt-6', title: 'Less Than or Equal', description: 'From the **customers** table, SELECT all rows where score <= 500', query: `SELECT *\nFROM customers\nWHERE score <= 500`, difficulty: 'beginner' },
        ]
      },
      {
        id: 'filter-logical',
        title: 'Logical Operators',
        description: 'Combine conditions with AND, OR, NOT',
        queries: [
          { id: 'flt-7', title: 'AND Operator', description: 'From the **customers** table, SELECT rows where country = \'USA\' AND score > 500 (both must be true)', query: `SELECT *\nFROM customers\nWHERE country = 'USA' AND score > 500`, difficulty: 'beginner' },
          { id: 'flt-8', title: 'OR Operator', description: 'From the **customers** table, SELECT rows where country = \'USA\' OR score > 500 (either can be true)', query: `SELECT *\nFROM customers\nWHERE country = 'USA' OR score > 500`, difficulty: 'beginner' },
          { id: 'flt-9', title: 'NOT Operator', description: 'From the **customers** table, SELECT rows where score is NOT < 500 (equivalent to >= 500)', query: `SELECT *\nFROM customers\nWHERE NOT score < 500`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'filter-between-in',
        title: 'BETWEEN & IN',
        description: 'Range and set filtering',
        queries: [
          { id: 'flt-10', title: 'BETWEEN Range', description: 'From the **customers** table, SELECT rows where score is BETWEEN 100 AND 500 (inclusive)', query: `SELECT *\nFROM customers\nWHERE score BETWEEN 100 AND 500`, difficulty: 'beginner' },
          { id: 'flt-11', title: 'BETWEEN Alternative', description: 'From the **customers** table, write the same query using score >= 100 AND score <= 500', query: `SELECT *\nFROM customers\nWHERE score >= 100 AND score <= 500`, difficulty: 'beginner' },
          { id: 'flt-12', title: 'IN Operator', description: 'From the **customers** table, SELECT rows where country is IN (\'Germany\', \'USA\')', query: `SELECT *\nFROM customers\nWHERE country IN ('Germany', 'USA')`, difficulty: 'beginner' },
        ]
      },
      {
        id: 'filter-like',
        title: 'Pattern Matching (LIKE)',
        description: 'Search with wildcards',
        queries: [
          { id: 'flt-13', title: 'Starts With', description: 'From the **customers** table, SELECT rows where first_name starts with \'M\' using LIKE \'M%\'', query: `SELECT *\nFROM customers\nWHERE first_name LIKE 'M%'`, difficulty: 'beginner' },
          { id: 'flt-14', title: 'Ends With', description: 'From the **customers** table, SELECT rows where first_name ends with \'n\' using LIKE \'%n\'', query: `SELECT *\nFROM customers\nWHERE first_name LIKE '%n'`, difficulty: 'beginner' },
          { id: 'flt-15', title: 'Contains', description: 'From the **customers** table, SELECT rows where first_name contains \'r\' using LIKE \'%r%\'', query: `SELECT *\nFROM customers\nWHERE first_name LIKE '%r%'`, difficulty: 'beginner' },
          { id: 'flt-16', title: 'Position Pattern', description: 'From the **customers** table, SELECT rows where first_name has \'r\' as 3rd character using LIKE \'__r%\'', query: `SELECT *\nFROM customers\nWHERE first_name LIKE '__r%'`, difficulty: 'intermediate' },
        ]
      }
    ]
  },

  // MODULE 5: JOINs
  {
    id: 'joins',
    title: 'SQL JOINs',
    icon: '🔗',
    color: 'purple',
    description: 'Combine data from multiple tables',
    lessons: [
      {
        id: 'joins-basic',
        title: 'Basic JOINs',
        description: 'INNER, LEFT, RIGHT, FULL JOINs',
        queries: [
          { id: 'join-1', title: 'View Tables', description: 'Write two SELECT * statements to view the **customers** and **orders** tables separately before learning to join them', query: `SELECT * FROM customers;\nSELECT * FROM orders;`, difficulty: 'beginner' },
          { id: 'join-2', title: 'INNER JOIN', description: 'INNER JOIN **customers** with **orders** on id = customer_id. Select: c.id, c.first_name, o.order_id, o.sales', query: `SELECT\n    c.id,\n    c.first_name,\n    o.order_id,\n    o.sales\nFROM customers AS c\nINNER JOIN orders AS o\nON c.id = o.customer_id`, difficulty: 'intermediate' },
          { id: 'join-3', title: 'LEFT JOIN', description: 'LEFT JOIN **customers** with **orders** on id = customer_id. Shows ALL customers, even those without orders', query: `SELECT\n    c.id,\n    c.first_name,\n    o.order_id,\n    o.sales\nFROM customers AS c\nLEFT JOIN orders AS o\nON c.id = o.customer_id`, difficulty: 'intermediate' },
          { id: 'join-4', title: 'RIGHT JOIN', description: 'RIGHT JOIN **customers** with **orders** on id = customer_id. Shows ALL orders, even without matching customer', query: `SELECT\n    c.id,\n    c.first_name,\n    o.order_id,\n    o.customer_id,\n    o.sales\nFROM customers AS c \nRIGHT JOIN orders AS o \nON c.id = o.customer_id`, difficulty: 'intermediate' },
          { id: 'join-5', title: 'RIGHT as LEFT', description: 'Rewrite the RIGHT JOIN as LEFT JOIN by swapping: **orders** LEFT JOIN **customers**', query: `SELECT\n    c.id,\n    c.first_name,\n    o.order_id,\n    o.sales\nFROM orders AS o \nLEFT JOIN customers AS c\nON c.id = o.customer_id`, difficulty: 'intermediate' },
          { id: 'join-6', title: 'FULL JOIN', description: 'FULL JOIN **customers** with **orders**. Shows ALL rows from both tables, matching where possible', query: `SELECT\n    c.id,\n    c.first_name,\n    o.order_id,\n    o.customer_id,\n    o.sales\nFROM customers AS c \nFULL JOIN orders AS o \nON c.id = o.customer_id`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'joins-advanced',
        title: 'Advanced JOINs',
        description: 'Anti joins and cross joins',
        queries: [
          { id: 'join-7', title: 'LEFT ANTI JOIN', description: 'LEFT JOIN **customers** with **orders**, then WHERE o.customer_id IS NULL to find customers with NO orders', query: `SELECT *\nFROM customers AS c\nLEFT JOIN orders AS o\nON c.id = o.customer_id\nWHERE o.customer_id IS NULL`, difficulty: 'advanced' },
          { id: 'join-8', title: 'RIGHT ANTI JOIN', description: 'RIGHT JOIN **customers** with **orders**, then WHERE c.id IS NULL to find orders with NO customer', query: `SELECT *\nFROM customers AS c\nRIGHT JOIN orders AS o\nON c.id = o.customer_id\nWHERE c.id IS NULL`, difficulty: 'advanced' },
          { id: 'join-9', title: 'Alternative Anti', description: 'Rewrite RIGHT ANTI JOIN as: **orders** LEFT JOIN **customers** WHERE c.id IS NULL', query: `SELECT *\nFROM orders AS o \nLEFT JOIN customers AS c\nON c.id = o.customer_id\nWHERE c.id IS NULL`, difficulty: 'advanced' },
          { id: 'join-10', title: 'LEFT to INNER', description: 'Write LEFT JOIN **customers** to **orders**, but add WHERE o.customer_id IS NOT NULL (behaves like INNER)', query: `SELECT *\nFROM customers AS c\nLEFT JOIN orders AS o\nON c.id = o.customer_id\nWHERE o.customer_id IS NOT NULL`, difficulty: 'advanced' },
          { id: 'join-11', title: 'FULL ANTI JOIN', description: 'FULL JOIN **customers** with **orders**, WHERE to find unmatched rows from BOTH tables', query: `SELECT\n    c.id,\n    c.first_name,\n    o.order_id,\n    o.customer_id,\n    o.sales\nFROM customers AS c \nFULL JOIN orders AS o \nON c.id = o.customer_id\nWHERE o.customer_id IS NULL OR c.id IS NULL`, difficulty: 'advanced' },
          { id: 'join-12', title: 'CROSS JOIN', description: 'CROSS JOIN **customers** with **orders** to create all possible row combinations (Cartesian product)', query: `SELECT *\nFROM customers\nCROSS JOIN orders`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'joins-multiple',
        title: 'Multiple Table JOINs',
        description: 'Join 3+ tables together',
        queries: [
          { id: 'join-13', title: 'Four Table JOIN', description: 'JOIN **orders** with **customers**, **products**, and **employees** using LEFT JOINs. Show order, customer name, product, and employee info', query: `SELECT \n    o.order_id,\n    o.Sales,\n    c.first_name AS Customerfirst_name,\n    c.last_name AS Customerlast_name,\n    p.product_name,\n    p.price,\n    e.first_name AS Employeefirst_name,\n    e.last_name AS Employeelast_name\nFROM orders AS o\nLEFT JOIN customers AS c\nON o.customer_id = c.customer_id\nLEFT JOIN products AS p\nON o.product_id = p.product_id\nLEFT JOIN employees AS e\nON o.SalesPersonID = e.employee_id`, difficulty: 'advanced' },
        ]
      }
    ]
  },

  // MODULE 6: SET Operations
  {
    id: 'sets',
    title: 'SET Operations',
    icon: '⚡',
    color: 'yellow',
    description: 'Combine results from multiple queries',
    lessons: [
      {
        id: 'sets-rules',
        title: 'SET Operation Rules',
        description: 'Understand the requirements',
        queries: [
          { id: 'set-1', title: 'Data Type Rule', description: 'UNION **customers** (first_name, last_name, country) with **employees** (first_name, last_name) - column counts must match', query: `SELECT\n    first_name,\n    last_name,\n    country\nFROM customers\nUNION\nSELECT\n    first_name,\n    last_name\nFROM employees`, difficulty: 'intermediate' },
          { id: 'set-2', title: 'Column Order Rule', description: 'UNION data from **customers** and **employees** - column order matters for proper alignment', query: `SELECT\n    last_name,\n    customer_id\nFROM customers\nUNION\nSELECT\n    employee_id,\n    last_name\nFROM employees`, difficulty: 'intermediate' },
          { id: 'set-3', title: 'Column Aliases', description: 'UNION **customers** and **employees** - first SELECT determines result column names (ID, Last_Name)', query: `SELECT\n    customer_id AS ID,\n    last_name AS Last_Name\nFROM customers\nUNION\nSELECT\n    employee_id,\n    last_name\nFROM employees`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'sets-operations',
        title: 'UNION, EXCEPT, INTERSECT',
        description: 'Combine query results',
        queries: [
          { id: 'set-4', title: 'UNION', description: 'UNION first_name, last_name from **customers** and **employees** - removes duplicates automatically', query: `SELECT\n    first_name,\n    last_name\nFROM customers\nUNION\nSELECT\n    first_name,\n    last_name\nFROM employees`, difficulty: 'intermediate' },
          { id: 'set-5', title: 'UNION ALL', description: 'UNION ALL first_name, last_name from **customers** and **employees** - keeps duplicates', query: `SELECT\n    first_name,\n    last_name\nFROM customers\nUNION ALL\nSELECT\n    first_name,\n    last_name\nFROM employees`, difficulty: 'intermediate' },
          { id: 'set-6', title: 'EXCEPT', description: 'Select names from **employees** EXCEPT those also in **customers** (employees-only names)', query: `SELECT\n    first_name,\n    last_name\nFROM employees\nEXCEPT\nSELECT\n    first_name,\n    last_name\nFROM customers`, difficulty: 'intermediate' },
          { id: 'set-7', title: 'INTERSECT', description: 'INTERSECT to find names that exist in BOTH **employees** and **customers** tables', query: `SELECT\n    first_name,\n    last_name\nFROM employees\nINTERSECT\nSELECT\n    first_name,\n    last_name\nFROM customers`, difficulty: 'intermediate' },
          { id: 'set-8', title: 'UNION with Source', description: 'UNION **orders** with itself, adding a SourceTable column to identify each result set', query: `SELECT\n    'Orders' AS SourceTable,\n    order_id,\n    product_id,\n    Sales\nFROM orders\nUNION\nSELECT\n    'orders' AS SourceTable,\n    order_id,\n    product_id,\n    Sales\nFROM orders\nORDER BY order_id`, difficulty: 'advanced' },
        ]
      }
    ]
  },

  // MODULE 7: String Functions
  {
    id: 'strings',
    title: 'String Functions',
    icon: '📝',
    color: 'pink',
    description: 'Manipulate and transform text data',
    lessons: [
      {
        id: 'strings-manipulation',
        title: 'String Manipulation',
        description: 'CONCAT, UPPER, LOWER, TRIM, REPLACE',
        queries: [
          { id: 'str-1', title: 'CONCAT', description: 'From **customers**, use CONCAT to combine first_name and country with a dash separator as full_info', query: `SELECT \n    CONCAT(first_name, '-', country) AS full_info\nFROM customers`, difficulty: 'beginner' },
          { id: 'str-2', title: 'LOWER', description: 'From **customers**, use LOWER to convert first_name to lowercase as lower_case_name', query: `SELECT \n    LOWER(first_name) AS lower_case_name\nFROM customers`, difficulty: 'beginner' },
          { id: 'str-3', title: 'UPPER', description: 'From **customers**, use UPPER to convert first_name to UPPERCASE as upper_case_name', query: `SELECT \n    UPPER(first_name) AS upper_case_name\nFROM customers`, difficulty: 'beginner' },
          { id: 'str-4', title: 'TRIM', description: 'From **customers**, compare LEN(first_name) with LEN(TRIM(first_name)) to find names with extra spaces', query: `SELECT \n    first_name,\n    LEN(first_name) len_name,\n    LEN(TRIM(first_name)) len_trim_name,\n    LEN(first_name) - LEN(TRIM(first_name)) flag\nFROM customers\nWHERE LEN(first_name) != LEN(TRIM(first_name))`, difficulty: 'intermediate' },
          { id: 'str-5', title: 'REPLACE Characters', description: 'Use REPLACE to change dashes to slashes in a phone number string \'123-456-7890\'', query: `SELECT\n    '123-456-7890' AS phone,\n    REPLACE('123-456-7890', '-', '/') AS clean_phone`, difficulty: 'beginner' },
          { id: 'str-6', title: 'REPLACE Extension', description: 'Use REPLACE to change a file extension from .txt to .csv in \'report.txt\'', query: `SELECT\n    'report.txt' AS old_filename,\n    REPLACE('report.txt', '.txt', '.csv') AS new_filename`, difficulty: 'beginner' },
        ]
      },
      {
        id: 'strings-extraction',
        title: 'String Extraction',
        description: 'LEN, LEFT, RIGHT, SUBSTRING',
        queries: [
          { id: 'str-7', title: 'LEN Function', description: 'From **customers**, use LEN to display each first_name and its character count as name_length', query: `SELECT \n    first_name, \n    LEN(first_name) AS name_length\nFROM customers`, difficulty: 'beginner' },
          { id: 'str-8', title: 'LEFT Function', description: 'From **customers**, use LEFT to extract the first 2 characters of first_name as first_2_chars', query: `SELECT \n    first_name,\n    LEFT(TRIM(first_name), 2) AS first_2_chars\nFROM customers`, difficulty: 'beginner' },
          { id: 'str-9', title: 'RIGHT Function', description: 'From **customers**, use RIGHT to extract the last 2 characters of first_name as last_2_chars', query: `SELECT \n    first_name,\n    RIGHT(first_name, 2) AS last_2_chars\nFROM customers`, difficulty: 'beginner' },
          { id: 'str-10', title: 'SUBSTRING', description: 'From **customers**, use SUBSTRING to extract characters from position 2 to end of first_name', query: `SELECT \n    first_name,\n    SUBSTRING(TRIM(first_name), 2, LEN(first_name)) AS trimmed_name\nFROM customers`, difficulty: 'intermediate' },
          { id: 'str-11', title: 'Nesting Functions', description: 'From **customers**, nest UPPER inside LOWER on first_name to demonstrate function composition', query: `SELECT\n    first_name, \n    UPPER(LOWER(first_name)) AS nesting\nFROM customers`, difficulty: 'intermediate' },
        ]
      }
    ]
  },

  // MODULE 8: Number Functions
  {
    id: 'numbers',
    title: 'Number Functions',
    icon: '🔢',
    color: 'blue',
    description: 'Mathematical operations on data',
    lessons: [
      {
        id: 'numbers-funcs',
        title: 'ROUND & ABS',
        description: 'Rounding and absolute values',
        queries: [
          { id: 'num-1', title: 'ROUND Function', description: 'Use ROUND to demonstrate rounding 3.516 to 2, 1, and 0 decimal places', query: `SELECT \n    3.516 AS original_number,\n    ROUND(3.516, 2) AS round_2,\n    ROUND(3.516, 1) AS round_1,\n    ROUND(3.516, 0) AS round_0`, difficulty: 'beginner' },
          { id: 'num-2', title: 'ABS Function', description: 'Use ABS to demonstrate converting -10 to its absolute value (positive 10)', query: `SELECT \n    -10 AS original_number,\n    ABS(-10) AS absolute_value_negative,\n    ABS(10) AS absolute_value_positive`, difficulty: 'beginner' },
        ]
      }
    ]
  },

  // MODULE 9: Date/Time Functions
  {
    id: 'datetime',
    title: 'Date & Time Functions',
    icon: '📅',
    color: 'green',
    description: 'Work with dates and timestamps',
    lessons: [
      {
        id: 'datetime-basics',
        title: 'Date Basics',
        description: 'GETDATE and date values',
        queries: [
          { id: 'dt-1', title: 'GETDATE', description: 'From **orders**, select order_id, order_date, a hard-coded date, and GETDATE() to show current date', query: `SELECT\n    order_id,\n    order_date,\n    '2025-08-20' AS HardCoded,\n    GETDATE() AS Today\nFROM orders`, difficulty: 'beginner' },
        ]
      },
      {
        id: 'datetime-extraction',
        title: 'Date Part Extraction',
        description: 'YEAR, MONTH, DAY, DATEPART',
        queries: [
          { id: 'dt-2', title: 'Date Parts', description: 'From **orders**, extract YEAR, MONTH, and DAY from order_date into separate columns', query: `SELECT\n    order_id,\n    order_date,\n    YEAR(order_date) AS Year,\n    MONTH(order_date) AS Month,\n    DAY(order_date) AS Day\nFROM orders`, difficulty: 'beginner' },
          { id: 'dt-3', title: 'DATETRUNC', description: 'From **orders**, use DATETRUNC to truncate order_date to year, day, and minute precision', query: `SELECT\n    order_id,\n    order_date,\n    DATETRUNC(year, order_date) AS Year_dt,\n    DATETRUNC(day, order_date) AS Day_dt,\n    DATETRUNC(minute, order_date) AS Minute_dt\nFROM orders`, difficulty: 'intermediate' },
          { id: 'dt-4', title: 'DATENAME', description: 'From **orders**, use DATENAME to get month name and weekday name from order_date', query: `SELECT\n    order_id,\n    order_date,\n    DATENAME(month, order_date) AS Month_Name,\n    DATENAME(weekday, order_date) AS Weekday\nFROM orders`, difficulty: 'intermediate' },
          { id: 'dt-5', title: 'Aggregate by Year', description: 'From **orders**, GROUP BY DATETRUNC(year, order_date) and COUNT orders per year', query: `SELECT\n    DATETRUNC(year, order_date) AS Creation,\n    COUNT(*) AS OrderCount\nFROM orders\nGROUP BY DATETRUNC(year, order_date)`, difficulty: 'intermediate' },
          { id: 'dt-6', title: 'EOMONTH', description: 'From **orders**, use EOMONTH to get the last day of each order_date\'s month', query: `SELECT\n    order_id,\n    order_date,\n    EOMONTH(order_date) AS EndOfMonth\nFROM orders`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'datetime-aggregation',
        title: 'Date Aggregation',
        description: 'Group data by dates',
        queries: [
          { id: 'dt-7', title: 'Orders by Year', description: 'From **orders**, GROUP BY YEAR(order_date) and COUNT total orders per year', query: `SELECT \n    YEAR(order_date) AS OrderYear, \n    COUNT(*) AS TotalOrders\nFROM orders\nGROUP BY YEAR(order_date)`, difficulty: 'intermediate' },
          { id: 'dt-8', title: 'Orders by Month', description: 'From **orders**, GROUP BY MONTH(order_date) and COUNT total orders per month', query: `SELECT \n    MONTH(order_date) AS OrderMonth, \n    COUNT(*) AS TotalOrders\nFROM orders\nGROUP BY MONTH(order_date)`, difficulty: 'intermediate' },
          { id: 'dt-9', title: 'Month Names', description: 'From **orders**, GROUP BY DATENAME(month, order_date) to show order counts with month names', query: `SELECT \n    DATENAME(month, order_date) AS OrderMonth, \n    COUNT(*) AS TotalOrders\nFROM orders\nGROUP BY DATENAME(month, order_date)`, difficulty: 'intermediate' },
          { id: 'dt-10', title: 'Filter by Month', description: 'From **orders**, SELECT all rows WHERE MONTH(order_date) = 2 (February)', query: `SELECT\n    *\nFROM orders\nWHERE MONTH(order_date) = 2`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'datetime-format',
        title: 'Date Formatting',
        description: 'FORMAT, CONVERT, CAST',
        queries: [
          { id: 'dt-11', title: 'FORMAT Function', description: 'Format dates as strings', query: `SELECT\n    order_id,\n    order_date,\n    FORMAT(order_date, 'MM-dd-yyyy') AS USA_Format,\n    FORMAT(order_date, 'dd-MM-yyyy') AS EURO_Format\nFROM orders`, difficulty: 'intermediate' },
          { id: 'dt-12', title: 'Custom Format', description: 'Build custom date string', query: `SELECT\n    order_id,\n    order_date,\n    'Day ' + FORMAT(order_date, 'ddd MMM') +\n    ' Q' + DATENAME(quarter, order_date) + ' ' +\n    FORMAT(order_date, 'yyyy hh:mm:ss tt') AS CustomFormat\nFROM orders`, difficulty: 'advanced' },
          { id: 'dt-13', title: 'CONVERT Function', description: 'Convert between types', query: `SELECT\n    CONVERT(INT, '123') AS [String to Int],\n    CONVERT(DATE, '2025-08-20') AS [String to Date],\n    order_date,\n    CONVERT(DATE, order_date) AS [Datetime to Date]\nFROM orders`, difficulty: 'intermediate' },
          { id: 'dt-14', title: 'CAST Function', description: 'Cast between data types', query: `SELECT\n    CAST('123' AS INT) AS [String to Int],\n    CAST(123 AS VARCHAR) AS [Int to String],\n    CAST('2025-08-20' AS DATE) AS [String to Date]\nFROM orders`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'datetime-arithmetic',
        title: 'Date Arithmetic',
        description: 'DATEADD, DATEDIFF',
        queries: [
          { id: 'dt-15', title: 'DATEADD', description: 'Add/subtract from dates', query: `SELECT\n    order_id,\n    order_date,\n    DATEADD(day, -10, order_date) AS TenDaysBefore,\n    DATEADD(month, 3, order_date) AS ThreeMonthsLater,\n    DATEADD(year, 2, order_date) AS TwoYearsLater\nFROM orders`, difficulty: 'intermediate' },
          { id: 'dt-16', title: 'Calculate Age', description: 'Employee age calculation', query: `SELECT\n    employee_id,\n    BirthDate,\n    DATEDIFF(year, BirthDate, GETDATE()) AS Age\nFROM employees`, difficulty: 'intermediate' },
          { id: 'dt-17', title: 'Shipping Duration', description: 'Average shipping time', query: `SELECT\n    MONTH(order_date) AS OrderMonth,\n    AVG(DATEDIFF(day, order_date, ShipDate)) AS AvgShip\nFROM orders\nGROUP BY MONTH(order_date)`, difficulty: 'advanced' },
          { id: 'dt-18', title: 'Time Gap Analysis', description: 'Days between orders', query: `SELECT\n    order_id,\n    order_date AS Currentorder_date,\n    LAG(order_date) OVER (ORDER BY order_date) AS Previousorder_date,\n    DATEDIFF(day, LAG(order_date) OVER (ORDER BY order_date), order_date) AS NrOfDays\nFROM orders`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'datetime-validation',
        title: 'Date Validation',
        description: 'ISDATE function',
        queries: [
          { id: 'dt-19', title: 'ISDATE', description: 'Validate date strings', query: `SELECT\n    order_date,\n    ISDATE(order_date) AS IsValidDate,\n    CASE \n        WHEN ISDATE(order_date) = 1 THEN CAST(order_date AS DATE)\n        ELSE '9999-01-01'\n    END AS Neworder_date\nFROM (\n    SELECT '2025-08-20' AS order_date UNION\n    SELECT '2025-08-21' UNION\n    SELECT '2025-08'\n) AS t`, difficulty: 'advanced' },
        ]
      }
    ]
  },

  // MODULE 10: NULL Functions
  {
    id: 'nulls',
    title: 'NULL Functions',
    icon: '🎭',
    color: 'orange',
    description: 'Handle missing and NULL values',
    lessons: [
      {
        id: 'nulls-handling',
        title: 'Handling NULLs',
        description: 'COALESCE and NULL operations',
        queries: [
          { id: 'null-1', title: 'COALESCE in Aggregation', description: 'From **customers**, use COALESCE to replace NULL scores with 0, then compare AVG with original', query: `SELECT\n    customer_id,\n    score,\n    COALESCE(score, 0) AS score2,\n    AVG(score) OVER () AS Avgscores,\n    AVG(COALESCE(score, 0)) OVER () AS Avgscores2\nFROM customers`, difficulty: 'intermediate' },
          { id: 'null-2', title: 'COALESCE for Strings', description: 'From **customers**, use COALESCE to handle NULL in name concatenation and score calculations', query: `SELECT\n    customer_id,\n    first_name,\n    last_name,\n    first_name + ' ' + COALESCE(last_name, '') AS FullName,\n    score,\n    COALESCE(score, 0) + 10 AS scoreWithBonus\nFROM customers`, difficulty: 'intermediate' },
          { id: 'null-3', title: 'NULL Sorting', description: 'From **customers**, sort by score but put NULL values last using CASE WHEN', query: `SELECT\n    customer_id,\n    score\nFROM customers\nORDER BY CASE WHEN score IS NULL THEN 1 ELSE 0 END, score`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'nulls-operators',
        title: 'NULL Operators',
        description: 'IS NULL, IS NOT NULL, NULLIF',
        queries: [
          { id: 'null-4', title: 'NULLIF', description: 'From **orders**, use NULLIF to avoid division by zero when calculating price (Sales/Quantity)', query: `SELECT\n    order_id,\n    Sales,\n    Quantity,\n    Sales / NULLIF(Quantity, 0) AS price\nFROM orders`, difficulty: 'intermediate' },
          { id: 'null-5', title: 'IS NULL', description: 'From **customers**, SELECT all rows WHERE score IS NULL to find customers without scores', query: `SELECT *\nFROM customers\nWHERE score IS NULL`, difficulty: 'beginner' },
          { id: 'null-6', title: 'IS NOT NULL', description: 'From **customers**, SELECT all rows WHERE score IS NOT NULL to find customers with scores', query: `SELECT *\nFROM customers\nWHERE score IS NOT NULL`, difficulty: 'beginner' },
          { id: 'null-7', title: 'NULL Anti Join', description: 'LEFT JOIN **customers** with **orders**, then WHERE order_id IS NULL to find customers without orders', query: `SELECT\n    c.*,\n    o.order_id\nFROM customers AS c\nLEFT JOIN orders AS o\n    ON c.customer_id = o.customer_id\nWHERE o.customer_id IS NULL`, difficulty: 'intermediate' },
          { id: 'null-8', title: 'NULL vs Empty vs Spaces', description: 'Use a CTE to demonstrate how TRIM, NULLIF, and COALESCE handle NULL, empty, and space strings', query: `WITH Orders AS (\n    SELECT 1 AS Id, 'A' AS Category UNION\n    SELECT 2, NULL UNION\n    SELECT 3, '' UNION\n    SELECT 4, '  '\n)\nSELECT \n    *,\n    DATALENGTH(Category) AS LenCategory,\n    TRIM(Category) AS Policy1,\n    NULLIF(TRIM(Category), '') AS Policy2,\n    COALESCE(NULLIF(TRIM(Category), ''), 'unknown') AS Policy3\nFROM Orders`, difficulty: 'advanced' },
        ]
      }
    ]
  },

  // MODULE 11: CASE Statement
  {
    id: 'case',
    title: 'CASE Statements',
    icon: '🔀',
    color: 'purple',
    description: 'Conditional logic in SQL',
    lessons: [
      {
        id: 'case-basics',
        title: 'CASE Basics',
        description: 'Categorize and map data',
        queries: [
          { id: 'case-1', title: 'Categorize Data', description: 'High/Medium/Low categories', query: `SELECT\n    Category,\n    SUM(Sales) AS TotalSales\nFROM (\n    SELECT\n        order_id,\n        Sales,\n        CASE\n            WHEN Sales > 50 THEN 'High'\n            WHEN Sales > 20 THEN 'Medium'\n            ELSE 'Low'\n        END AS Category\n    FROM orders\n) AS t\nGROUP BY Category\nORDER BY TotalSales DESC`, difficulty: 'intermediate' },
          { id: 'case-2', title: 'Mapping Values', description: 'country abbreviations', query: `SELECT\n    customer_id,\n    first_name,\n    last_name,\n    country,\n    CASE \n        WHEN country = 'Germany' THEN 'DE'\n        WHEN country = 'USA'     THEN 'US'\n        ELSE 'n/a'\n    END AS countryAbbr\nFROM customers`, difficulty: 'intermediate' },
          { id: 'case-3', title: 'Quick Form Syntax', description: 'Simplified CASE expression', query: `SELECT\n    customer_id,\n    first_name,\n    country,\n    CASE country\n        WHEN 'Germany' THEN 'DE'\n        WHEN 'USA'     THEN 'US'\n        ELSE 'n/a'\n    END AS countryAbbr\nFROM customers`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'case-advanced',
        title: 'Advanced CASE',
        description: 'Handle NULLs and aggregation',
        queries: [
          { id: 'case-4', title: 'Handle NULLs', description: 'Replace NULL with 0 using CASE', query: `SELECT\n    customer_id,\n    last_name,\n    score,\n    CASE\n        WHEN score IS NULL THEN 0\n        ELSE score\n    END AS scoreClean,\n    AVG(\n        CASE\n            WHEN score IS NULL THEN 0\n            ELSE score\n        END\n    ) OVER () AS AvgCustomerClean,\n    AVG(score) OVER () AS AvgCustomer\nFROM customers`, difficulty: 'advanced' },
          { id: 'case-5', title: 'Conditional Aggregation', description: 'Count high sales orders', query: `SELECT\n    customer_id,\n    SUM(\n        CASE\n            WHEN Sales > 30 THEN 1\n            ELSE 0\n        END\n    ) AS TotalOrdersHighSales,\n    COUNT(*) AS TotalOrders\nFROM orders\nGROUP BY customer_id`, difficulty: 'advanced' },
        ]
      }
    ]
  },

  // MODULE 12: Aggregate Functions
  {
    id: 'aggregates',
    title: 'Aggregate Functions',
    icon: '📊',
    color: 'green',
    description: 'COUNT, SUM, AVG, MAX, MIN',
    lessons: [
      {
        id: 'agg-basics',
        title: 'Basic Aggregates',
        description: 'Summarize data',
        queries: [
          { id: 'agg-1', title: 'COUNT', description: 'From **customers**, COUNT(*) to get the total number of customers', query: `SELECT COUNT(*) AS total_customers\nFROM customers`, difficulty: 'beginner' },
          { id: 'agg-2', title: 'SUM', description: 'From **orders**, SUM(sales) to get the total sales across all orders', query: `SELECT SUM(sales) AS total_sales\nFROM orders`, difficulty: 'beginner' },
          { id: 'agg-3', title: 'AVG', description: 'From **orders**, AVG(sales) to get the average sales amount per order', query: `SELECT AVG(sales) AS avg_sales\nFROM orders`, difficulty: 'beginner' },
          { id: 'agg-4', title: 'MAX', description: 'From **customers**, MAX(score) to find the highest customer score', query: `SELECT MAX(score) AS max_score\nFROM customers`, difficulty: 'beginner' },
          { id: 'agg-5', title: 'MIN', description: 'From **customers**, MIN(score) to find the lowest customer score', query: `SELECT MIN(score) AS min_score\nFROM customers`, difficulty: 'beginner' },
        ]
      },
      {
        id: 'agg-grouped',
        title: 'Grouped Aggregates',
        description: 'Aggregate by groups',
        queries: [
          { id: 'agg-6', title: 'All Aggregates per Customer', description: 'Multiple stats per customer', query: `SELECT\n    customer_id,\n    COUNT(*) AS total_orders,\n    SUM(sales) AS total_sales,\n    AVG(sales) AS avg_sales,\n    MAX(sales) AS highest_sales,\n    MIN(sales) AS lowest_sales\nFROM orders\nGROUP BY customer_id`, difficulty: 'intermediate' },
        ]
      }
    ]
  },

  // MODULE 13: Window Functions Basics
  {
    id: 'window-basics',
    title: 'Window Functions Basics',
    icon: '🪟',
    color: 'blue',
    description: 'OVER, PARTITION BY, ORDER BY clauses',
    lessons: [
      {
        id: 'window-intro',
        title: 'Introduction to Windows',
        description: 'Understanding window functions',
        queries: [
          { id: 'win-1', title: 'Total Sales (No Window)', description: 'From **orders**, use SUM(Sales) to get total sales (regular aggregate)', query: `SELECT\n    SUM(Sales) AS Total_Sales\nFROM orders`, difficulty: 'beginner' },
          { id: 'win-2', title: 'Sales by Product (GROUP BY)', description: 'From **orders**, GROUP BY product_id and SUM(Sales) for each product', query: `SELECT \n    product_id,\n    SUM(Sales) AS Total_Sales\nFROM orders\nGROUP BY product_id`, difficulty: 'beginner' },
        ]
      },
      {
        id: 'window-over',
        title: 'OVER Clause',
        description: 'Add aggregates to row details',
        queries: [
          { id: 'win-3', title: 'OVER Empty', description: 'From **orders**, show each row\'s details plus SUM(Sales) OVER () for the total', query: `SELECT\n    order_id,\n    order_date,\n    product_id,\n    Sales,\n    SUM(Sales) OVER () AS Total_Sales\nFROM orders`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'window-partition',
        title: 'PARTITION BY',
        description: 'Group window calculations',
        queries: [
          { id: 'win-4', title: 'Partition by Product', description: 'From **orders**, use PARTITION BY product_id to get total sales per product alongside row data', query: `SELECT\n    order_id,\n    order_date,\n    product_id,\n    Sales,\n    SUM(Sales) OVER () AS Total_Sales,\n    SUM(Sales) OVER (PARTITION BY product_id) AS Sales_By_Product\nFROM orders`, difficulty: 'intermediate' },
          { id: 'win-5', title: 'Multiple Partitions', description: 'From **orders**, use multiple PARTITION BY levels for product and status summaries', query: `SELECT\n    order_id,\n    order_date,\n    product_id,\n    OrderStatus,\n    Sales,\n    SUM(Sales) OVER () AS Total_Sales,\n    SUM(Sales) OVER (PARTITION BY product_id) AS Sales_By_product_name,\n    SUM(Sales) OVER (PARTITION BY product_id, OrderStatus) AS Sales_By_Product_Status\nFROM orders`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'window-order',
        title: 'ORDER Clause',
        description: 'Order rows within windows',
        queries: [
          { id: 'win-6', title: 'Rank by Sales', description: 'From **orders**, use RANK() OVER (ORDER BY Sales DESC) to rank orders by sales', query: `SELECT\n    order_id,\n    order_date,\n    Sales,\n    RANK() OVER (ORDER BY Sales DESC) AS Rank_Sales\nFROM orders`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'window-frame',
        title: 'FRAME Clause',
        description: 'Define row ranges',
        queries: [
          { id: 'win-7', title: 'ROWS FOLLOWING', description: 'Current + next 2 rows', query: `SELECT\n    order_id,\n    order_date,\n    Sales,\n    SUM(Sales) OVER (\n        PARTITION BY OrderStatus \n        ORDER BY order_date \n        ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING\n    ) AS Total_Sales\nFROM orders`, difficulty: 'advanced' },
          { id: 'win-8', title: 'ROWS PRECEDING', description: 'Previous 2 + current row', query: `SELECT\n    order_id,\n    order_date,\n    Sales,\n    SUM(Sales) OVER (\n        PARTITION BY OrderStatus \n        ORDER BY order_date \n        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n    ) AS Total_Sales\nFROM orders`, difficulty: 'advanced' },
          { id: 'win-9', title: 'Running Total', description: 'Cumulative sum', query: `SELECT\n    order_id,\n    order_date,\n    Sales,\n    SUM(Sales) OVER (\n        PARTITION BY OrderStatus \n        ORDER BY order_date \n        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS Running_Total\nFROM orders`, difficulty: 'advanced' },
          { id: 'win-10', title: 'UNBOUNDED PRECEDING', description: 'From start to current', query: `SELECT\n    order_id,\n    order_date,\n    Sales,\n    SUM(Sales) OVER (\n        PARTITION BY OrderStatus \n        ORDER BY order_date \n        ROWS UNBOUNDED PRECEDING\n    ) AS Total_Sales\nFROM orders`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'window-groupby',
        title: 'Windows with GROUP BY',
        description: 'Combine window and group functions',
        queries: [
          { id: 'win-11', title: 'Rank Grouped Data', description: 'Rank customers by total sales', query: `SELECT\n    customer_id,\n    SUM(Sales) AS Total_Sales,\n    RANK() OVER (ORDER BY SUM(Sales) DESC) AS Rank_Customers\nFROM orders\nGROUP BY customer_id`, difficulty: 'advanced' },
        ]
      }
    ]
  },

  // MODULE 14: Window Aggregations
  {
    id: 'window-agg',
    title: 'Window Aggregations',
    icon: '📈',
    color: 'purple',
    description: 'COUNT, SUM, AVG, MAX, MIN with windows',
    lessons: [
      {
        id: 'winagg-count',
        title: 'Window COUNT',
        description: 'Count with window functions',
        queries: [
          { id: 'wagg-1', title: 'Count Orders', description: 'Total and per-customer orders', query: `SELECT\n    order_id,\n    order_date,\n    customer_id,\n    COUNT(*) OVER() AS TotalOrders,\n    COUNT(*) OVER(PARTITION BY customer_id) AS OrdersByCustomers\nFROM orders`, difficulty: 'intermediate' },
          { id: 'wagg-2', title: 'Count Different Columns', description: 'Count with and without NULLs', query: `SELECT\n    *,\n    COUNT(*) OVER () AS TotalCustomersStar,\n    COUNT(score) OVER() AS Totalscores,\n    COUNT(country) OVER() AS TotalCountries\nFROM customers`, difficulty: 'intermediate' },
          { id: 'wagg-3', title: 'Find Duplicates', description: 'Check for duplicate rows', query: `SELECT * \nFROM (\n    SELECT \n        *,\n        COUNT(*) OVER(PARTITION BY order_id) AS CheckDuplicates\n    FROM orders\n) t\nWHERE CheckDuplicates > 1`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'winagg-sum',
        title: 'Window SUM',
        description: 'Sum with window functions',
        queries: [
          { id: 'wagg-4', title: 'Sum Total and by Product', description: 'Multiple partition levels', query: `SELECT\n    order_id,\n    order_date,\n    Sales,\n    product_id,\n    SUM(Sales) OVER () AS TotalSales,\n    SUM(Sales) OVER (PARTITION BY product_id) AS SalesByProduct\nFROM orders`, difficulty: 'intermediate' },
          { id: 'wagg-5', title: 'Percentage of Total', description: 'Calculate contribution', query: `SELECT\n    order_id,\n    product_id,\n    Sales,\n    SUM(Sales) OVER () AS TotalSales,\n    ROUND(CAST(Sales AS FLOAT) / SUM(Sales) OVER () * 100, 2) AS PercentageOfTotal\nFROM orders`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'winagg-avg',
        title: 'Window AVG',
        description: 'Average with window functions',
        queries: [
          { id: 'wagg-6', title: 'Average Sales', description: 'Total and by product average', query: `SELECT\n    order_id,\n    order_date,\n    Sales,\n    product_id,\n    AVG(Sales) OVER () AS AvgSales,\n    AVG(Sales) OVER (PARTITION BY product_id) AS AvgSalesByProduct\nFROM orders`, difficulty: 'intermediate' },
          { id: 'wagg-7', title: 'AVG with COALESCE', description: 'Handle NULLs in average', query: `SELECT\n    customer_id,\n    last_name,\n    score,\n    COALESCE(score, 0) AS Customerscore,\n    AVG(score) OVER () AS Avgscore,\n    AVG(COALESCE(score, 0)) OVER () AS AvgscoreWithoutNull\nFROM customers`, difficulty: 'intermediate' },
          { id: 'wagg-8', title: 'Above Average', description: 'Find orders above average', query: `SELECT\n    *\nFROM (\n    SELECT\n        order_id,\n        product_id,\n        Sales,\n        AVG(Sales) OVER () AS Avg_Sales\n    FROM orders\n) t \nWHERE Sales > Avg_Sales`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'winagg-minmax',
        title: 'Window MIN/MAX',
        description: 'Min and max with windows',
        queries: [
          { id: 'wagg-9', title: 'Min and Max Sales', description: 'Find extremes', query: `SELECT \n    MIN(Sales) AS MinSales, \n    MAX(Sales) AS MaxSales \nFROM orders`, difficulty: 'beginner' },
          { id: 'wagg-10', title: 'Min by Product', description: 'Lowest sales per product', query: `SELECT \n    order_id,\n    product_id,\n    order_date,\n    Sales,\n    MIN(Sales) OVER () AS LowestSales,\n    MIN(Sales) OVER (PARTITION BY product_id) AS LowestSalesByProduct\nFROM orders`, difficulty: 'intermediate' },
          { id: 'wagg-11', title: 'Find Highest salary', description: 'Employees with max salary', query: `SELECT *\nFROM (\n    SELECT *,\n           MAX(salary) OVER() AS Highestsalary\n    FROM employees\n) t\nWHERE salary = Highestsalary`, difficulty: 'advanced' },
          { id: 'wagg-12', title: 'Deviation from Extremes', description: 'Distance from min/max', query: `SELECT\n    order_id,\n    order_date,\n    product_id,\n    Sales,\n    MAX(Sales) OVER () AS HighestSales,\n    MIN(Sales) OVER () AS LowestSales,\n    Sales - MIN(Sales) OVER () AS DeviationFromMin,\n    MAX(Sales) OVER () - Sales AS DeviationFromMax\nFROM orders`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'winagg-rolling',
        title: 'Rolling Calculations',
        description: 'Moving averages and sums',
        queries: [
          { id: 'wagg-13', title: 'Moving Average', description: 'Rolling average by product', query: `SELECT\n    order_id,\n    product_id,\n    order_date,\n    Sales,\n    AVG(Sales) OVER (PARTITION BY product_id) AS AvgByproduct_name,\n    AVG(Sales) OVER (PARTITION BY product_id ORDER BY order_date) AS MovingAvg\nFROM orders`, difficulty: 'advanced' },
          { id: 'wagg-14', title: 'Rolling with Frame', description: 'Rolling avg current + next', query: `SELECT\n    order_id,\n    product_id,\n    order_date,\n    Sales,\n    AVG(Sales) OVER (PARTITION BY product_id ORDER BY order_date ROWS BETWEEN CURRENT ROW AND 1 FOLLOWING) AS RollingAvg\nFROM orders`, difficulty: 'advanced' },
        ]
      }
    ]
  },

  // MODULE 15: Window Ranking
  {
    id: 'window-rank',
    title: 'Window Ranking',
    icon: '🏆',
    color: 'yellow',
    description: 'ROW_NUMBER, RANK, DENSE_RANK, NTILE',
    lessons: [
      {
        id: 'rank-basics',
        title: 'Ranking Functions',
        description: 'Compare different ranking methods',
        queries: [
          { id: 'rank-1', title: 'Compare Rankings', description: 'ROW_NUMBER, RANK, DENSE_RANK', query: `SELECT\n    order_id,\n    product_id,\n    Sales,\n    ROW_NUMBER() OVER (ORDER BY Sales DESC) AS SalesRank_Row,\n    RANK() OVER (ORDER BY Sales DESC) AS SalesRank_Rank,\n    DENSE_RANK() OVER (ORDER BY Sales DESC) AS SalesRank_Dense\nFROM orders`, difficulty: 'intermediate' },
          { id: 'rank-2', title: 'Top-N per Group', description: 'Highest sale per product', query: `SELECT *\nFROM (\n    SELECT\n        order_id,\n        product_id,\n        Sales,\n        ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY Sales DESC) AS RankByProduct\n    FROM orders\n) AS TopProductSales\nWHERE RankByProduct = 1`, difficulty: 'advanced' },
          { id: 'rank-3', title: 'Bottom-N Analysis', description: 'Lowest 2 customers', query: `SELECT *\nFROM (\n    SELECT\n        customer_id,\n        SUM(Sales) AS TotalSales,\n        ROW_NUMBER() OVER (ORDER BY SUM(Sales)) AS RankCustomers\n    FROM orders\n    GROUP BY customer_id\n) AS BottomCustomerSales\nWHERE RankCustomers <= 2`, difficulty: 'advanced' },
          { id: 'rank-4', title: 'Assign Unique IDs', description: 'Generate row numbers', query: `SELECT\n    ROW_NUMBER() OVER (ORDER BY order_id, order_date) AS UniqueID,\n    *\nFROM orders`, difficulty: 'intermediate' },
          { id: 'rank-5', title: 'Remove Duplicates', description: 'Keep latest version', query: `SELECT *\nFROM (\n    SELECT\n        ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY order_date DESC) AS rn,\n        *\n    FROM orders\n) AS Uniqueorders\nWHERE rn = 1`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'rank-ntile',
        title: 'NTILE Function',
        description: 'Divide into buckets',
        queries: [
          { id: 'rank-6', title: 'Create Buckets', description: 'From **orders**, use NTILE to divide orders into 1, 2, 3, and 4 equal buckets by Sales', query: `SELECT \n    order_id,\n    Sales,\n    NTILE(1) OVER (ORDER BY Sales) AS OneBucket,\n    NTILE(2) OVER (ORDER BY Sales) AS TwoBuckets,\n    NTILE(3) OVER (ORDER BY Sales) AS ThreeBuckets,\n    NTILE(4) OVER (ORDER BY Sales) AS FourBuckets\nFROM orders`, difficulty: 'intermediate' },
          { id: 'rank-7', title: 'Segmentation', description: 'From **orders**, use NTILE(3) and CASE to categorize into High/Medium/Low sales segments', query: `SELECT\n    order_id,\n    Sales,\n    Buckets,\n    CASE \n        WHEN Buckets = 1 THEN 'High'\n        WHEN Buckets = 2 THEN 'Medium'\n        WHEN Buckets = 3 THEN 'Low'\n    END AS SalesSegmentations\nFROM (\n    SELECT\n        order_id,\n        Sales,\n        NTILE(3) OVER (ORDER BY Sales DESC) AS Buckets\n    FROM orders\n) AS SalesBuckets`, difficulty: 'advanced' },
          { id: 'rank-8', title: 'Processing Groups', description: 'From **orders**, use NTILE(5) to divide all orders into 5 groups for batch processing', query: `SELECT \n    NTILE(5) OVER (ORDER BY order_id) AS Buckets,\n    *\nFROM orders`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'rank-cume',
        title: 'CUME_DIST',
        description: 'Cumulative distribution',
        queries: [
          { id: 'rank-9', title: 'Top Percentile', description: 'From **products**, use CUME_DIST to find products in the top 40% by price', query: `SELECT \n    product_name,\n    price,\n    DistRank,\n    CONCAT(DistRank * 100, '%') AS DistRankPerc\nFROM (\n    SELECT\n        product_name,\n        price,\n        CUME_DIST() OVER (ORDER BY price DESC) AS DistRank\n    FROM products\n) AS priceDistribution\nWHERE DistRank <= 0.4`, difficulty: 'advanced' },
        ]
      }
    ]
  },

  // MODULE 16: Window Value Functions
  {
    id: 'window-value',
    title: 'Window Value Functions',
    icon: '↔️',
    color: 'pink',
    description: 'LEAD, LAG, FIRST_VALUE, LAST_VALUE',
    lessons: [
      {
        id: 'value-leadlag',
        title: 'LEAD & LAG',
        description: 'Access adjacent rows',
        queries: [
          { id: 'val-1', title: 'Month-over-Month', description: 'From **orders**, use LAG to compare each month\'s sales to the previous month', query: `SELECT\n    *,\n    CurrentMonthSales - PreviousMonthSales AS MoM_Change,\n    ROUND(\n        CAST((CurrentMonthSales - PreviousMonthSales) AS FLOAT)\n        / PreviousMonthSales * 100, 1\n    ) AS MoM_Perc\nFROM (\n    SELECT\n        MONTH(order_date) AS OrderMonth,\n        SUM(Sales) AS CurrentMonthSales,\n        LAG(SUM(Sales)) OVER (ORDER BY MONTH(order_date)) AS PreviousMonthSales\n    FROM orders\n    GROUP BY MONTH(order_date)\n) AS MonthlySales`, difficulty: 'advanced' },
          { id: 'val-2', title: 'Customer Loyalty', description: 'From **orders**, use LEAD to calculate average days between customer orders for loyalty ranking', query: `SELECT\n    customer_id,\n    AVG(DaysUntilNextOrder) AS AvgDays,\n    RANK() OVER (ORDER BY COALESCE(AVG(DaysUntilNextOrder), 999999)) AS RankAvg\nFROM (\n    SELECT\n        order_id,\n        customer_id,\n        order_date AS CurrentOrder,\n        LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS NextOrder,\n        DATEDIFF(\n            day,\n            order_date,\n            LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)\n        ) AS DaysUntilNextOrder\n    FROM orders\n) AS CustomerOrdersWithNext\nGROUP BY customer_id`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'value-firstlast',
        title: 'FIRST_VALUE & LAST_VALUE',
        description: 'Get first/last in window',
        queries: [
          { id: 'val-3', title: 'First and Last', description: 'From **orders**, use FIRST_VALUE and LAST_VALUE to get lowest and highest sales per product', query: `SELECT\n    order_id,\n    product_id,\n    Sales,\n    FIRST_VALUE(Sales) OVER (PARTITION BY product_id ORDER BY Sales) AS LowestSales,\n    LAST_VALUE(Sales) OVER (\n        PARTITION BY product_id \n        ORDER BY Sales \n        ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING\n    ) AS HighestSales,\n    Sales - FIRST_VALUE(Sales) OVER (PARTITION BY product_id ORDER BY Sales) AS SalesDifference\nFROM orders`, difficulty: 'advanced' },
        ]
      }
    ]
  },

  // MODULE 17: Subqueries
  {
    id: 'subqueries',
    title: 'Subqueries',
    icon: '🎯',
    color: 'red',
    description: 'Queries within queries',
    lessons: [
      {
        id: 'sub-types',
        title: 'Subquery Types',
        description: 'Scalar, row, and table subqueries',
        queries: [
          { id: 'sub-1', title: 'Scalar Query', description: 'From **orders**, SELECT AVG(Sales) which returns a single numeric value', query: `SELECT\n    AVG(Sales)\nFROM orders`, difficulty: 'beginner' },
          { id: 'sub-2', title: 'Row Query', description: 'From **orders**, SELECT customer_id which returns a single column (list of values)', query: `SELECT\n    customer_id\nFROM orders`, difficulty: 'beginner' },
          { id: 'sub-3', title: 'Table Query', description: 'From **orders**, SELECT order_id and order_date which returns multiple columns (a table)', query: `SELECT\n    order_id,\n    order_date\nFROM orders`, difficulty: 'beginner' },
        ]
      },
      {
        id: 'sub-from',
        title: 'Subquery in FROM',
        description: 'Derive tables from subqueries',
        queries: [
          { id: 'sub-4', title: 'Above Average Price', description: 'From **products**, use a subquery to find products with price above the average', query: `SELECT *\nFROM (\n    SELECT\n        product_id,\n        price,\n        AVG(price) OVER () AS Avgprice\n    FROM products\n) AS t\nWHERE price > Avgprice`, difficulty: 'intermediate' },
          { id: 'sub-5', title: 'Rank Customers', description: 'From **orders**, use a subquery to GROUP BY customer and then RANK by total sales', query: `SELECT\n    *,\n    RANK() OVER (ORDER BY TotalSales DESC) AS CustomerRank\nFROM (\n    SELECT\n        customer_id,\n        SUM(Sales) AS TotalSales\n    FROM orders\n    GROUP BY customer_id\n) AS t`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'sub-select',
        title: 'Subquery in SELECT',
        description: 'Add computed columns',
        queries: [
          { id: 'sub-6', title: 'Total Orders Column', description: 'From **products**, add a column showing total orders count from **orders** using a scalar subquery', query: `SELECT\n    product_id,\n    product_name,\n    price,\n    (SELECT COUNT(*) FROM orders) AS TotalOrders\nFROM products`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'sub-join',
        title: 'Subquery in JOIN',
        description: 'Join with derived tables',
        queries: [
          { id: 'sub-7', title: 'Customer Total Sales', description: 'LEFT JOIN **customers** with a subquery that aggregates **orders** by customer_id', query: `SELECT\n    c.*,\n    t.TotalSales\nFROM customers AS c\nLEFT JOIN (\n    SELECT\n        customer_id,\n        SUM(Sales) AS TotalSales\n    FROM orders\n    GROUP BY customer_id\n) AS t\n    ON c.customer_id = t.customer_id`, difficulty: 'intermediate' },
          { id: 'sub-8', title: 'Customer Order Count', description: 'LEFT JOIN **customers** with a subquery that counts orders from **orders**', query: `SELECT\n    c.*,\n    o.TotalOrders\nFROM customers AS c\nLEFT JOIN (\n    SELECT\n        customer_id,\n        COUNT(*) AS TotalOrders\n    FROM orders\n    GROUP BY customer_id\n) AS o\n    ON c.customer_id = o.customer_id`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'sub-comparison',
        title: 'Comparison Subqueries',
        description: 'Compare with subquery results',
        queries: [
          { id: 'sub-9', title: 'Above Average', description: 'From **products**, SELECT products WHERE price > (SELECT AVG(price)) using a comparison subquery', query: `SELECT\n    product_id,\n    price,\n    (SELECT AVG(price) FROM products) AS Avgprice\nFROM products\nWHERE price > (SELECT AVG(price) FROM products)`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'sub-in-any',
        title: 'IN & ANY Operators',
        description: 'Filter with subquery lists',
        queries: [
          { id: 'sub-10', title: 'IN Subquery', description: 'From **orders**, SELECT rows WHERE customer_id is IN the list of German customers from **customers**', query: `SELECT *\nFROM orders\nWHERE customer_id IN (\n    SELECT customer_id\n    FROM customers\n    WHERE country = 'Germany'\n)`, difficulty: 'intermediate' },
          { id: 'sub-11', title: 'NOT IN Subquery', description: 'From **orders**, SELECT rows WHERE customer_id is NOT IN the list of German customers', query: `SELECT *\nFROM orders\nWHERE customer_id NOT IN (\n    SELECT customer_id\n    FROM customers\n    WHERE country = 'Germany'\n)`, difficulty: 'intermediate' },
          { id: 'sub-12', title: 'ANY Operator', description: 'From **employees**, find salaries greater than ANY salary in a different department', query: `SELECT\n    employee_id, \n    first_name,\n    salary\nFROM employees\nWHERE department = 'F'\n  AND salary > ANY (\n      SELECT salary\n      FROM employees\n      WHERE department = 'M'\n  )`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'sub-correlated',
        title: 'Correlated Subqueries',
        description: 'Reference outer query',
        queries: [
          { id: 'sub-13', title: 'Correlated Count', description: 'From **customers**, add a correlated subquery counting orders from **orders** for each customer', query: `SELECT\n    *,\n    (SELECT COUNT(*)\n     FROM orders o\n     WHERE o.customer_id = c.customer_id) AS TotalSales\nFROM customers AS c`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'sub-exists',
        title: 'EXISTS Operator',
        description: 'Check for existence',
        queries: [
          { id: 'sub-14', title: 'EXISTS', description: 'From **orders**, SELECT rows WHERE EXISTS a matching German customer in **customers**', query: `SELECT *\nFROM orders AS o\nWHERE EXISTS (\n    SELECT 1\n    FROM customers AS c\n    WHERE country = 'Germany'\n      AND o.customer_id = c.customer_id\n)`, difficulty: 'advanced' },
          { id: 'sub-15', title: 'NOT EXISTS', description: 'From **orders**, SELECT rows WHERE NOT EXISTS a matching German customer', query: `SELECT *\nFROM orders AS o\nWHERE NOT EXISTS (\n    SELECT 1\n    FROM customers AS c\n    WHERE country = 'Germany'\n      AND o.customer_id = c.customer_id\n)`, difficulty: 'advanced' },
        ]
      }
    ]
  },

  // MODULE 18: CTEs
  {
    id: 'cte',
    title: 'Common Table Expressions',
    icon: '📋',
    color: 'green',
    description: 'CTEs and recursive queries',
    lessons: [
      {
        id: 'cte-nonrecursive',
        title: 'Non-Recursive CTEs',
        description: 'Organize complex queries',
        queries: [
          { id: 'cte-1', title: 'Multiple CTEs', description: 'Build customer analysis using multiple CTEs on **orders** and **customers**: total sales, last order, rank, and segments', query: `WITH CTE_Total_Sales AS (\n    SELECT\n        customer_id,\n        SUM(Sales) AS TotalSales\n    FROM orders\n    GROUP BY customer_id\n),\nCTE_Last_Order AS (\n    SELECT\n        customer_id,\n        MAX(order_date) AS Last_Order\n    FROM orders\n    GROUP BY customer_id\n),\nCTE_Customer_Rank AS (\n    SELECT\n        customer_id,\n        TotalSales,\n        RANK() OVER (ORDER BY TotalSales DESC) AS CustomerRank\n    FROM CTE_Total_Sales\n),\nCTE_Customer_Segments AS (\n    SELECT\n        customer_id,\n        TotalSales,\n        CASE \n            WHEN TotalSales > 100 THEN 'High'\n            WHEN TotalSales > 80  THEN 'Medium'\n            ELSE 'Low'\n        END AS CustomerSegments\n    FROM CTE_Total_Sales\n)\nSELECT\n    c.customer_id,\n    c.first_name,\n    c.last_name,\n    cts.TotalSales,\n    clo.Last_Order,\n    ccr.CustomerRank,\n    ccs.CustomerSegments\nFROM customers AS c\nLEFT JOIN CTE_Total_Sales AS cts ON cts.customer_id = c.customer_id\nLEFT JOIN CTE_Last_Order AS clo ON clo.customer_id = c.customer_id\nLEFT JOIN CTE_Customer_Rank AS ccr ON ccr.customer_id = c.customer_id\nLEFT JOIN CTE_Customer_Segments AS ccs ON ccs.customer_id = c.customer_id`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'cte-recursive',
        title: 'Recursive CTEs',
        description: 'Generate sequences and hierarchies',
        queries: [
          { id: 'cte-2', title: 'Number Sequence', description: 'Use a recursive CTE to generate a sequence of numbers from 1 to 20', query: `WITH Series AS (\n    -- Anchor Query\n    SELECT 1 AS MyNumber\n    UNION ALL\n    -- Recursive Query\n    SELECT MyNumber + 1\n    FROM Series\n    WHERE MyNumber < 20\n)\nSELECT *\nFROM Series`, difficulty: 'advanced' },
          { id: 'cte-3', title: 'Long Sequence', description: 'Use a recursive CTE to generate numbers 1 to 1000 with MAXRECURSION option', query: `WITH Series AS (\n    SELECT 1 AS MyNumber\n    UNION ALL\n    SELECT MyNumber + 1\n    FROM Series\n    WHERE MyNumber < 1000\n)\nSELECT *\nFROM Series\nOPTION (MAXRECURSION 5000)`, difficulty: 'advanced' },
          { id: 'cte-4', title: 'Employee Hierarchy', description: 'Use a recursive CTE on **employees** to build an organizational hierarchy with levels', query: `WITH CTE_Emp_Hierarchy AS (\n    -- Anchor: Top-level employees\n    SELECT\n        employee_id,\n        first_name,\n        employee_id,\n        1 AS Level\n    FROM employees\n    WHERE employee_id IS NULL\n    UNION ALL\n    -- Recursive: Get subordinates\n    SELECT\n        e.employee_id,\n        e.first_name,\n        e.employee_id,\n        Level + 1\n    FROM employees AS e\n    INNER JOIN CTE_Emp_Hierarchy AS ceh\n        ON e.employee_id = ceh.employee_id\n)\nSELECT *\nFROM CTE_Emp_Hierarchy`, difficulty: 'advanced' },
        ]
      }
    ]
  },

  // MODULE 19: Views
  {
    id: 'views',
    title: 'SQL Views',
    icon: '👁️',
    color: 'purple',
    description: 'Create reusable virtual tables',
    lessons: [
      {
        id: 'views-basics',
        title: 'Create & Modify Views',
        description: 'Create, drop, and modify views',
        queries: [
          { id: 'view-1', title: 'Create View', description: 'Create a view V_Monthly_Summary that aggregates **orders** by month with total sales and order count', query: `CREATE VIEW V_Monthly_Summary AS\nSELECT \n    DATETRUNC(month, order_date) AS OrderMonth,\n    SUM(sales) AS TotalSales,\n    COUNT(order_id) AS TotalOrders\nFROM orders\nGROUP BY DATETRUNC(month, order_date)`, difficulty: 'intermediate' },
          { id: 'view-2', title: 'Query a View', description: 'SELECT all data from the V_Monthly_Summary view', query: `SELECT * FROM V_Monthly_Summary`, difficulty: 'beginner' },
          { id: 'view-3', title: 'Drop View', description: 'Use DROP VIEW IF EXISTS to safely remove V_Monthly_Summary', query: `DROP VIEW IF EXISTS V_Monthly_Summary`, difficulty: 'beginner' },
        ]
      },
      {
        id: 'views-complexity',
        title: 'Hide Complexity',
        description: 'Abstract complex joins into views',
        queries: [
          { id: 'view-4', title: 'Complex Join View', description: 'Create a view joining **orders** with **customers** to show order details with customer info', query: `CREATE VIEW V_Order_Details AS\nSELECT \n    o.order_id,\n    o.order_date,\n    c.first_name AS CustomerName,\n    c.country AS Customercountry,\n    o.sales\nFROM orders AS o\nLEFT JOIN customers AS c ON c.id = o.customer_id`, difficulty: 'intermediate' },
          { id: 'view-5', title: 'Query Complex View', description: 'Query V_Order_Details filtering for German customers', query: `SELECT *\nFROM V_Order_Details\nWHERE Customercountry = 'Germany'`, difficulty: 'beginner' },
        ]
      },
      {
        id: 'views-security',
        title: 'Data Security',
        description: 'Restrict data access with views',
        queries: [
          { id: 'view-6', title: 'Filtered View', description: 'Create V_Order_Details_EU excluding USA customers for data security', query: `CREATE VIEW V_Order_Details_EU AS\nSELECT \n    o.order_id,\n    o.order_date,\n    c.first_name,\n    c.country,\n    o.sales\nFROM orders AS o\nLEFT JOIN customers AS c ON c.id = o.customer_id\nWHERE c.country != 'USA'`, difficulty: 'intermediate' },
          { id: 'view-7', title: 'Query Filtered View', description: 'SELECT * from the EU-only V_Order_Details_EU view', query: `SELECT * FROM V_Order_Details_EU`, difficulty: 'beginner' },
        ]
      }
    ]
  },

  // MODULE 20: Temporary Tables
  {
    id: 'temp-tables',
    title: 'Temporary Tables',
    icon: '📝',
    color: 'yellow',
    description: 'Work with session-scoped tables',
    lessons: [
      {
        id: 'temp-basics',
        title: 'Temp Table Basics',
        description: 'Create and use temporary tables',
        queries: [
          { id: 'temp-1', title: 'Create Temp Table', description: 'Copy all data from **orders** into a temporary table #Orders using SELECT INTO', query: `SELECT *\nINTO #Orders\nFROM orders`, difficulty: 'intermediate' },
          { id: 'temp-2', title: 'Query Temp Table', description: 'SELECT all rows from the #Orders temporary table', query: `SELECT * FROM #Orders`, difficulty: 'beginner' },
          { id: 'temp-3', title: 'Delete from Temp', description: 'DELETE rows from #Orders WHERE sales < 50 to clean the data', query: `DELETE FROM #Orders\nWHERE sales < 50`, difficulty: 'intermediate' },
          { id: 'temp-4', title: 'Load Cleaned Data', description: 'Copy the cleaned #Orders data INTO a new orders_cleaned table', query: `SELECT *\nINTO orders_cleaned\nFROM #Orders`, difficulty: 'intermediate' },
        ]
      }
    ]
  },

  // MODULE 21: Stored Procedures
  {
    id: 'stored-procedures',
    title: 'Stored Procedures',
    icon: '⚙️',
    color: 'blue',
    description: 'Reusable SQL code blocks',
    lessons: [
      {
        id: 'sp-basics',
        title: 'Basic Procedures',
        description: 'Create and execute procedures',
        queries: [
          { id: 'sp-1', title: 'Create Procedure', description: 'Create a stored procedure GetCustomerSummary that queries **customers** for USA stats', query: `CREATE PROCEDURE GetCustomerSummary AS\nBEGIN\n    SELECT\n        COUNT(*) AS TotalCustomers,\n        AVG(score) AS Avgscore\n    FROM customers\n    WHERE country = 'USA'\nEND`, difficulty: 'intermediate' },
          { id: 'sp-2', title: 'Execute Procedure', description: 'Execute the GetCustomerSummary stored procedure using EXEC', query: `EXEC GetCustomerSummary`, difficulty: 'beginner' },
        ]
      },
      {
        id: 'sp-parameters',
        title: 'Parameters',
        description: 'Add parameters to procedures',
        queries: [
          { id: 'sp-3', title: 'Procedure with Parameter', description: 'Create GetCustomerByCountry accepting a @country parameter to query **customers**', query: `CREATE PROCEDURE GetCustomerBycountry\n    @country NVARCHAR(50) = 'USA'\nAS\nBEGIN\n    SELECT\n        COUNT(*) AS TotalCustomers,\n        AVG(score) AS Avgscore\n    FROM customers\n    WHERE country = @country\nEND`, difficulty: 'intermediate' },
          { id: 'sp-4', title: 'Execute with Parameter', description: 'Execute GetCustomerByCountry with @country = \'Germany\'', query: `EXEC GetCustomerBycountry @country = 'Germany'`, difficulty: 'beginner' },
          { id: 'sp-5', title: 'Default Parameter', description: 'Execute GetCustomerByCountry without parameter to use default \'USA\'', query: `EXEC GetCustomerBycountry`, difficulty: 'beginner' },
        ]
      },
      {
        id: 'sp-multiple',
        title: 'Multiple Queries',
        description: 'Return multiple result sets',
        queries: [
          { id: 'sp-6', title: 'Multiple Result Sets', description: 'Create GetCountryReport that returns two result sets: **customers** stats and **orders** stats', query: `CREATE PROCEDURE GetcountryReport\n    @country NVARCHAR(50)\nAS\nBEGIN\n    -- Query 1: Customer stats\n    SELECT COUNT(*) AS TotalCustomers\n    FROM customers\n    WHERE country = @country;\n\n    -- Query 2: Order stats\n    SELECT COUNT(order_id) AS TotalOrders,\n           SUM(sales) AS TotalSales\n    FROM orders AS o\n    JOIN customers AS c ON c.id = o.customer_id\n    WHERE c.country = @country;\nEND`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'sp-variables',
        title: 'Variables',
        description: 'Use variables in procedures',
        queries: [
          { id: 'sp-7', title: 'Declare Variables', description: 'Create GetStats that stores **customers** count and avg score in variables', query: `CREATE PROCEDURE GetStats AS\nBEGIN\n    DECLARE @TotalCustomers INT;\n    DECLARE @Avgscore FLOAT;\n    \n    SELECT\n        @TotalCustomers = COUNT(*),\n        @Avgscore = AVG(score)\n    FROM customers;\n    \n    SELECT @TotalCustomers AS Total,\n           @Avgscore AS Average;\nEND`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'sp-control-flow',
        title: 'Control Flow',
        description: 'IF/ELSE statements',
        queries: [
          { id: 'sp-8', title: 'IF EXISTS Check', description: 'Create CleanupNulls that checks IF EXISTS NULL scores in **customers** before updating', query: `CREATE PROCEDURE CleanupNulls\n    @country NVARCHAR(50)\nAS\nBEGIN\n    IF EXISTS (SELECT 1 FROM customers\n               WHERE score IS NULL AND country = @country)\n    BEGIN\n        UPDATE customers\n        SET score = 0\n        WHERE score IS NULL AND country = @country;\n        PRINT 'Updated NULL scores to 0';\n    END\n    ELSE\n    BEGIN\n        PRINT 'No NULL scores found';\n    END;\nEND`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'sp-error-handling',
        title: 'Error Handling',
        description: 'TRY/CATCH blocks',
        queries: [
          { id: 'sp-9', title: 'TRY CATCH', description: 'Handle errors gracefully', query: `CREATE PROCEDURE SafeDivision AS\nBEGIN\n    BEGIN TRY\n        SELECT 1/0 AS Result;\n    END TRY\n    BEGIN CATCH\n        SELECT\n            ERROR_MESSAGE() AS ErrorMessage,\n            ERROR_NUMBER() AS ErrorNumber,\n            ERROR_LINE() AS ErrorLine;\n    END CATCH;\nEND`, difficulty: 'advanced' },
        ]
      }
    ]
  },

  // MODULE 22: Triggers
  {
    id: 'triggers',
    title: 'SQL Triggers',
    icon: '🎯',
    color: 'red',
    description: 'Automatic actions on data changes',
    lessons: [
      {
        id: 'trigger-basics',
        title: 'Trigger Basics',
        description: 'Create triggers for auditing',
        queries: [
          { id: 'trig-1', title: 'Create Log Table', description: 'Create an EmployeeLogs table to store audit records', query: `CREATE TABLE EmployeeLogs\n(\n    LogID INT IDENTITY(1,1) PRIMARY KEY,\n    employee_id INT,\n    LogMessage VARCHAR(255),\n    LogDate DATE\n)`, difficulty: 'intermediate' },
          { id: 'trig-2', title: 'Create Trigger', description: 'Create an AFTER INSERT trigger on **Employees** that logs new inserts', query: `CREATE TRIGGER trg_AfterInsertEmployee\nON Employees\nAFTER INSERT\nAS\nBEGIN\n    INSERT INTO EmployeeLogs (employee_id, LogMessage, LogDate)\n    SELECT\n        employee_id,\n        'New Employee Added',\n        GETDATE()\n    FROM INSERTED;\nEND`, difficulty: 'advanced' },
          { id: 'trig-3', title: 'Test Trigger', description: 'INSERT into **Employees** to fire the trigger and create a log entry', query: `INSERT INTO Employees (employee_id, first_name)\nVALUES (6, 'Maria')`, difficulty: 'beginner' },
          { id: 'trig-4', title: 'Check Logs', description: 'SELECT * from EmployeeLogs to verify the trigger worked', query: `SELECT * FROM EmployeeLogs`, difficulty: 'beginner' },
        ]
      }
    ]
  },

  // MODULE 23: Indexes
  {
    id: 'indexes',
    title: 'SQL Indexes',
    icon: '📑',
    color: 'green',
    description: 'Optimize query performance',
    lessons: [
      {
        id: 'idx-clustered',
        title: 'Clustered Indexes',
        description: 'Physical data ordering',
        queries: [
          { id: 'idx-1', title: 'Create Clustered Index', description: 'Create a CLUSTERED INDEX on **customers**(id) - determines physical row order', query: `CREATE CLUSTERED INDEX idx_Customers_ID\nON customers (id)`, difficulty: 'intermediate' },
          { id: 'idx-2', title: 'Drop Index', description: 'DROP INDEX idx_Customers_ID from **customers** to remove it', query: `DROP INDEX idx_Customers_ID\nON customers`, difficulty: 'beginner' },
        ]
      },
      {
        id: 'idx-nonclustered',
        title: 'Non-Clustered Indexes',
        description: 'Secondary indexes',
        queries: [
          { id: 'idx-3', title: 'Non-Clustered Index', description: 'Create a NONCLUSTERED INDEX on **customers**(first_name) for faster name lookups', query: `CREATE NONCLUSTERED INDEX idx_Customers_Name\nON customers (first_name)`, difficulty: 'intermediate' },
          { id: 'idx-4', title: 'Composite Index', description: 'Create a composite index on **customers**(country, score) for combined filters', query: `CREATE INDEX idx_Customers_countryscore\nON customers (country, score)`, difficulty: 'intermediate' },
          { id: 'idx-5', title: 'Query Using Index', description: 'SELECT from **customers** WHERE country and score - the composite index speeds this up', query: `SELECT *\nFROM customers\nWHERE country = 'USA'\n  AND score > 500`, difficulty: 'beginner' },
        ]
      },
      {
        id: 'idx-unique',
        title: 'Unique Indexes',
        description: 'Enforce uniqueness',
        queries: [
          { id: 'idx-6', title: 'Unique Index', description: 'Create a UNIQUE INDEX on **customers**(email) to prevent duplicate emails', query: `CREATE UNIQUE INDEX idx_Customers_Email\nON customers (email)`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'idx-filtered',
        title: 'Filtered Indexes',
        description: 'Partial indexes',
        queries: [
          { id: 'idx-7', title: 'Filtered Index', description: 'Create a filtered index on **customers** WHERE country = \'USA\' only', query: `CREATE NONCLUSTERED INDEX idx_Customers_USA\nON customers (country)\nWHERE country = 'USA'`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'idx-monitoring',
        title: 'Index Monitoring',
        description: 'Check index usage',
        queries: [
          { id: 'idx-8', title: 'List Indexes', description: 'Use sp_helpindex to view all indexes on **customers** table', query: `sp_helpindex 'customers'`, difficulty: 'beginner' },
          { id: 'idx-9', title: 'Missing Indexes', description: 'Query sys.dm_db_missing_index_details to find recommended indexes', query: `SELECT * FROM sys.dm_db_missing_index_details`, difficulty: 'intermediate' },
          { id: 'idx-10', title: 'Reorganize Index', description: 'REORGANIZE idx_Customers_Name on **customers** for lightweight defragmentation', query: `ALTER INDEX idx_Customers_Name\nON customers REORGANIZE`, difficulty: 'intermediate' },
          { id: 'idx-11', title: 'Rebuild Index', description: 'REBUILD idx_Customers_Name on **customers** for full index rebuild', query: `ALTER INDEX idx_Customers_Name\nON customers REBUILD`, difficulty: 'intermediate' },
        ]
      }
    ]
  },

  // MODULE 24: Partitions
  {
    id: 'partitions',
    title: 'Table Partitioning',
    icon: '📊',
    color: 'orange',
    description: 'Divide large tables',
    lessons: [
      {
        id: 'part-function',
        title: 'Partition Functions',
        description: 'Define partition boundaries',
        queries: [
          { id: 'part-1', title: 'Create Partition Function', description: 'Partition by year', query: `CREATE PARTITION FUNCTION PartitionByYear (DATE)\nAS RANGE LEFT FOR VALUES\n('2023-12-31', '2024-12-31', '2025-12-31')`, difficulty: 'advanced' },
          { id: 'part-2', title: 'List Partition Functions', description: 'View existing functions', query: `SELECT \n    name,\n    function_id,\n    type_desc\nFROM sys.partition_functions`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'part-scheme',
        title: 'Partition Schemes',
        description: 'Map partitions to filegroups',
        queries: [
          { id: 'part-3', title: 'Create Filegroups', description: 'Add storage groups', query: `ALTER DATABASE SalesDB ADD FILEGROUP FG_2023;\nALTER DATABASE SalesDB ADD FILEGROUP FG_2024;\nALTER DATABASE SalesDB ADD FILEGROUP FG_2025;`, difficulty: 'advanced' },
          { id: 'part-4', title: 'Create Partition Scheme', description: 'Map function to filegroups', query: `CREATE PARTITION SCHEME SchemePartitionByYear\nAS PARTITION PartitionByYear\nTO (FG_2023, FG_2024, FG_2025, [PRIMARY])`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'part-table',
        title: 'Partitioned Tables',
        description: 'Create and query partitioned tables',
        queries: [
          { id: 'part-5', title: 'Create Partitioned Table', description: 'Table with partitioning', query: `CREATE TABLE Orders_Partitioned \n(\n    order_id INT,\n    order_date DATE,\n    Sales INT\n) ON SchemePartitionByYear (order_date)`, difficulty: 'advanced' },
          { id: 'part-6', title: 'Insert Partitioned Data', description: 'Add data to partitions', query: `INSERT INTO Orders_Partitioned VALUES\n(1, '2023-05-15', 100),\n(2, '2024-07-20', 50),\n(3, '2025-12-31', 20)`, difficulty: 'intermediate' },
          { id: 'part-7', title: 'Verify Partitions', description: 'Check data distribution', query: `SELECT \n    partition_number,\n    rows\nFROM sys.partitions\nWHERE OBJECT_NAME(object_id) = 'Orders_Partitioned'`, difficulty: 'intermediate' },
        ]
      }
    ]
  },

  // MODULE 25: Performance Optimization
  {
    id: 'performance',
    title: 'Performance Tips',
    icon: '🚀',
    color: 'pink',
    description: '30 SQL optimization tips',
    lessons: [
      {
        id: 'perf-fetching',
        title: 'Fetching Data',
        description: 'Optimize SELECT queries',
        queries: [
          { id: 'perf-1', title: 'Select Only Needed Columns', description: 'From **customers**, avoid SELECT * - instead select only needed columns like id, first_name, country', query: `-- Bad Practice\nSELECT * FROM customers\n\n-- Good Practice\nSELECT id, first_name, country FROM customers`, difficulty: 'beginner' },
          { id: 'perf-2', title: 'Avoid Unnecessary DISTINCT', description: 'From **customers**, remove redundant DISTINCT if your query naturally returns unique rows', query: `-- Bad Practice\nSELECT DISTINCT first_name \nFROM customers \nORDER BY first_name\n\n-- Good Practice\nSELECT first_name FROM customers`, difficulty: 'beginner' },
          { id: 'perf-3', title: 'Limit Rows for Exploration', description: 'From **orders**, use TOP 10 when exploring data to avoid loading all rows', query: `-- Bad Practice\nSELECT order_id, sales FROM orders\n\n-- Good Practice\nSELECT TOP 10 order_id, sales FROM orders`, difficulty: 'beginner' },
        ]
      },
      {
        id: 'perf-filtering',
        title: 'Filtering Tips',
        description: 'Optimize WHERE clauses',
        queries: [
          { id: 'perf-4', title: 'Avoid Functions in WHERE', description: 'On **customers**, avoid LOWER(country) in WHERE - it prevents index usage', query: `-- Bad Practice\nSELECT * FROM customers\nWHERE LOWER(country) = 'usa'\n\n-- Good Practice\nSELECT * FROM customers\nWHERE country = 'USA'`, difficulty: 'intermediate' },
          { id: 'perf-5', title: 'Avoid Leading Wildcards', description: 'On **customers**, leading wildcards like \'%ohn\' are slow - use \'John%\' instead', query: `-- Bad Practice\nSELECT * FROM customers\nWHERE first_name LIKE '%ohn'\n\n-- Good Practice\nSELECT * FROM customers\nWHERE first_name LIKE 'John%'`, difficulty: 'intermediate' },
          { id: 'perf-6', title: 'Use IN Instead of OR', description: 'On **orders**, use IN (1,2,3) instead of multiple OR conditions', query: `-- Bad Practice\nSELECT * FROM orders\nWHERE customer_id = 1 \n   OR customer_id = 2 \n   OR customer_id = 3\n\n-- Good Practice\nSELECT * FROM orders\nWHERE customer_id IN (1, 2, 3)`, difficulty: 'beginner' },
          { id: 'perf-7', title: 'Date Range vs YEAR()', description: 'On **orders**, use BETWEEN for date ranges instead of YEAR() function', query: `-- Bad Practice\nSELECT * FROM orders \nWHERE YEAR(order_date) = 2025\n\n-- Good Practice\nSELECT * FROM orders \nWHERE order_date BETWEEN '2025-01-01' AND '2025-12-31'`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'perf-joins',
        title: 'Join Optimization',
        description: 'Write efficient joins',
        queries: [
          { id: 'perf-8', title: 'Use Explicit Joins', description: 'Join **customers** and **orders** using explicit INNER JOIN syntax instead of WHERE', query: `-- Bad Practice (Implicit Join)\nSELECT o.order_id, c.first_name\nFROM customers c, orders o\nWHERE c.id = o.customer_id\n\n-- Good Practice (Explicit Join)\nSELECT o.order_id, c.first_name\nFROM customers AS c\nINNER JOIN orders AS o\n    ON c.id = o.customer_id`, difficulty: 'intermediate' },
          { id: 'perf-9', title: 'Filter Before Joining', description: 'Filter **orders** in a subquery before joining to **customers** for large tables', query: `-- For Large Tables: Filter First\nSELECT c.first_name, o.order_id\nFROM customers AS c\nINNER JOIN (\n    SELECT order_id, customer_id\n    FROM orders\n    WHERE sales > 100\n) AS o\n    ON c.id = o.customer_id`, difficulty: 'advanced' },
          { id: 'perf-10', title: 'Aggregate Before Joining', description: 'Pre-aggregate **orders** in a subquery before joining to **customers**', query: `-- Good: Pre-aggregated Subquery\nSELECT c.id, c.first_name, o.OrderCount\nFROM customers AS c\nINNER JOIN (\n    SELECT customer_id, COUNT(*) AS OrderCount\n    FROM orders\n    GROUP BY customer_id\n) AS o\n    ON c.id = o.customer_id`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'perf-union',
        title: 'UNION Tips',
        description: 'Optimize set operations',
        queries: [
          { id: 'perf-11', title: 'UNION ALL vs UNION', description: 'UNION ALL between **orders** and **customers** is faster than UNION when duplicates are OK', query: `-- Bad Practice (removes duplicates)\nSELECT customer_id FROM orders\nUNION\nSELECT id FROM customers\n\n-- Good Practice (faster)\nSELECT customer_id FROM orders\nUNION ALL\nSELECT id FROM customers`, difficulty: 'intermediate' },
        ]
      },
      {
        id: 'perf-subqueries',
        title: 'Subquery Tips',
        description: 'JOIN vs EXISTS vs IN',
        queries: [
          { id: 'perf-12', title: 'EXISTS vs IN', description: 'EXISTS on **orders** and **customers** is faster than IN for large tables', query: `-- Bad Practice (IN)\nSELECT * FROM orders\nWHERE customer_id IN (\n    SELECT id FROM customers\n    WHERE country = 'USA'\n)\n\n-- Good Practice (EXISTS)\nSELECT * FROM orders AS o\nWHERE EXISTS (\n    SELECT 1 FROM customers AS c\n    WHERE c.id = o.customer_id\n      AND c.country = 'USA'\n)`, difficulty: 'advanced' },
          { id: 'perf-13', title: 'Avoid Redundant Logic', description: 'On **customers**, use window functions instead of multiple subqueries for comparisons', query: `-- Bad: Multiple subqueries\nSELECT id, first_name, 'Above' AS Status\nFROM customers\nWHERE score > (SELECT AVG(score) FROM customers)\n\n-- Good: Window function\nSELECT id, first_name,\n    CASE WHEN score > AVG(score) OVER ()\n         THEN 'Above' ELSE 'Below'\n    END AS Status\nFROM customers`, difficulty: 'advanced' },
        ]
      },
      {
        id: 'perf-ddl',
        title: 'DDL Best Practices',
        description: 'Design efficient tables',
        queries: [
          { id: 'perf-14', title: 'Good Table Design', description: 'Design tables with proper data types, PRIMARY KEY, and NOT NULL constraints', query: `-- Good Practice\nCREATE TABLE CustomersInfo (\n    customer_id INT PRIMARY KEY CLUSTERED,\n    first_name VARCHAR(50) NOT NULL,\n    last_name VARCHAR(50) NOT NULL,\n    country VARCHAR(50) NOT NULL,\n    score INT,\n    BirthDate DATE\n)`, difficulty: 'intermediate' },
          { id: 'perf-15', title: 'Index Foreign Keys', description: 'Create a NONCLUSTERED INDEX on **orders**(customer_id) to speed up joins', query: `-- Create index on foreign key\nCREATE NONCLUSTERED INDEX IX_Orders_customer_id\nON orders(customer_id)`, difficulty: 'intermediate' },
        ]
      }
    ]
  }
];

// Helper function to get all queries
export function getAllQueries(): SQLQuery[] {
  const allQueries: SQLQuery[] = [];
  for (const module of sqlCurriculum) {
    for (const lesson of module.lessons) {
      allQueries.push(...lesson.queries);
    }
  }
  return allQueries;
}

// Get total query count
export function getTotalQueryCount(): number {
  return getAllQueries().length;
}

// Get query by ID
export function getQueryById(id: string): SQLQuery | undefined {
  return getAllQueries().find(q => q.id === id);
}
