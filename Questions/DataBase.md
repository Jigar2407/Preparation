## Topic 1 : SQL & Database Basics

---

**1. What is SQL? What are the types of SQL commands?**

Answer:
SQL stands for Structured Query Language. It is the standard language used to interact with relational databases like MySQL, PostgreSQL, SQL Server, and Oracle. SQL lets you create, read, update, and delete data in databases.

SQL commands are divided into 5 categories:

```
DDL (Data Definition Language)  — Structure related
    CREATE, ALTER, DROP, TRUNCATE, RENAME

DML (Data Manipulation Language) — Data related
    INSERT, UPDATE, DELETE

DQL (Data Query Language) — Reading data
    SELECT

DCL (Data Control Language) — Permissions
    GRANT, REVOKE

TCL (Transaction Control Language) — Transaction management
    COMMIT, ROLLBACK, SAVEPOINT
```

Note:
- Key Point: DDL changes structure (table itself), DML changes data (rows). TRUNCATE is DDL not DML because it resets the table structure (auto-increment resets). DELETE is DML because it removes row by row.
- Why Interviewer Asks: First question to check if you know basic SQL categorization. The TRUNCATE vs DELETE follow-up is very common.

---

**2. What is the difference between DELETE, TRUNCATE, and DROP?**

Answer:

| Feature | DELETE | TRUNCATE | DROP |
|---------|--------|----------|------|
| Type | DML | DDL | DDL |
| What it does | Removes specific rows | Removes ALL rows | Removes entire table |
| WHERE clause | Yes (can filter) | No (all rows) | No |
| Rollback | Yes (can rollback) | No (cannot rollback in MySQL) | No |
| Auto-increment | Does NOT reset | Resets to 0 | Table gone |
| Speed | Slower (row by row) | Faster (drops and recreates) | Fastest |
| Triggers | Fires triggers | Does NOT fire triggers | Does NOT fire |
| Logs | Logs each row deletion | Minimal logging | No logging |

```sql
-- DELETE: remove specific rows (can rollback if in transaction)
DELETE FROM employees WHERE department = 'MERN';

-- TRUNCATE: remove ALL rows, reset auto-increment
TRUNCATE TABLE employees;

-- DROP: delete entire table (structure + data gone)
DROP TABLE employees;
```

Note:
- Key Point: DELETE is slow but safe (can rollback, can filter). TRUNCATE is fast but removes everything (resets auto-increment). DROP removes the table itself. In production always use DELETE with WHERE clause for safety.
- Why Interviewer Asks: Very commonly asked. They want to hear the rollback difference and auto-increment reset behavior.

---

**3. What are Constraints in SQL?**

Answer:
Constraints are rules applied on table columns to enforce data integrity and validity. They prevent invalid data from being inserted.

```sql
CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,        -- NOT NULL: cannot be NULL
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,    -- UNIQUE: no duplicate values
    age INT CHECK (age >= 18 AND age <= 65), -- CHECK: condition validation
    salary INT DEFAULT 0,                   -- DEFAULT: default value if not provided
    department_id INT,
    
    PRIMARY KEY (id),                       -- PRIMARY KEY: unique + not null identifier
    
    FOREIGN KEY (department_id)             -- FOREIGN KEY: reference to another table
        REFERENCES departments(id)
        ON DELETE CASCADE                   -- if parent deleted, delete child too
        ON UPDATE CASCADE                   -- if parent updated, update child too
);
```

**Foreign Key Actions:**
```
ON DELETE CASCADE    — Delete child rows when parent is deleted
ON DELETE SET NULL   — Set foreign key to NULL when parent is deleted
ON DELETE RESTRICT   — Prevent parent deletion if children exist (default)
ON UPDATE CASCADE    — Update child foreign key when parent key changes
```

Note:
- Key Point: PRIMARY KEY = UNIQUE + NOT NULL (only one per table). FOREIGN KEY creates relationship between tables. CASCADE is important for maintaining referential integrity. CHECK constraint validates data before insert.
- Why Interviewer Asks: Fundamental database design question. Foreign key actions (CASCADE, SET NULL, RESTRICT) are commonly asked follow-ups.

---

**4. What is the difference between Primary Key and Unique Key?**

Answer:

| Feature | Primary Key | Unique Key |
|---------|------------|------------|
| NULL values | NOT allowed | Allowed (one NULL) |
| Per table | Only ONE primary key | Multiple unique keys allowed |
| Purpose | Uniquely identify each row | Prevent duplicate values |
| Index | Creates clustered index | Creates non-clustered index |
| Auto-increment | Can be auto-increment | Cannot be auto-increment |

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,  -- only one primary key
    email VARCHAR(100) UNIQUE,          -- unique but allows NULL
    phone VARCHAR(15) UNIQUE,           -- another unique key (multiple allowed)
    name VARCHAR(50)
);
```

Note:
- Key Point: Primary key is the main identifier of a row — one per table, never NULL. Unique key just prevents duplicates — can have multiple, allows one NULL. Both create indexes automatically.
- Why Interviewer Asks: Basic but important distinction. The NULL behavior and "one vs multiple" difference is what they want to hear.

---

**5. What are Data Types in MySQL?**

Answer:

```sql
-- STRING TYPES
CHAR(n)         -- Fixed length (pads with spaces), max 255. Use for fixed-size data (gender, country code)
VARCHAR(n)      -- Variable length, max 65535. Use for variable-size data (name, email)
TEXT            -- Large text, max 65535 chars
LONGTEXT        -- Very large text, max 4GB
ENUM('val1','val2')  -- One value from predefined list

-- NUMERIC TYPES
TINYINT         -- 1 byte, -128 to 127 (or 0-255 unsigned). Good for boolean/flags
SMALLINT        -- 2 bytes, -32768 to 32767
INT             -- 4 bytes, -2.1B to 2.1B. Most common for IDs
BIGINT          -- 8 bytes, very large numbers
DECIMAL(m,d)    -- Exact precision (m total digits, d decimal). Use for money!
FLOAT           -- Approximate, 4 bytes. Use for scientific data
DOUBLE          -- Approximate, 8 bytes

-- DATE/TIME TYPES
DATE            -- 'YYYY-MM-DD'
TIME            -- 'HH:MM:SS'
DATETIME        -- 'YYYY-MM-DD HH:MM:SS'
TIMESTAMP       -- Same as DATETIME but auto-converts timezone
YEAR            -- 'YYYY'

-- BINARY
BLOB            -- Binary Large Object (images, files)
```

Note:
- Key Point: Use VARCHAR for most strings. Use DECIMAL(not FLOAT) for money/financial data because FLOAT has rounding issues. CHAR is faster than VARCHAR for fixed-length data. TIMESTAMP auto-updates, DATETIME does not.
- Why Interviewer Asks: Tests practical knowledge. The "use DECIMAL for money not FLOAT" is an important point.

---

## Topic 2 : MySQL Queries

---

**6. Explain the order of execution of a SQL query.**

Answer:
SQL query is NOT executed in the order you write it. The actual execution order is:

```sql
-- Written order:
SELECT column          -- 5th
FROM table             -- 1st
JOIN table2            -- 2nd
ON condition           -- 2nd
WHERE condition        -- 3rd
GROUP BY column        -- 4th
HAVING condition       -- 6th
ORDER BY column        -- 7th
LIMIT n                -- 8th

-- Execution order:
-- 1. FROM / JOIN  — Which tables to use
-- 2. WHERE        — Filter rows
-- 3. GROUP BY     — Group the filtered rows
-- 4. HAVING       — Filter groups (after grouping)
-- 5. SELECT       — Choose columns
-- 6. DISTINCT     — Remove duplicates
-- 7. ORDER BY     — Sort results
-- 8. LIMIT/OFFSET — Pagination
```

**Why this matters:**
```sql
-- This WORKS because WHERE runs before SELECT
SELECT name, salary * 12 AS annual_salary
FROM employees
WHERE salary > 5000;  -- 'salary' exists (original column)

-- This FAILS because WHERE runs before SELECT (alias not available)
SELECT name, salary * 12 AS annual_salary
FROM employees
WHERE annual_salary > 60000;  -- ERROR: 'annual_salary' doesn't exist yet

-- Use HAVING for aggregate filters (runs after GROUP BY)
SELECT department, AVG(salary) AS avg_sal
FROM employees
GROUP BY department
HAVING avg_sal > 60000;  -- HAVING can use alias in MySQL
```

Note:
- Key Point: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. WHERE filters rows before grouping, HAVING filters groups after grouping. You cannot use SELECT aliases in WHERE because WHERE runs before SELECT.
- Why Interviewer Asks: Shows deep SQL understanding. Explains why certain queries fail and how to debug them.

---

**7. What are JOINs in SQL? Explain all types.**

Answer:
JOIN combines rows from two or more tables based on a related column.

```sql
-- Setup: employees has department_id, departments has id

-- INNER JOIN — only matching rows from BOTH tables
SELECT e.name, d.name AS dept_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
-- Employees without department: excluded
-- Departments without employees: excluded

-- LEFT JOIN (LEFT OUTER JOIN) — ALL from left + matching from right
SELECT e.name, d.name AS dept_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;
-- ALL employees shown (even without department → dept_name = NULL)

-- RIGHT JOIN — ALL from right + matching from left
SELECT e.name, d.name AS dept_name
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.id;
-- ALL departments shown (even without employees → name = NULL)

-- FULL OUTER JOIN (MySQL doesn't support directly — use UNION)
SELECT e.name, d.name AS dept_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
UNION
SELECT e.name, d.name AS dept_name
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.id;

-- CROSS JOIN — every row from table1 paired with every row from table2
SELECT e.name, d.name
FROM employees e
CROSS JOIN departments d;
-- If employees has 5 rows and departments has 3 → result has 15 rows

-- SELF JOIN — table joined with itself
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

```
Visual:

INNER JOIN:      Only intersection (∩)
LEFT JOIN:       All left + matching right
RIGHT JOIN:      All right + matching left
FULL OUTER JOIN: Everything from both sides
CROSS JOIN:      Cartesian product (every combination)
SELF JOIN:       Table joins with itself
```

Note:
- Key Point: INNER JOIN = only matches. LEFT JOIN = all left side (most commonly used). RIGHT JOIN = all right side. FULL OUTER JOIN = everything. CROSS JOIN = every possible combination. Self JOIN is used for hierarchical data (employee-manager).
- Why Interviewer Asks: Most asked SQL question. They may draw Venn diagrams or give a scenario and ask which JOIN to use. LEFT JOIN is used most in real projects.

---

**8. What is the difference between WHERE and HAVING?**

Answer:

| Feature | WHERE | HAVING |
|---------|-------|--------|
| Filters | Individual rows | Groups (after GROUP BY) |
| Execution | Before GROUP BY | After GROUP BY |
| Aggregate functions | Cannot use (SUM, COUNT, AVG) | Can use aggregate functions |
| Without GROUP BY | Works | Technically works but not meaningful |

```sql
-- WHERE filters rows BEFORE grouping
SELECT department, COUNT(*) AS emp_count, AVG(salary) AS avg_sal
FROM employees
WHERE salary > 30000          -- filter individual rows first
GROUP BY department
HAVING avg_sal > 50000        -- then filter groups
ORDER BY avg_sal DESC;

-- Common mistake: using WHERE with aggregate
-- WRONG:
SELECT department, AVG(salary) AS avg_sal
FROM employees
WHERE AVG(salary) > 50000;    -- ERROR! Cannot use aggregate in WHERE

-- CORRECT:
SELECT department, AVG(salary) AS avg_sal
FROM employees
GROUP BY department
HAVING AVG(salary) > 50000;   -- Use HAVING for aggregate conditions
```

Note:
- Key Point: WHERE = filter rows before grouping (no aggregates). HAVING = filter groups after grouping (with aggregates). You can use both together — WHERE filters rows first, then GROUP BY groups them, then HAVING filters groups.
- Why Interviewer Asks: Very common confusion. They give a query and ask "WHERE or HAVING?" or ask to fix a query that uses aggregate in WHERE.

---

**9. What are Aggregate Functions in MySQL?**

Answer:
Aggregate functions perform calculations on a set of values and return a single value. Used with GROUP BY.

```sql
-- COUNT — count rows
SELECT COUNT(*) AS total FROM employees;                     -- count all rows
SELECT COUNT(email) AS has_email FROM employees;             -- count non-NULL emails
SELECT COUNT(DISTINCT department) AS dept_count FROM employees; -- count unique departments

-- SUM — total of numeric column
SELECT SUM(salary) AS total_salary FROM employees;

-- AVG — average
SELECT AVG(salary) AS avg_salary FROM employees;

-- MAX / MIN — highest / lowest
SELECT MAX(salary) AS highest, MIN(salary) AS lowest FROM employees;

-- GROUP BY with aggregates
SELECT 
    department,
    COUNT(*) AS emp_count,
    AVG(salary) AS avg_salary,
    MAX(salary) AS max_salary,
    SUM(salary) AS total_salary
FROM employees
GROUP BY department
HAVING emp_count > 2
ORDER BY avg_salary DESC;
```

Note:
- Key Point: COUNT(*) counts all rows including NULL. COUNT(column) counts non-NULL values only. All aggregate functions ignore NULL values except COUNT(*). Always use with GROUP BY when you want per-group calculations.
- Why Interviewer Asks: Practical SQL question. COUNT(*) vs COUNT(column) NULL behavior is a common trick question.

---

**10. What are Subqueries? What are the types?**

Answer:
A subquery is a query inside another query. The inner query executes first and its result is used by the outer query.

```sql
-- @@Scalar Subquery (returns single value)
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
-- Employees earning more than average salary

-- @@Row Subquery (returns single row)
SELECT * FROM employees
WHERE (department, salary) = (
    SELECT department, MAX(salary) FROM employees WHERE department = 'MERN'
);

-- @@Table Subquery (returns multiple rows) — used with IN, ANY, ALL, EXISTS
-- IN: matches any value in subquery result
SELECT name FROM employees
WHERE department_id IN (
    SELECT id FROM departments WHERE location = 'Mumbai'
);

-- EXISTS: checks if subquery returns any rows (boolean)
SELECT d.name FROM departments d
WHERE EXISTS (
    SELECT 1 FROM employees e WHERE e.department_id = d.id
);
-- Departments that have at least one employee

-- ANY: true if condition matches ANY row from subquery
SELECT name, salary FROM employees
WHERE salary > ANY (SELECT salary FROM employees WHERE department = 'MERN');

-- ALL: true if condition matches ALL rows from subquery
SELECT name, salary FROM employees
WHERE salary > ALL (SELECT salary FROM employees WHERE department = 'MERN');

-- @@Correlated Subquery (inner query depends on outer query)
SELECT e.name, e.salary, e.department
FROM employees e
WHERE e.salary > (
    SELECT AVG(e2.salary) FROM employees e2 WHERE e2.department = e.department
);
-- Employees earning more than their department's average
```

Note:
- Key Point: Scalar = one value. Row = one row. Table = multiple rows. Correlated subquery references outer query (runs for each row — can be slow). EXISTS is more efficient than IN for large datasets. Subqueries can be replaced with JOINs for better performance.
- Why Interviewer Asks: Tests advanced SQL ability. "Find employees earning more than department average" is a classic correlated subquery question.

---

**11. What are Indexes? Why are they important?**

Answer:
An Index is a data structure (like a book's index) that improves the speed of data retrieval. Without an index MySQL scans every row (Full Table Scan) which is slow for large tables. With an index it directly jumps to the matching rows.

```sql
-- Create index
CREATE INDEX idx_name ON employees(name);
CREATE INDEX idx_dept_salary ON employees(department, salary);  -- composite
CREATE UNIQUE INDEX idx_email ON employees(email);             -- unique index

-- View indexes
SHOW INDEX FROM employees;

-- Drop index
DROP INDEX idx_name ON employees;

-- See if query uses index
EXPLAIN SELECT * FROM employees WHERE name = 'Deep';
-- Look for: type = "ref" or "const" (good) vs "ALL" (full scan — bad)
```

**Types of Indexes:**
```
1. Primary Key Index   — auto-created on PRIMARY KEY column (clustered)
2. Unique Index        — ensures no duplicate values
3. Composite Index     — on multiple columns (order matters!)
4. Full-Text Index     — for text search (MATCH AGAINST)
5. Regular Index       — general purpose speed improvement
```

**When to use and NOT use indexes:**
```
USE index on:
- Columns in WHERE clause
- Columns in JOIN conditions
- Columns in ORDER BY / GROUP BY
- Columns frequently searched

DO NOT index:
- Small tables (full scan is fast enough)
- Columns with many NULL values
- Columns rarely used in queries
- Tables with heavy INSERT/UPDATE (indexes slow down writes)
```

Note:
- Key Point: Indexes speed up reads but slow down writes (INSERT/UPDATE/DELETE must update index too). Composite index order matters — (department, salary) works for WHERE department = 'X' but NOT for WHERE salary > 50000 alone. Over-indexing is bad. Use EXPLAIN to verify index usage.
- Why Interviewer Asks: Performance optimization question. They want to know when to use indexes and the trade-off between read and write performance.

---

**12. What are Transactions? What is ACID?**

Answer:
A Transaction is a group of SQL operations that must ALL succeed or ALL fail. If any operation fails the entire transaction is rolled back (undone).

**ACID Properties:**
```
A — Atomicity:    All or nothing. Either all operations succeed or none do.
C — Consistency:  Database moves from one valid state to another.
I — Isolation:    Concurrent transactions don't interfere with each other.
D — Durability:   Once committed, data is permanently saved (survives crashes).
```

```sql
-- Transaction example: Bank transfer
START TRANSACTION;

UPDATE accounts SET balance = balance - 1000 WHERE name = 'Deep';
UPDATE accounts SET balance = balance + 1000 WHERE name = 'Neel';

-- If both succeed:
COMMIT;    -- save permanently

-- If any fails:
ROLLBACK;  -- undo everything

-- Savepoint: partial rollback
START TRANSACTION;
INSERT INTO orders VALUES (1, 'Order1');
SAVEPOINT sp1;
INSERT INTO orders VALUES (2, 'Order2');
ROLLBACK TO sp1;  -- only Order2 is undone, Order1 stays
COMMIT;
```

Note:
- Key Point: ACID ensures data integrity. COMMIT makes changes permanent. ROLLBACK undoes changes. SAVEPOINT allows partial rollback. InnoDB engine supports transactions, MyISAM does not. Always use transactions for operations that must be atomic (bank transfers, inventory updates).
- Why Interviewer Asks: Very important for data integrity. Bank transfer is the classic example. They want to hear ACID and know when to use transactions.

---

**13. What is Normalization? Explain the normal forms.**

Answer:
Normalization is the process of organizing data in a database to reduce redundancy (duplicate data) and improve data integrity. Each level is called a Normal Form (NF).

```
1NF (First Normal Form):
- Each column has atomic (single) values — no arrays or lists
- Each row is unique (has primary key)
- BAD:  | name  | skills              |
        | Deep  | JS, React, Node     |  ← multiple values in one cell
- GOOD: Separate skills into another table

2NF (Second Normal Form):
- Must be in 1NF
- No partial dependency — every non-key column depends on the ENTIRE primary key
- Problem: In composite primary key (student_id, course_id), if student_name depends only on student_id → partial dependency
- Fix: Move student_name to a separate students table

3NF (Third Normal Form):
- Must be in 2NF
- No transitive dependency — non-key column should not depend on another non-key column
- Problem: employee table has department_id AND department_name → department_name depends on department_id (not on primary key)
- Fix: Move department_name to departments table
```

```sql
-- Unnormalized (bad):
-- employees: id, name, dept_name, dept_location, skill1, skill2, skill3

-- Normalized (good):
-- employees: id, name, department_id
-- departments: id, name, location
-- employee_skills: employee_id, skill
```

Note:
- Key Point: 1NF = atomic values + primary key. 2NF = no partial dependency. 3NF = no transitive dependency. In practice most databases are normalized to 3NF. Over-normalization can slow down queries (too many JOINs). Sometimes controlled denormalization is done for performance.
- Why Interviewer Asks: Database design question. They want to see if you can design proper table structures. 1NF, 2NF, 3NF definitions are commonly asked.

---

**14. Write a query to find the Nth highest salary.**

Answer:

```sql
-- Method 1: Using LIMIT OFFSET (most common for MySQL)
-- Find 3rd highest salary
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 2;    -- skip 2, get 1 (0-indexed, so 3rd)
-- Formula: OFFSET = N - 1

-- Method 2: Using subquery
SELECT MAX(salary) AS third_highest
FROM employees
WHERE salary < (
    SELECT MAX(salary) FROM employees
    WHERE salary < (SELECT MAX(salary) FROM employees)
);

-- Method 3: Using DENSE_RANK() window function (best approach)
SELECT salary FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rank_num
    FROM employees
) ranked
WHERE rank_num = 3;

-- Find Nth highest salary per department
SELECT name, department, salary FROM (
    SELECT name, department, salary,
        DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank
    FROM employees
) ranked
WHERE dept_rank = 1;  -- highest salary per department
```

Note:
- Key Point: LIMIT OFFSET is simplest for MySQL. DENSE_RANK handles duplicate salaries correctly (if two people have same highest salary, both get rank 1). RANK vs DENSE_RANK: RANK skips numbers after ties (1,1,3), DENSE_RANK does not (1,1,2).
- Why Interviewer Asks: Classic SQL coding question. Tests ORDER BY, LIMIT, subqueries, and window functions knowledge.

---

**15. What are SET operations in SQL?**

Answer:

```sql
-- UNION: Combine results from two SELECTs, removes duplicates
SELECT name FROM employees
UNION
SELECT name FROM contractors;
-- Columns must be same count and compatible types

-- UNION ALL: Same as UNION but keeps duplicates (faster)
SELECT city FROM employees
UNION ALL
SELECT city FROM contractors;

-- INTERSECT: Only rows present in BOTH queries
SELECT name FROM employees
INTERSECT
SELECT name FROM contractors;
-- MySQL doesn't directly support — use INNER JOIN or IN instead:
SELECT name FROM employees WHERE name IN (SELECT name FROM contractors);

-- EXCEPT / MINUS: Rows in first query but NOT in second
SELECT name FROM employees
EXCEPT
SELECT name FROM contractors;
-- MySQL alternative:
SELECT name FROM employees WHERE name NOT IN (SELECT name FROM contractors);
```

Note:
- Key Point: UNION removes duplicates (slower), UNION ALL keeps duplicates (faster). Column count and types must match. MySQL does not natively support INTERSECT and EXCEPT but you can achieve them with subqueries or JOINs.
- Why Interviewer Asks: Tests understanding of set theory in SQL. UNION vs UNION ALL performance difference is commonly asked.

---

**16. What are String and Date functions in MySQL?**

Answer:

```sql
-- @@STRING FUNCTIONS
SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM employees;
SELECT UPPER(name), LOWER(name) FROM employees;
SELECT LENGTH(name) AS name_length FROM employees;        -- byte length
SELECT CHAR_LENGTH(name) AS char_count FROM employees;    -- character length
SELECT SUBSTRING(name, 1, 3) FROM employees;              -- first 3 chars
SELECT TRIM('  Deep  ') AS trimmed;                        -- 'Deep'
SELECT REPLACE(email, '@gmail.com', '@company.com') FROM employees;
SELECT REVERSE(name) FROM employees;
SELECT LEFT(name, 3), RIGHT(name, 3) FROM employees;

-- @@DATE FUNCTIONS
SELECT CURRENT_DATE();                                     -- 2025-01-15
SELECT CURRENT_TIME();                                     -- 14:30:00
SELECT NOW();                                              -- 2025-01-15 14:30:00
SELECT YEAR(joining_date), MONTH(joining_date), DAY(joining_date) FROM employees;
SELECT DATEDIFF(CURRENT_DATE(), joining_date) AS days_worked FROM employees;
SELECT DATE_ADD(joining_date, INTERVAL 1 YEAR) AS anniversary FROM employees;
SELECT DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH) AS six_months_ago;
SELECT DATE_FORMAT(joining_date, '%d-%m-%Y') AS formatted FROM employees;
SELECT EXTRACT(YEAR FROM joining_date) FROM employees;
SELECT LAST_DAY('2025-02-15');                             -- 2025-02-28
```

Note:
- Key Point: CONCAT for joining strings. DATEDIFF for calculating days between dates. DATE_ADD/SUB for date arithmetic. DATE_FORMAT for custom formatting. YEAR(), MONTH(), DAY() for extracting parts.
- Why Interviewer Asks: Practical query writing. They may ask "find employees who joined in the last 6 months" — you need DATE_SUB for this.

---

## Topic 3 : Sequelize

---

**17. What is Sequelize? How do you set it up?**

Answer:
Sequelize is a Promise-based Node.js ORM (Object-Relational Mapping) for relational databases like MySQL, PostgreSQL, SQLite, and MSSQL. It lets you interact with database using JavaScript objects and methods instead of writing raw SQL queries.

```javascript
// Install
// npm install sequelize mysql2

// Connection setup
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database_name', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: false,        // set to console.log for debugging
    pool: {
        max: 5,            // max connections
        min: 0,
        acquire: 30000,    // max time to get connection (ms)
        idle: 10000        // max idle time before release (ms)
    }
});

// Test connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection established successfully');
    } catch (error) {
        console.error('Unable to connect:', error);
    }
}

// Sync models with database
await sequelize.sync();              // create tables if not exist
await sequelize.sync({ force: true }); // drop and recreate (DANGEROUS in production)
await sequelize.sync({ alter: true }); // alter tables to match models

// Close connection
await sequelize.close();
```

Note:
- Key Point: Sequelize maps JavaScript classes to database tables and objects to rows. sync({ force: true }) drops all tables — never use in production. Use migrations instead. dialect can be mysql, postgres, sqlite, mssql.
- Why Interviewer Asks: Basic setup question. They want to know you can configure database connection and understand sync options.

---

**18. How do you define a Model in Sequelize?**

Answer:
A Model represents a table in the database. It defines the table structure (columns, types, constraints).

```javascript
const { DataTypes } = require('sequelize');

const Employee = sequelize.define('Employee', {
    // Column definitions
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Primary Key'
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 50]
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    salary: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
            isInt: { msg: 'Salary must be an integer' }
        }
    },
    department: {
        type: DataTypes.ENUM('MERN', 'Data Science', 'Dot Net', 'DevOps'),
        defaultValue: 'MERN'
    },
    joining_date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    // Model options
    tableName: 'employees',       // explicit table name
    timestamps: true,              // adds createdAt, updatedAt
    paranoid: true,               // soft delete (adds deletedAt)
    underscored: true,            // snake_case column names
    freezeTableName: true         // don't pluralize table name
});

module.exports = Employee;
```

Note:
- Key Point: DataTypes define column types (STRING, INTEGER, BOOLEAN, DATE, ENUM, etc). Validate object adds validation rules. paranoid: true enables soft delete (sets deletedAt instead of actually deleting). timestamps: true auto-manages createdAt and updatedAt.
- Why Interviewer Asks: Core Sequelize question. Shows you can define table structure programmatically with proper validations and options.

---

**19. How do you perform CRUD operations in Sequelize?**

Answer:

```javascript
const { Op } = require('sequelize');

// ===== CREATE (INSERT) =====

// Single insert
const emp = await Employee.create({
    name: 'Deep',
    email: 'deep@test.com',
    salary: 50000,
    department: 'MERN'
});

// Bulk insert
await Employee.bulkCreate([
    { name: 'Neel', email: 'neel@test.com', salary: 45000 },
    { name: 'Ketul', email: 'ketul@test.com', salary: 70000 }
], { validate: true });  // validate each row


// ===== READ (SELECT) =====

// Find all
const all = await Employee.findAll();

// Find with conditions (WHERE)
const mernDevs = await Employee.findAll({
    where: { department: 'MERN', salary: { [Op.gt]: 40000 } }
});

// Find one
const emp = await Employee.findOne({ where: { email: 'deep@test.com' } });

// Find by Primary Key
const empById = await Employee.findByPk(1);

// Select specific columns
const names = await Employee.findAll({
    attributes: ['name', 'salary', [sequelize.fn('AVG', sequelize.col('salary')), 'avg_sal']],
    group: 'department'
});

// Pagination
const paginated = await Employee.findAndCountAll({
    where: { isActive: true },
    offset: 10,
    limit: 5,
    order: [['salary', 'DESC']]
});
// Returns: { count: 50, rows: [...5 items...] }

// findOrCreate — find or insert if not exists
const [user, created] = await Employee.findOrCreate({
    where: { email: 'new@test.com' },
    defaults: { name: 'New Employee', salary: 30000 }
});


// ===== UPDATE =====

// Update matching rows
await Employee.update(
    { salary: 60000 },                              // SET
    { where: { name: 'Deep' } }                      // WHERE
);

// Find, update, return updated instance
const emp = await Employee.findByPk(1);
emp.salary = 70000;
await emp.save();

// Upsert — update if exists, create if not
await Employee.upsert({
    email: 'deep@test.com',    // unique key to match
    salary: 75000
});

// Increment/Decrement
await Employee.increment({ salary: 5000 }, { where: { department: 'MERN' } });


// ===== DELETE =====

// Delete matching rows
await Employee.destroy({ where: { name: 'Jigo' } });

// Delete by instance
const emp = await Employee.findByPk(1);
await emp.destroy();

// Soft delete (if paranoid: true) — sets deletedAt
await emp.destroy();           // soft delete
await emp.destroy({ force: true }); // hard delete (permanently)
await emp.restore();           // restore soft-deleted record

// Truncate
await Employee.destroy({ truncate: true });
```

Note:
- Key Point: create = INSERT. findAll = SELECT. update = UPDATE. destroy = DELETE. findAndCountAll is best for pagination (gives total count + limited rows). findOrCreate prevents duplicate insert. paranoid enables soft delete with restore capability.
- Why Interviewer Asks: Core practical question. They want to see CRUD fluency with proper options like validation, pagination, and soft delete.

---

**20. What are Associations in Sequelize? Explain all types.**

Answer:
Associations define relationships between models (tables). Sequelize provides 4 types:

```javascript
// ===== ONE-TO-ONE =====
// Employee has one Profile, Profile belongs to one Employee
Employee.hasOne(Profile);       // FK 'employeeId' added to Profile table
Profile.belongsTo(Employee);    // FK 'employeeId' in Profile table

// ===== ONE-TO-MANY =====
// Department has many Employees, Employee belongs to one Department
Department.hasMany(Employee);   // FK 'departmentId' added to Employee table
Employee.belongsTo(Department); // FK 'departmentId' in Employee table

// ===== MANY-TO-MANY =====
// Employee can have many Projects, Project can have many Employees
Employee.belongsToMany(Project, { through: 'EmployeeProjects' });
Project.belongsToMany(Employee, { through: 'EmployeeProjects' });
// Creates junction table 'EmployeeProjects' with employeeId + projectId

// ===== Using Associations (Eager Loading with include) =====

// Find employees with their department (JOIN)
const employees = await Employee.findAll({
    include: {
        model: Department,
        as: 'department',
        attributes: ['name', 'location']
    }
});
// SQL: SELECT employees.*, departments.name, departments.location 
//      FROM employees LEFT JOIN departments ON ...

// Nested include (multi-level JOIN)
const result = await Department.findAll({
    include: {
        model: Employee,
        include: { model: Profile }
    }
});

// Custom foreign key and alias
Employee.belongsTo(Department, {
    foreignKey: 'dept_id',
    as: 'department'
});
```

Note:
- Key Point: hasOne/hasMany puts FK in target model. belongsTo puts FK in source model. belongsToMany creates junction table. include does eager loading (JOIN). Always define both sides of the relationship (hasMany + belongsTo). as creates alias for the association.
- Why Interviewer Asks: Relationships are core to any database application. They want to see you can set up proper associations and query with includes (JOINs).

---

**21. How do you write Raw Queries in Sequelize?**

Answer:

```javascript
const { QueryTypes } = require('sequelize');

// Basic raw query
const employees = await sequelize.query(
    'SELECT * FROM employees WHERE department = :dept AND salary > :minSal',
    {
        replacements: { dept: 'MERN', minSal: 40000 },
        type: QueryTypes.SELECT
    }
);

// Using ? placeholders (positional)
const result = await sequelize.query(
    'SELECT * FROM employees WHERE name = ? AND age > ?',
    {
        replacements: ['Deep', 20],
        type: QueryTypes.SELECT
    }
);

// Bind parameters (more secure — uses prepared statements)
const bound = await sequelize.query(
    'SELECT * FROM employees WHERE name = $name AND age > $age',
    {
        bind: { name: 'Deep', age: 20 },
        type: QueryTypes.SELECT
    }
);

// Map results to model
const mapped = await sequelize.query(
    'SELECT * FROM employees',
    {
        model: Employee,
        mapToModel: true
    }
);

// Other query types
await sequelize.query('INSERT INTO logs (msg) VALUES (:msg)', {
    replacements: { msg: 'Hello' },
    type: QueryTypes.INSERT
});
```

**Difference between Replacements and Bind:**
```
Replacements: Values inserted INTO the SQL string before sending to DB
    DB sees: SELECT * FROM employees WHERE name = 'Deep'

Bind: SQL sent with placeholders, values sent separately
    DB sees: SELECT * FROM employees WHERE name = $1
    Values: ['Deep']
    More secure against SQL injection
```

Note:
- Key Point: Bind is more secure than replacements (prevents SQL injection). Use QueryTypes to tell Sequelize the query type. Use raw queries when Sequelize ORM methods cannot express complex queries. mapToModel converts results to Sequelize model instances.
- Why Interviewer Asks: Shows you can handle complex queries that ORM methods cannot do easily. Understanding bind vs replacements shows security awareness.

---

## Topic 4 : SQL vs NoSQL

---

**22. What is the difference between SQL and NoSQL databases?**

Answer:

| Feature | SQL (MySQL) | NoSQL (MongoDB) |
|---------|-------------|-----------------|
| Data Model | Tables with rows and columns | Collections with JSON documents |
| Schema | Fixed schema (must define before insert) | Flexible schema (each doc can differ) |
| Query Language | SQL (structured) | MongoDB Query Language (JSON-based) |
| Relationships | JOINs with foreign keys | Embedded documents or $lookup |
| Scalability | Vertical (bigger server) | Horizontal (more servers / sharding) |
| ACID | Full ACID support | ACID at document level (multi-doc from v4.0) |
| Best For | Structured data, complex queries, transactions | Unstructured data, rapid development, big data |
| Examples | MySQL, PostgreSQL, Oracle, SQL Server | MongoDB, CouchDB, Cassandra, Redis |

**When to use SQL:**
- Data is highly structured and relational
- Complex queries with multiple JOINs needed
- Strict data integrity required (banking, financial)
- Data structure rarely changes

**When to use NoSQL:**
- Flexible or changing data structure
- Large volumes of unstructured data
- Rapid development and iteration
- Horizontal scaling needed (distributed systems)
- Real-time applications (chat, IoT, gaming)

Note:
- Key Point: SQL = structured, strict, JOINs, ACID. NoSQL = flexible, scalable, embedded, fast development. In MERN stack MongoDB is used because JavaScript objects naturally map to JSON documents. Choose based on your data and requirements not just preference.
- Why Interviewer Asks: Fundamental question for any database developer. They want to hear you explain trade-offs and when to choose which.

---

## Topic 5 : MongoDB Basics

---

**23. What is MongoDB? Explain its architecture.**

Answer:
MongoDB is a NoSQL document-oriented database that stores data in flexible, JSON-like documents called BSON (Binary JSON). Instead of rows in tables it uses documents in collections.

**Architecture:**
```
Server (mongod process)
  └── Database (like a database in MySQL)
       ├── Collection (like a table)
       │    ├── Document (like a row — JSON object)
       │    │    ├── Field: Value (like column: value)
       │    │    ├── Field: Value
       │    │    └── Field: { nested document }
       │    ├── Document
       │    └── Document
       └── Collection
```

```javascript
// MySQL row:
// | id | name  | age | skills          |
// | 1  | Deep  | 23  | JS,React,Node   |  ← rigid, one skill column

// MongoDB document:
{
    _id: ObjectId("507f1f77bcf86cd799439011"),
    name: "Deep",
    age: 23,
    skills: ["JavaScript", "React", "Node.js"],  // array
    address: {                                     // nested object
        city: "Surat",
        state: "Gujarat"
    }
}
// Flexible — can have arrays, nested objects, different fields per document
```

Note:
- Key Point: MongoDB stores data as BSON documents (binary JSON). Schema-less so each document can have different fields. _id is auto-generated unique identifier (ObjectId). Supports arrays and nested objects natively — no need for separate tables like in SQL.
- Why Interviewer Asks: First MongoDB question. They want to hear "document-oriented, schema-less, BSON, collections" keywords.

---

**24. What is the difference between Embedded and Referenced relationships in MongoDB?**

Answer:

**Embedded (Denormalized)** — Store related data INSIDE the parent document. One query fetches everything.

**Referenced (Normalized)** — Store reference (_id) and query separately. Like foreign keys in SQL.

```javascript
// ===== EMBEDDED (One-to-Few, data accessed together) =====
// Good for: address, profile info, few comments
{
    _id: ObjectId("..."),
    name: "Deep",
    address: {                          // embedded one-to-one
        city: "Surat",
        state: "Gujarat"
    },
    education: [                        // embedded one-to-many
        { degree: "BCA", year: 2022 },
        { degree: "MCA", year: 2024 }
    ]
}
// Advantage: Single query, fast reads
// Disadvantage: Document size limit (16MB), data duplication

// ===== REFERENCED (One-to-Many, Many-to-Many) =====
// Good for: departments, products with many reviews

// employees collection
{
    _id: ObjectId("emp1"),
    name: "Deep",
    department_id: ObjectId("dept1")    // reference
}

// departments collection
{
    _id: ObjectId("dept1"),
    name: "MERN Stack"
}

// Need $lookup (aggregation) or populate (Mongoose) to join
// Advantage: No duplication, no size limit
// Disadvantage: Multiple queries, slower reads
```

**When to Embed vs Reference:**
```
Embed when:
- Data is read together frequently
- Child data belongs to only one parent
- Data rarely changes
- Small number of child items

Reference when:
- Data is shared across multiple documents
- Child data changes frequently
- Large or growing number of child items
- Document size could exceed 16MB
```

Note:
- Key Point: Embedded = fast reads, single query, but 16MB limit and duplication. Referenced = no duplication, flexible, but slower (multiple queries). Most MongoDB schemas use a mix of both. This is the most important MongoDB design decision.
- Why Interviewer Asks: Core MongoDB design question. They want to see you can make the right choice based on data access patterns.

---

**25. What are MongoDB CRUD operations? Show syntax for each.**

Answer:

```javascript
// ===== CREATE =====
// Insert one
db.employees.insertOne({
    name: "Deep", age: 23, salary: 50000
});
// Insert many
db.employees.insertMany([
    { name: "Neel", age: 22 },
    { name: "Ketul", age: 27 }
]);

// ===== READ =====
// Find all
db.employees.find();
// Find with filter
db.employees.find({ department: "MERN", age: { $gte: 20 } });
// Find one
db.employees.findOne({ email: "deep@test.com" });
// Projection (select specific fields)
db.employees.find({}, { name: 1, salary: 1, _id: 0 });
// Sort + Limit + Skip (pagination)
db.employees.find().sort({ salary: -1 }).skip(10).limit(5);

// ===== UPDATE =====
// Update one
db.employees.updateOne(
    { name: "Deep" },
    { $set: { salary: 60000 } }
);
// Update many
db.employees.updateMany(
    { department: "MERN" },
    { $inc: { salary: 5000 } }
);
// Replace entire document
db.employees.replaceOne(
    { name: "Deep" },
    { name: "Deep Patel", age: 24, salary: 70000 }
);
// Upsert
db.employees.updateOne(
    { email: "new@test.com" },
    { $set: { name: "New", salary: 30000 } },
    { upsert: true }
);

// ===== DELETE =====
db.employees.deleteOne({ name: "Jigo" });
db.employees.deleteMany({ isActive: false });
db.employees.deleteMany({});  // delete all (like TRUNCATE)
db.employees.drop();          // drop collection (like DROP TABLE)
```

Note:
- Key Point: All write operations return { acknowledged: true, ...counts }. find() returns cursor (use .toArray() in code). updateOne/Many require update operators ($set, $inc, etc.) — cannot pass plain object. replaceOne replaces entire document. upsert creates if not found.
- Why Interviewer Asks: Basic MongoDB question. They want to see you know the syntax for all CRUD operations and understand the difference between update and replace.

---

**26. What are the important Query Operators in MongoDB?**

Answer:

```javascript
// ===== COMPARISON =====
{ age: { $eq: 23 } }           // equal (same as { age: 23 })
{ age: { $ne: 23 } }           // not equal
{ salary: { $gt: 50000 } }     // greater than
{ salary: { $gte: 50000 } }    // greater than or equal
{ salary: { $lt: 60000 } }     // less than
{ salary: { $lte: 60000 } }    // less than or equal
{ dept: { $in: ["MERN", "DS"] } }    // matches any in array
{ dept: { $nin: ["MERN"] } }         // not in array

// ===== LOGICAL =====
{ $and: [{ age: { $gte: 20 } }, { salary: { $gt: 40000 } }] }
{ $or: [{ dept: "MERN" }, { dept: "DS" }] }
{ age: { $not: { $gt: 25 } } }
{ $nor: [{ dept: "MERN" }, { isActive: false }] }

// ===== ELEMENT =====
{ email: { $exists: true } }    // field exists
{ age: { $type: "number" } }    // field is specific type

// ===== PATTERN MATCHING =====
{ name: { $regex: /^Deep/i } }  // starts with "Deep" (case insensitive)
{ name: { $regex: /patel$/i } } // ends with "patel"

// ===== ARRAY =====
{ skills: { $size: 3 } }                           // array has exactly 3 elements
{ skills: { $all: ["JS", "React"] } }              // array contains ALL these values
{ scores: { $elemMatch: { $gt: 80, $lt: 90 } } }  // array element matches ALL conditions

// ===== COMBINATION =====
db.employees.find({
    $and: [
        { $or: [{ dept: "MERN" }, { dept: "DS" }] },
        { age: { $gte: 20 } },
        { salary: { $gt: 40000, $lt: 80000 } }
    ]
});
```

Note:
- Key Point: Comparison operators start with $ (dollar sign). $in is like SQL IN clause. $regex is like SQL LIKE. $elemMatch is for matching conditions within array elements. Implicit AND — multiple conditions in same object are ANDed automatically.
- Why Interviewer Asks: Shows you can write complex queries. The $elemMatch vs $all difference is a common trick question.

---

**27. What is the Aggregation Pipeline in MongoDB?**

Answer:
Aggregation Pipeline is MongoDB's way of processing data through a series of stages. Data flows through stages like a factory assembly line — each stage transforms the data and passes it to the next.

```javascript
// Equivalent of:
// SELECT department, COUNT(*) as count, AVG(salary) as avg_sal
// FROM employees
// WHERE isActive = true
// GROUP BY department
// HAVING avg_sal > 50000
// ORDER BY avg_sal DESC
// LIMIT 5

db.employees.aggregate([
    // Stage 1: WHERE (filter)
    { $match: { isActive: true } },
    
    // Stage 2: GROUP BY
    { $group: {
        _id: "$department",                    // GROUP BY department
        count: { $sum: 1 },                    // COUNT(*)
        avg_sal: { $avg: "$salary" },          // AVG(salary)
        max_sal: { $max: "$salary" },          // MAX(salary)
        total_sal: { $sum: "$salary" },        // SUM(salary)
        employees: { $push: "$name" }          // collect names into array
    }},
    
    // Stage 3: HAVING (filter after group)
    { $match: { avg_sal: { $gt: 50000 } } },
    
    // Stage 4: ORDER BY
    { $sort: { avg_sal: -1 } },
    
    // Stage 5: LIMIT
    { $limit: 5 },
    
    // Stage 6: SELECT / reshape
    { $project: {
        department: "$_id",
        count: 1,
        avg_sal: { $round: ["$avg_sal", 2] },
        _id: 0
    }}
]);

// ===== $lookup (JOIN) =====
db.employees.aggregate([
    { $lookup: {
        from: "departments",           // collection to join
        localField: "department_id",    // field in employees
        foreignField: "_id",           // field in departments
        as: "dept_info"                // output array name
    }},
    { $unwind: "$dept_info" },         // flatten array to object
    { $project: {
        name: 1,
        salary: 1,
        deptName: "$dept_info.name"
    }}
]);

// ===== $unwind (flatten arrays) =====
// { name: "Deep", skills: ["JS","React","Node"] }
// becomes 3 documents:
// { name: "Deep", skills: "JS" }
// { name: "Deep", skills: "React" }
// { name: "Deep", skills: "Node" }
db.employees.aggregate([
    { $unwind: "$skills" },
    { $group: { _id: "$skills", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
]);
```

Note:
- Key Point: Pipeline = array of stages executed in order. $match = WHERE/HAVING. $group = GROUP BY (needs _id field). $sort = ORDER BY. $project = SELECT. $lookup = JOIN. $unwind = flatten arrays. Put $match early for performance (filters reduce data for subsequent stages).
- Why Interviewer Asks: Most important MongoDB advanced topic. They may ask to convert a SQL query to aggregation pipeline. Understanding stages and their order is key.

---

**28. What are Indexes in MongoDB? Why are they important?**

Answer:
Indexes are special data structures that store a small portion of collection data in an easy-to-traverse form. Without indexes MongoDB scans every document (Collection Scan). With indexes it directly finds matching documents (Index Scan).

```javascript
// Create indexes
db.employees.createIndex({ name: 1 });                     // single field ascending
db.employees.createIndex({ department: 1, salary: -1 });   // compound
db.employees.createIndex({ email: 1 }, { unique: true });  // unique
db.employees.createIndex({ name: "text", bio: "text" });   // full-text search
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 }); // TTL

// View indexes
db.employees.getIndexes();

// Drop index
db.employees.dropIndex("name_1");

// Check if query uses index
db.employees.find({ name: "Deep" }).explain("executionStats");
// IXSCAN = index used (good), COLLSCAN = full scan (bad)
```

```
Index Types:
1. Single Field    — one column index
2. Compound        — multiple columns (order matters)
3. Unique          — no duplicate values
4. Text            — full-text search
5. TTL             — auto-delete documents after time
6. Partial         — index only documents matching a filter
7. Hashed          — for hash-based sharding
```

Note:
- Key Point: _id is automatically indexed. Indexes speed up reads but slow down writes. Compound index order matters — {dept, salary} works for queries on dept alone but NOT salary alone. Use explain() to verify index usage. TTL indexes are great for session data, temporary tokens.
- Why Interviewer Asks: Performance question. They want to know when to index, when not to, and how to verify index usage with explain().

---

## Topic 6 : Mongoose

---

**29. What is Mongoose? How is it different from MongoDB native driver?**

Answer:
Mongoose is an ODM (Object Data Modeling) library for MongoDB in Node.js. It provides schema definition, validation, middleware (hooks), and population (JOIN-like behavior) on top of the MongoDB native driver.

| Feature | MongoDB Native Driver | Mongoose |
|---------|----------------------|----------|
| Schema | No schema (schema-less) | Schema enforced |
| Validation | No built-in validation | Built-in + custom validators |
| Middleware | No hooks | Pre/Post hooks (save, find, etc.) |
| Relationships | Manual $lookup | populate() method |
| Type Casting | No | Auto type casting |
| Default Values | No | Supports defaults |
| Virtuals | No | Computed virtual fields |

```javascript
// MongoDB Native Driver
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('mydb');
// No schema — can insert anything
await db.collection('users').insertOne({ name: "Deep", random: true, xyz: 123 });

// Mongoose
const mongoose = require('mongoose');
await mongoose.connect('mongodb://localhost:27017/mydb');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, min: 18 }
});
const User = mongoose.model('User', userSchema);
// Schema enforced — validation, type checking
await User.create({ name: "Deep", age: 23 });
```

Note:
- Key Point: Mongoose adds structure and validation to schema-less MongoDB. Native driver is lighter and faster but you handle everything manually. In MERN projects Mongoose is standard because it provides safety and convenience. Mongoose is to MongoDB what Sequelize is to MySQL.
- Why Interviewer Asks: Shows understanding of why we use ORMs/ODMs instead of raw drivers. The analogy "Mongoose is to MongoDB what Sequelize is to MySQL" is a good answer.

---

**30. How do you define a Schema and Model in Mongoose?**

Answer:

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Minimum 2 characters'],
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email']
    },
    age: {
        type: Number,
        min: [18, 'Must be 18+'],
        max: 65
    },
    salary: {
        type: Number,
        default: 0,
        validate: {
            validator: (val) => val >= 0,
            message: 'Salary cannot be negative'
        }
    },
    department: {
        type: String,
        enum: ['MERN', 'Data Science', 'Dot Net', 'DevOps']
    },
    skills: [String],                           // array of strings
    address: {                                   // nested object
        city: String,
        state: String
    },
    department_id: {
        type: Schema.Types.ObjectId,
        ref: 'Department'                        // reference for populate
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,      // createdAt, updatedAt
    versionKey: false       // disable __v
});

// Create model
const Employee = mongoose.model('Employee', employeeSchema);
// Creates collection 'employees' (lowercase + plural)

module.exports = Employee;
```

Note:
- Key Point: Schema defines structure, Model compiles schema into a constructor. ref enables populate (JOIN). timestamps auto-manages createdAt/updatedAt. Validation runs on create and save by default, NOT on update (use runValidators: true). Mongoose auto-pluralizes and lowercases model name for collection.
- Why Interviewer Asks: Core Mongoose question. Schema definition with proper validations and references is what they want to see.

---

**31. How do you perform CRUD in Mongoose?**

Answer:

```javascript
// ===== CREATE =====
// Method 1: create (build + save in one step)
const emp = await Employee.create({
    name: 'Deep', email: 'deep@test.com', age: 23, salary: 50000
});

// Method 2: new + save (can modify before saving)
const emp2 = new Employee({ name: 'Neel', email: 'neel@test.com' });
emp2.skills.push('Python');
await emp2.save();

// Bulk insert
await Employee.insertMany([{ name: 'A' }, { name: 'B' }]);


// ===== READ =====
const all = await Employee.find();
const filtered = await Employee.find({ department: 'MERN', age: { $gte: 20 } });
const one = await Employee.findOne({ email: 'deep@test.com' });
const byId = await Employee.findById('60f7b2c9e8b1a2d3c4e5f6a7');

// Projection (select specific fields)
const names = await Employee.find().select('name email -_id');

// Sort + Paginate
const paginated = await Employee.find()
    .sort({ salary: -1 })
    .skip(10)
    .limit(5)
    .lean();                // plain JS objects (faster)

// Count
const count = await Employee.countDocuments({ department: 'MERN' });


// ===== UPDATE =====
await Employee.updateOne(
    { email: 'deep@test.com' },
    { $set: { salary: 70000 } }
);

// Find and return updated document
const updated = await Employee.findOneAndUpdate(
    { email: 'deep@test.com' },
    { $set: { salary: 75000 } },
    { new: true, runValidators: true }   // return updated + validate
);

const updatedById = await Employee.findByIdAndUpdate(
    '60f7b2c9e8b1a2d3c4e5f6a7',
    { $inc: { salary: 5000 } },
    { new: true }
);


// ===== DELETE =====
await Employee.deleteOne({ email: 'old@test.com' });
await Employee.deleteMany({ isActive: false });
const deleted = await Employee.findOneAndDelete({ name: 'Jigo' });
const deletedById = await Employee.findByIdAndDelete('60f7...');
```

Note:
- Key Point: create = build + save. findOneAndUpdate/Delete returns the document. { new: true } returns updated doc (default returns old). { runValidators: true } validates on update (not done by default). lean() returns plain objects without Mongoose overhead (5-10x faster for read-only).
- Why Interviewer Asks: Everyday Mongoose operations. { new: true } and { runValidators: true } options are important practical details.

---

**32. What is populate() in Mongoose? How does it work?**

Answer:
populate() replaces an ObjectId reference field with the actual document from the referenced collection. It is Mongoose's way of doing JOINs.

```javascript
// Schema setup
const departmentSchema = new Schema({ name: String, location: String });
const Department = mongoose.model('Department', departmentSchema);

const employeeSchema = new Schema({
    name: String,
    department_id: { type: Schema.Types.ObjectId, ref: 'Department' }
});
const Employee = mongoose.model('Employee', employeeSchema);

// Without populate:
const emp = await Employee.findOne({ name: 'Deep' });
console.log(emp.department_id);
// ObjectId("60f7b2c9e8b1a2d3c4e5f6a7") ← just the ID

// With populate:
const emp = await Employee.findOne({ name: 'Deep' }).populate('department_id');
console.log(emp.department_id);
// { _id: "60f7...", name: "MERN Stack", location: "Building A" } ← full document!

// Select specific fields from populated document
const emp = await Employee.findOne({ name: 'Deep' })
    .populate('department_id', 'name location');  // only name and location

// Multiple populates
const emp = await Employee.find()
    .populate('department_id')
    .populate('manager_id');

// Nested populate
const emp = await Employee.find()
    .populate({
        path: 'department_id',
        populate: { path: 'head_id', select: 'name email' }
    });

// Populate with conditions
const emp = await Employee.find()
    .populate({
        path: 'department_id',
        match: { isActive: true },    // only populate active departments
        select: 'name'
    });
```

Note:
- Key Point: populate requires ref in schema definition. It makes separate queries to referenced collection (not actual JOIN like SQL). For better performance use aggregation $lookup instead for complex queries. populate is Mongoose-specific, $lookup is MongoDB native.
- Why Interviewer Asks: Core Mongoose feature. They want to see how you handle relationships in MongoDB. Understanding that populate makes extra queries (not true JOIN) shows deeper knowledge.

---

**33. What are Middleware (Hooks) in Mongoose?**

Answer:
Middleware are functions that run at specific stages of a Mongoose operation. They have two types: pre (before) and post (after).

```javascript
// ===== PRE HOOKS (before operation) =====

// Before saving — hash password
const bcrypt = require('bcryptjs');
employeeSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Before find — always filter active records
employeeSchema.pre(/^find/, function(next) {
    this.where({ isActive: true });
    next();
});

// Before delete — cascade delete related documents
employeeSchema.pre('findOneAndDelete', async function(next) {
    const doc = await this.model.findOne(this.getFilter());
    await Project.deleteMany({ employee_id: doc._id });
    next();
});


// ===== POST HOOKS (after operation) =====

// After saving — log
employeeSchema.post('save', function(doc) {
    console.log(`${doc.name} saved successfully`);
});

// After find — modify results
employeeSchema.post('find', function(docs) {
    console.log(`Found ${docs.length} documents`);
});


// ===== AVAILABLE HOOKS =====
// Document: validate, save, remove, updateOne, deleteOne
// Query: find, findOne, findOneAndUpdate, findOneAndDelete, 
//        updateOne, updateMany, deleteOne, deleteMany, count
// Aggregate: aggregate
// Model: insertMany
```

Note:
- Key Point: Pre hooks run BEFORE the operation — perfect for validation, transformation, password hashing. Post hooks run AFTER — perfect for logging, notifications. Always call next() in pre hooks or the operation hangs. Pre save hook: `this` = the document. Pre find hook: `this` = the query.
- Why Interviewer Asks: Shows advanced Mongoose knowledge. Password hashing in pre-save is the most practical example. Cascade delete is also a strong answer.

---

## Topic 7 : Comparison Questions (MySQL vs MongoDB, Sequelize vs Mongoose)

---

**34. Compare CRUD syntax: MySQL vs MongoDB.**

Answer:

```
INSERT:
MySQL:    INSERT INTO employees (name, age) VALUES ('Deep', 23);
MongoDB:  db.employees.insertOne({ name: "Deep", age: 23 });

SELECT ALL:
MySQL:    SELECT * FROM employees;
MongoDB:  db.employees.find();

SELECT WITH WHERE:
MySQL:    SELECT name, salary FROM employees WHERE age > 20 AND dept = 'MERN';
MongoDB:  db.employees.find({ age: {$gt:20}, dept: "MERN" }, { name:1, salary:1 });

UPDATE:
MySQL:    UPDATE employees SET salary = 60000 WHERE name = 'Deep';
MongoDB:  db.employees.updateOne({ name: "Deep" }, { $set: { salary: 60000 } });

DELETE:
MySQL:    DELETE FROM employees WHERE name = 'Deep';
MongoDB:  db.employees.deleteOne({ name: "Deep" });

JOIN:
MySQL:    SELECT * FROM employees e JOIN departments d ON e.dept_id = d.id;
MongoDB:  db.employees.aggregate([{ $lookup: { from: "departments", ... } }]);

GROUP BY:
MySQL:    SELECT dept, COUNT(*) FROM employees GROUP BY dept;
MongoDB:  db.employees.aggregate([{ $group: { _id: "$dept", count: { $sum: 1 } } }]);

LIKE:
MySQL:    SELECT * FROM employees WHERE name LIKE '%Deep%';
MongoDB:  db.employees.find({ name: { $regex: /Deep/i } });

LIMIT:
MySQL:    SELECT * FROM employees LIMIT 10 OFFSET 20;
MongoDB:  db.employees.find().skip(20).limit(10);
```

Note:
- Key Point: MySQL uses SQL syntax, MongoDB uses JSON-like syntax. MongoDB uses $ operators instead of SQL keywords. MongoDB aggregation pipeline replaces SQL GROUP BY and JOIN. Knowing both syntaxes side-by-side shows you can work with either database.
- Why Interviewer Asks: Direct comparison question. They may ask "how would you write this SQL query in MongoDB?" Having this mapping ready helps.

---

**35. Compare Sequelize vs Mongoose CRUD.**

Answer:

```javascript
// INSERT
// Sequelize:
await Employee.create({ name: 'Deep', salary: 50000 });
// Mongoose:
await Employee.create({ name: 'Deep', salary: 50000 });
// Same syntax!

// FIND ALL
// Sequelize:
await Employee.findAll({ where: { dept: 'MERN' } });
// Mongoose:
await Employee.find({ dept: 'MERN' });

// FIND ONE
// Sequelize:
await Employee.findOne({ where: { email: 'deep@test.com' } });
// Mongoose:
await Employee.findOne({ email: 'deep@test.com' });

// FIND BY ID
// Sequelize:
await Employee.findByPk(1);
// Mongoose:
await Employee.findById('60f7b2c9...');

// UPDATE
// Sequelize:
await Employee.update({ salary: 60000 }, { where: { name: 'Deep' } });
// Mongoose:
await Employee.updateOne({ name: 'Deep' }, { $set: { salary: 60000 } });

// FIND AND UPDATE (return updated)
// Sequelize — no direct method, use findByPk then save
// Mongoose:
await Employee.findOneAndUpdate({ name: 'Deep' }, { salary: 60000 }, { new: true });

// DELETE
// Sequelize:
await Employee.destroy({ where: { name: 'Deep' } });
// Mongoose:
await Employee.deleteOne({ name: 'Deep' });

// JOIN / POPULATE
// Sequelize:
await Employee.findAll({ include: { model: Department } });
// Mongoose:
await Employee.find().populate('department_id');

// PAGINATION
// Sequelize:
await Employee.findAndCountAll({ offset: 10, limit: 5 });
// Mongoose:
const count = await Employee.countDocuments();
const data = await Employee.find().skip(10).limit(5);
```

Note:
- Key Point: Syntax is very similar — both ORMs abstract database operations into JavaScript methods. Main differences: Sequelize uses { where: {} } wrapper, Mongoose passes filter directly. Sequelize uses Op operators, Mongoose uses $ operators. Sequelize has findAndCountAll, Mongoose requires separate count + find.
- Why Interviewer Asks: If you claim to know both MySQL and MongoDB, they test if you can switch between ORMs. Having this mapping shows you can work with either.

---

## Topic 8 : MongoDB Advanced

---

**36. What is Sharding in MongoDB?**

Answer:
Sharding is MongoDB's way of distributing data across multiple servers (horizontal scaling). When data becomes too large for one server, sharding splits it across multiple machines called shards.

```
Without Sharding:
One Server → All data (gets slow as data grows)

With Sharding:
Shard 1 → Users A-H
Shard 2 → Users I-P
Shard 3 → Users Q-Z
(Data distributed, each shard handles less data = faster)

Components:
1. Shard Servers  — store actual data (each is a replica set)
2. Config Servers — store metadata and routing info
3. mongos (Router)— routes queries to correct shard
```

Note:
- Key Point: Sharding enables horizontal scaling — add more servers instead of upgrading one. Data is distributed based on a shard key (chosen field). Good shard key has high cardinality and even distribution. MySQL scaling is vertical (bigger server), MongoDB scaling is horizontal (more servers).
- Why Interviewer Asks: Scalability question. Shows you understand how MongoDB handles large-scale data. Mention "horizontal scaling" as the key advantage.

---

**37. What is a Replica Set in MongoDB?**

Answer:
A Replica Set is a group of MongoDB servers that maintain the same data. It provides high availability and automatic failover.

```
Replica Set:
┌─────────────┐
│   Primary    │ ← All writes go here
│   (Master)   │
└──────┬───────┘
       │ Replicates data to:
  ┌────┴────┐
  ▼         ▼
┌──────┐  ┌──────┐
│Sec 1 │  │Sec 2 │  ← Read replicas, can become primary if primary fails
└──────┘  └──────┘

- Primary: handles all write operations
- Secondary: replicas of primary, handle read operations
- If Primary goes down → automatic election → one Secondary becomes new Primary
- Minimum 3 members recommended (1 Primary + 2 Secondary)
```

Note:
- Key Point: Replica sets provide data redundancy and automatic failover. Writes always go to primary. Reads can be distributed to secondaries (read preference). MongoDB Atlas automatically configures replica sets.
- Why Interviewer Asks: Availability and fault tolerance question. In production MongoDB ALWAYS runs as replica set. Shows you understand production deployment.

---

**38. What is the difference between `find()` and `aggregate()` in MongoDB?**

Answer:

| Feature | find() | aggregate() |
|---------|--------|-------------|
| Purpose | Simple queries (filter + project) | Complex data processing |
| Grouping | Cannot group | $group stage |
| Joining | Cannot join | $lookup stage |
| Computed fields | Cannot compute | $project with expressions |
| Pipeline | No | Yes (multi-stage processing) |
| Performance | Faster for simple queries | More powerful but heavier |
| Array operations | Limited | $unwind, $filter, $map |

```javascript
// find() — simple query
const result = await Employee.find({ dept: 'MERN' })
    .select('name salary')
    .sort({ salary: -1 })
    .limit(10);

// aggregate() — same result but with pipeline
const result = await Employee.aggregate([
    { $match: { dept: 'MERN' } },
    { $project: { name: 1, salary: 1 } },
    { $sort: { salary: -1 } },
    { $limit: 10 }
]);

// aggregate() — things find() CANNOT do
const stats = await Employee.aggregate([
    { $group: {
        _id: '$dept',
        avgSalary: { $avg: '$salary' },
        count: { $sum: 1 }
    }},
    { $lookup: {
        from: 'departments', localField: '_id',
        foreignField: 'name', as: 'deptInfo'
    }}
]);
```

Note:
- Key Point: Use find() for simple CRUD operations. Use aggregate() when you need grouping, joining, computed fields, or complex transformations. find() returns Mongoose documents (with methods), aggregate() returns plain objects. In Mongoose populate() is find()-based, $lookup is aggregate()-based.
- Why Interviewer Asks: Practical question about when to use which. Shows you choose the right tool for the job.

---

## Topic 9 : Security & Best Practices

---

**39. What is SQL Injection? How do you prevent it?**

Answer:
SQL Injection is a security attack where malicious SQL code is inserted through user input to manipulate the database.

```javascript
// VULNERABLE — string concatenation
const query = `SELECT * FROM users WHERE email = '${userInput}' AND password = '${passInput}'`;
// If userInput = "admin@test.com' OR '1'='1"
// Query becomes: SELECT * FROM users WHERE email = 'admin@test.com' OR '1'='1' AND password = ''
// This bypasses authentication!

// SAFE — Parameterized queries (prepared statements)
// MySQL native:
connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

// Sequelize (automatically parameterized):
await User.findOne({ where: { email: userInput, password: passInput } });

// Sequelize raw query with bind:
await sequelize.query('SELECT * FROM users WHERE email = $email', {
    bind: { email: userInput },
    type: QueryTypes.SELECT
});
```

Note:
- Key Point: Never concatenate user input into SQL strings. Always use parameterized queries (prepared statements). ORMs like Sequelize automatically parameterize queries. Use bind parameters for raw queries. Validate and sanitize user input on top of parameterization.
- Why Interviewer Asks: Critical security question. Shows you write secure code. SQL injection is one of the most common web vulnerabilities.

---

**40. What is NoSQL Injection? How do you prevent it in MongoDB?**

Answer:
NoSQL Injection is similar to SQL injection but for MongoDB. Attackers send malicious operators through user input to manipulate queries.

```javascript
// VULNERABLE — passing user input directly
app.post('/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password
    });
});

// Attack: POST body
// { "email": "admin@test.com", "password": { "$ne": "" } }
// Query becomes: find({ email: "admin@test.com", password: { $ne: "" } })
// This matches any non-empty password — bypasses authentication!

// PREVENTION:

// 1. Input validation — ensure types are correct
const email = String(req.body.email);       // force string
const password = String(req.body.password); // force string

// 2. Use express-mongo-sanitize middleware
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());
// Strips $ and . from user input

// 3. Schema validation — Mongoose validates types
const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});
// Mongoose rejects non-string values

// 4. Sanitize manually
function sanitize(input) {
    if (typeof input === 'object') {
        for (let key in input) {
            if (key.startsWith('$')) delete input[key];
        }
    }
    return input;
}
```

Note:
- Key Point: MongoDB operators ($ne, $gt, $or) can be injected through JSON body. Use express-mongo-sanitize middleware to strip $ operators from input. Always validate input types. Mongoose schema validation adds another layer of protection.
- Why Interviewer Asks: Security awareness for MongoDB. Most candidates only know SQL injection, not NoSQL injection. This shows you think about security for both databases.

---

## Topic 10 : Practical Scenario Questions

---

**41. How do you implement Pagination in MySQL, MongoDB, Sequelize, and Mongoose?**

Answer:

```javascript
// ===== MySQL =====
// Page 3, 10 items per page
SELECT * FROM employees 
ORDER BY id 
LIMIT 10 OFFSET 20;  // skip 20, get 10 (page 3)
// Formula: OFFSET = (page - 1) * pageSize

// ===== Sequelize =====
const page = 3;
const pageSize = 10;
const { count, rows } = await Employee.findAndCountAll({
    offset: (page - 1) * pageSize,
    limit: pageSize,
    order: [['id', 'ASC']]
});
const totalPages = Math.ceil(count / pageSize);
// Returns: { count: 50, rows: [...10 items...] }

// ===== MongoDB =====
db.employees.find()
    .sort({ _id: 1 })
    .skip(20)
    .limit(10);

// ===== Mongoose =====
const page = 3;
const pageSize = 10;
const total = await Employee.countDocuments();
const employees = await Employee.find()
    .sort({ _id: 1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize);
const totalPages = Math.ceil(total / pageSize);

// Response format:
res.json({
    data: employees,
    pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalItems: total,
        totalPages: totalPages
    }
});
```

Note:
- Key Point: Formula is universal: skip = (page - 1) * pageSize. Sequelize has findAndCountAll which gives count + data in one call. Mongoose requires separate countDocuments + find. Always send pagination metadata (total, pages) in API response. For very large datasets cursor-based pagination is better than skip/limit.
- Why Interviewer Asks: Every real application needs pagination. They want to see you implement it properly with total count and page metadata.

---

**42. How do you handle Soft Delete?**

Answer:

```javascript
// ===== MySQL =====
-- Add column
ALTER TABLE employees ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;

-- Soft delete
UPDATE employees SET deleted_at = NOW() WHERE id = 1;

-- Select only active records
SELECT * FROM employees WHERE deleted_at IS NULL;

-- Restore
UPDATE employees SET deleted_at = NULL WHERE id = 1;


// ===== Sequelize (paranoid mode) =====
const Employee = sequelize.define('Employee', { /*...*/ }, {
    timestamps: true,
    paranoid: true      // enables soft delete
});

// Soft delete (sets deletedAt)
await emp.destroy();

// Hard delete (actually removes from DB)
await emp.destroy({ force: true });

// Find only active (default behavior with paranoid)
await Employee.findAll();  // automatically excludes soft-deleted

// Find including soft-deleted
await Employee.findAll({ paranoid: false });

// Restore soft-deleted record
await emp.restore();


// ===== Mongoose (manual pattern) =====
const employeeSchema = new Schema({
    /* fields */
    deletedAt: { type: Date, default: null }
});

// Auto-filter active records in all find queries
employeeSchema.pre(/^find/, function(next) {
    this.where({ deletedAt: null });
    next();
});

// Soft delete method
employeeSchema.methods.softDelete = function() {
    this.deletedAt = new Date();
    return this.save();
};

// Restore method
employeeSchema.methods.restore = function() {
    this.deletedAt = null;
    return this.save();
};

// Usage:
await emp.softDelete();    // soft delete
await emp.restore();       // restore
```

Note:
- Key Point: Soft delete sets a timestamp instead of actually removing the record. All queries must filter by deletedAt IS NULL. Sequelize paranoid mode handles this automatically. Mongoose needs manual implementation with middleware. Soft delete is important for audit trails and data recovery.
- Why Interviewer Asks: Production-level pattern. Shows you think about data safety and recovery. Many applications require soft delete for compliance.

---

**43. What is Connection Pooling?**

Answer:
Connection Pooling maintains a cache of database connections that can be reused. Instead of creating a new connection for every query (expensive), connections are borrowed from the pool, used, and returned.

```javascript
// Sequelize connection pool
const sequelize = new Sequelize('db', 'user', 'pass', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 10,           // max connections in pool
        min: 2,            // min connections to keep open
        acquire: 30000,    // max wait time to get connection (ms)
        idle: 10000        // close connection after idle time (ms)
    }
});

// Mongoose connection pool
mongoose.connect('mongodb://localhost:27017/mydb', {
    maxPoolSize: 10,       // max connections (default: 100)
    minPoolSize: 2,        // min connections
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
});
```

```
Without Pool:
Request 1 → Open connection → Query → Close connection
Request 2 → Open connection → Query → Close connection
(Slow — creating connections is expensive)

With Pool:
Pool has 10 pre-created connections
Request 1 → Borrow connection → Query → Return to pool
Request 2 → Borrow connection → Query → Return to pool
(Fast — connections reused)
```

Note:
- Key Point: Connection creation is expensive (TCP handshake, authentication). Pool maintains reusable connections. Set max pool size based on expected concurrent queries. Too many connections waste memory, too few cause queuing. Default pool size is usually sufficient for small-medium applications.
- Why Interviewer Asks: Performance and scalability question. Shows you understand database connection management in production.

---

## Topic 11 : More MySQL Questions

---

**44. What is a View in MySQL?**

Answer:
A View is a virtual table based on a SQL query. It does not store data itself — it is a saved query that you can use like a table.

```sql
-- Create view
CREATE VIEW active_employees AS
SELECT e.name, e.salary, d.name AS department
FROM employees e
JOIN departments d ON e.department_id = d.id
WHERE e.is_active = 1;

-- Use view like a table
SELECT * FROM active_employees WHERE salary > 50000;

-- Drop view
DROP VIEW active_employees;
```

Note:
- Key Point: Views simplify complex queries, provide security (hide sensitive columns), and provide consistent interface. They do not store data. Some views are updatable (can INSERT/UPDATE through them), some are read-only (with JOINs, GROUP BY, aggregates).
- Why Interviewer Asks: Tests knowledge of database objects beyond basic tables. Views are commonly used in enterprise applications.

---

**45. What is a Stored Procedure?**

Answer:
A Stored Procedure is a set of SQL statements saved in the database that can be called by name. Like a function in programming.

```sql
-- Create stored procedure
DELIMITER //
CREATE PROCEDURE GetEmployeesByDept(IN dept_name VARCHAR(50))
BEGIN
    SELECT name, salary
    FROM employees
    WHERE department = dept_name
    ORDER BY salary DESC;
END //
DELIMITER ;

-- Call stored procedure
CALL GetEmployeesByDept('MERN');

-- Procedure with output parameter
DELIMITER //
CREATE PROCEDURE GetDeptStats(
    IN dept_name VARCHAR(50),
    OUT total_emp INT,
    OUT avg_sal DECIMAL(10,2)
)
BEGIN
    SELECT COUNT(*), AVG(salary)
    INTO total_emp, avg_sal
    FROM employees
    WHERE department = dept_name;
END //
DELIMITER ;

CALL GetDeptStats('MERN', @total, @avg);
SELECT @total, @avg;

-- Drop procedure
DROP PROCEDURE GetEmployeesByDept;
```

Note:
- Key Point: Stored procedures reduce network traffic (query is on server). They provide security (users can call procedure without knowing table structure). IN = input, OUT = output, INOUT = both. In MERN stack, stored procedures are less common because ORMs handle most logic.
- Why Interviewer Asks: Tests database programming knowledge. Not commonly used in MERN but important for MySQL interviews.

---

**46. What is the difference between CHAR and VARCHAR?**

Answer:

| Feature | CHAR(n) | VARCHAR(n) |
|---------|---------|------------|
| Storage | Fixed length | Variable length |
| Padding | Pads with spaces to n | No padding |
| Max size | 255 characters | 65,535 characters |
| Speed | Faster (fixed size) | Slightly slower |
| Storage space | Always uses n bytes | Uses actual length + 1-2 bytes |

```sql
-- CHAR(10) for "Deep":
-- Stored as: "Deep      " (padded with 6 spaces, uses 10 bytes)

-- VARCHAR(10) for "Deep":
-- Stored as: "Deep" (no padding, uses 4 + 1 = 5 bytes)

-- Use CHAR for: fixed-length data (country codes, gender M/F, PIN codes)
-- Use VARCHAR for: variable-length data (names, emails, addresses)
```

Note:
- Key Point: CHAR is faster for fixed-length data because MySQL knows exact position. VARCHAR saves space for variable-length data. In practice VARCHAR is used 95% of the time. CHAR is only worth it for truly fixed-length columns.
- Why Interviewer Asks: Basic but frequently asked. The padding behavior and when to use which is the key answer.

---

## Topic 12 : More Mongoose/MongoDB Questions

---

**47. What are Virtual Fields in Mongoose?**

Answer:
Virtuals are fields that are computed on-the-fly and NOT stored in the database. They are derived from existing fields.

```javascript
const employeeSchema = new Schema({
    firstName: String,
    lastName: String,
    salary: Number,
    startYear: Number
});

// Virtual getter
employeeSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Virtual with calculation
employeeSchema.virtual('experience').get(function() {
    return new Date().getFullYear() - this.startYear;
});

// Virtual setter
employeeSchema.virtual('fullName').set(function(name) {
    const [first, last] = name.split(' ');
    this.firstName = first;
    this.lastName = last;
});

// Include virtuals in JSON output
employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

// Usage
const emp = new Employee({ firstName: 'Deep', lastName: 'Patel', startYear: 2020 });
console.log(emp.fullName);     // "Deep Patel" (not stored in DB)
console.log(emp.experience);   // 5 (computed)

emp.fullName = 'Neel Shah';    // setter splits and assigns
console.log(emp.firstName);    // "Neel"
```

Note:
- Key Point: Virtuals are NOT stored in database — computed every time you access them. Must enable toJSON/toObject virtuals to include them in API responses. Cannot use virtuals in queries (since they do not exist in DB). Use for computed fields like fullName, age, experience.
- Why Interviewer Asks: Shows advanced Mongoose knowledge. Practical for API responses where you need computed fields without storing redundant data.

---

**48. How do you handle Validation Errors in Mongoose?**

Answer:

```javascript
const employeeSchema = new Schema({
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, required: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    age: { type: Number, min: [18, 'Must be 18+'], max: [65, 'Must be under 65'] },
    department: { type: String, enum: ['MERN', 'DS', 'DevOps'] }
});

// Handling validation errors
try {
    await Employee.create({
        name: '',
        email: 'invalid',
        age: 15,
        department: 'Unknown'
    });
} catch (error) {
    if (error.name === 'ValidationError') {
        const errors = {};
        for (let field in error.errors) {
            errors[field] = error.errors[field].message;
        }
        console.log(errors);
        // {
        //   name: "Name is required",
        //   email: "Invalid email",
        //   age: "Must be 18+",
        //   department: "Unknown is not a valid enum value"
        // }
        
        // Send to client
        return res.status(400).json({ errors });
    }
    
    if (error.code === 11000) {
        // Duplicate key error (unique constraint)
        return res.status(409).json({
            error: `${Object.keys(error.keyValue)} already exists`
        });
    }
    
    if (error.name === 'CastError') {
        // Invalid ObjectId
        return res.status(400).json({ error: 'Invalid ID format' });
    }
}
```

Note:
- Key Point: ValidationError has errors object with field-level messages. error.code === 11000 is duplicate key (unique constraint violation). CastError is invalid ObjectId. Always return proper HTTP status codes (400 for validation, 409 for duplicate). Validation runs on create and save, NOT on update by default — use { runValidators: true }.
- Why Interviewer Asks: Error handling is critical for API development. Proper error responses with correct status codes show production-ready code quality.

---

**49. What is the difference between `save()` and `create()` in Mongoose?**

Answer:

```javascript
// create() — build + save in one step (returns the saved document)
const emp = await Employee.create({ name: 'Deep', age: 23 });
// Runs validation and saves to DB immediately

// save() — requires building instance first (two steps)
const emp = new Employee({ name: 'Deep', age: 23 });
// Can modify before saving
emp.skills.push('JavaScript');
emp.salary = 50000;
await emp.save();  // NOW saves to DB

// Key differences:
// 1. create() is a Model method, save() is an instance method
// 2. create() cannot modify before saving
// 3. save() triggers pre('save') middleware, create() also triggers it
// 4. save() on existing document = UPDATE, create() = always INSERT
// 5. create() can accept array for bulk insert

// Update using save()
const emp = await Employee.findById(id);
emp.salary = 70000;
await emp.save();  // updates existing document (runs validators + middleware)

// Bulk create
await Employee.create([
    { name: 'A' },
    { name: 'B' },
    { name: 'C' }
]);
```

Note:
- Key Point: Use create() for simple inserts. Use new + save() when you need to modify before saving or want more control. save() on an existing document does UPDATE. Both trigger pre('save') middleware. save() is also how you update a document after modifying it.
- Why Interviewer Asks: Practical distinction that shows you understand Mongoose document lifecycle. The "save on existing = update" point is important.

---

**50. What is `lean()` in Mongoose? When should you use it?**

Answer:
By default Mongoose find queries return full Mongoose documents with all methods, virtuals, and change tracking. `lean()` returns plain JavaScript objects instead — much lighter and faster.

```javascript
// Without lean — full Mongoose document
const doc = await Employee.findOne({ name: 'Deep' });
console.log(doc instanceof mongoose.Document);  // true
doc.save();        // works — it is a Mongoose document
doc.fullName;      // works — virtuals available
// Slower — has change tracking, validation, methods overhead

// With lean — plain JavaScript object
const obj = await Employee.findOne({ name: 'Deep' }).lean();
console.log(obj instanceof mongoose.Document);  // false
// obj.save();     // ERROR — not a Mongoose document
// obj.fullName;   // undefined — no virtuals
// Faster — 5-10x for large queries

// When to use lean():
// ✅ Read-only data (API responses, reports)
// ✅ When you don't need to save/update the returned data
// ✅ When you need maximum read performance
// ❌ When you need to modify and save the document
// ❌ When you need virtuals, methods, or middleware
```

Note:
- Key Point: lean() gives 5-10x performance improvement for read-only queries. Returns plain objects — no save(), no virtuals, no methods. Use for API GET endpoints where you just return data. Do not use when you need to modify and save documents.
- Why Interviewer Asks: Performance optimization question. Shows you think about efficiency. Most MERN developers do not use lean() — knowing it is a bonus.

---

## Topic 13 : Extra Important Questions

---

**51. What is the difference between findOneAndUpdate vs updateOne in Mongoose?**

Answer:

| Feature | `updateOne()` | `findOneAndUpdate()` |
|---------|--------------|---------------------|
| Returns | `{ modifiedCount: 1 }` | The actual document |
| Pre/Post hooks | updateOne hooks | findOneAndUpdate hooks |
| Return old or new | N/A | `{ new: true }` returns updated |
| Use when | Just want to update, don't need the document | Need the updated document back |

```javascript
// updateOne — does not return document
const result = await Employee.updateOne(
    { name: 'Deep' },
    { $set: { salary: 70000 } }
);
console.log(result);  // { modifiedCount: 1, matchedCount: 1 }

// findOneAndUpdate — returns the document
const doc = await Employee.findOneAndUpdate(
    { name: 'Deep' },
    { $set: { salary: 70000 } },
    { new: true, runValidators: true }
);
console.log(doc);  // { name: 'Deep', salary: 70000, ... }
```

Note:
- Key Point: Use updateOne when you just want to update and do not need the result. Use findOneAndUpdate when you need the updated document (e.g., to return it in API response). { new: true } is crucial — without it you get the OLD document before update.
- Why Interviewer Asks: Practical Mongoose question. Knowing when to use which and the { new: true } option shows experience.

---

**52. Explain the $lookup stage in MongoDB Aggregation.**

Answer:
$lookup performs a LEFT OUTER JOIN with another collection. It adds an array field from the "joined" collection to each document.

```javascript
// employees: { name, department_id }
// departments: { _id, name, location }

// Basic $lookup
db.employees.aggregate([
    {
        $lookup: {
            from: "departments",         // collection to join WITH
            localField: "department_id",  // field in employees
            foreignField: "_id",         // matching field in departments
            as: "department_info"        // output field name (array)
        }
    }
]);
// Result:
// {
//   name: "Deep",
//   department_id: ObjectId("..."),
//   department_info: [{ _id: ..., name: "MERN", location: "Building A" }]
// }

// $unwind to convert array to object
db.employees.aggregate([
    { $lookup: {
        from: "departments",
        localField: "department_id",
        foreignField: "_id",
        as: "dept"
    }},
    { $unwind: "$dept" },     // array → single object
    { $project: {
        name: 1,
        salary: 1,
        department: "$dept.name",    // access joined field
        location: "$dept.location"
    }}
]);
```

Note:
- Key Point: $lookup always outputs an array (even for one match). Use $unwind after $lookup to flatten. "from" must be the actual collection name (lowercase, plural — not model name). localField = your collection's field, foreignField = other collection's field. This is like LEFT JOIN — if no match the array is empty [].
- Why Interviewer Asks: Core aggregation question. $lookup is how you do JOINs in MongoDB. Knowing to use $unwind after $lookup shows practical experience.

---

**53. What is the ObjectId in MongoDB? What information does it contain?**

Answer:
ObjectId is a 12-byte unique identifier automatically generated for every document's _id field. It is represented as a 24-character hexadecimal string.

```
ObjectId("507f1f77bcf86cd799439011")

Structure (12 bytes = 24 hex chars):
┌──────────────┬──────────────┬──────────────┐
│  4 bytes     │  5 bytes     │  3 bytes     │
│  Timestamp   │  Random      │  Counter     │
│  (seconds)   │  (machine +  │  (increments │
│              │   process)   │   per second)│
└──────────────┴──────────────┴──────────────┘
```

```javascript
const { ObjectId } = require('mongoose').Types;

// Create new ObjectId
const id = new ObjectId();

// Get timestamp from ObjectId
const timestamp = id.getTimestamp();
console.log(timestamp);  // 2025-01-15T10:30:00.000Z

// Validate ObjectId string
ObjectId.isValid('507f1f77bcf86cd799439011');  // true
ObjectId.isValid('invalid-id');                  // false

// Compare ObjectIds
id1.equals(id2);  // correct way
// id1 === id2     // WRONG — compares references, not values
```

Note:
- Key Point: ObjectId contains timestamp so you can extract creation time. It is globally unique without coordination between servers (important for distributed systems). Always use .equals() to compare ObjectIds, not ===. Validate ObjectId format before using in queries to prevent CastError.
- Why Interviewer Asks: Shows understanding of MongoDB internals. The timestamp extraction and proper comparison methods are practical knowledge.

---

**54. How do you handle Transactions in MongoDB/Mongoose?**

Answer:

```javascript
// MongoDB supports multi-document ACID transactions (from v4.0)
// Required for operations that must ALL succeed or ALL fail

// Mongoose transaction example: Transfer money
const session = await mongoose.startSession();
session.startTransaction();

try {
    // Both operations must succeed
    await Account.updateOne(
        { name: 'Deep' },
        { $inc: { balance: -1000 } },
        { session }    // pass session to each operation
    );
    
    await Account.updateOne(
        { name: 'Neel' },
        { $inc: { balance: 1000 } },
        { session }
    );
    
    // If both succeed — commit
    await session.commitTransaction();
    console.log('Transfer successful');
    
} catch (error) {
    // If any fails — rollback everything
    await session.abortTransaction();
    console.log('Transfer failed, rolled back');
    
} finally {
    session.endSession();
}
```

Note:
- Key Point: Transactions require replica set (even for single server — use replica set of 1 for development). Pass session to every operation in the transaction. If any operation fails abortTransaction undoes all changes. MongoDB transactions have more overhead than single document operations — use only when necessary.
- Why Interviewer Asks: Shows you can handle data integrity scenarios. Bank transfer is the classic example. Mentioning replica set requirement shows deep knowledge.

---

**55. What is the difference between `$push`, `$addToSet`, `$pull`, and `$pop` in MongoDB?**

Answer:

```javascript
// Starting document: { name: "Deep", skills: ["JS", "React"] }

// $push — add element to end of array (allows duplicates)
db.employees.updateOne({ name: "Deep" }, { $push: { skills: "Node" } });
// skills: ["JS", "React", "Node"]

db.employees.updateOne({ name: "Deep" }, { $push: { skills: "JS" } });
// skills: ["JS", "React", "Node", "JS"]  ← duplicate added!

// $addToSet — add ONLY if not already exists (no duplicates)
db.employees.updateOne({ name: "Deep" }, { $addToSet: { skills: "React" } });
// skills unchanged — "React" already exists

db.employees.updateOne({ name: "Deep" }, { $addToSet: { skills: "Python" } });
// skills: ["JS", "React", "Node", "Python"]  ← added because not exists

// $pull — remove specific value from array
db.employees.updateOne({ name: "Deep" }, { $pull: { skills: "Node" } });
// skills: ["JS", "React", "Python"]

// $pop — remove first (-1) or last (1) element
db.employees.updateOne({ name: "Deep" }, { $pop: { skills: 1 } });
// skills: ["JS", "React"]  ← last element removed

db.employees.updateOne({ name: "Deep" }, { $pop: { skills: -1 } });
// skills: ["React"]  ← first element removed

// $push with $each — add multiple elements
db.employees.updateOne({ name: "Deep" }, {
    $push: { skills: { $each: ["Vue", "Angular", "Svelte"] } }
});
```

Note:
- Key Point: $push = add (allows duplicates). $addToSet = add only if unique. $pull = remove by value. $pop = remove by position (first/last). Use $each with $push/$addToSet for adding multiple elements. These are the most common array update operators.
- Why Interviewer Asks: Array operations are very common in MongoDB since documents can contain arrays. $push vs $addToSet duplicate behavior is the key distinction.

---

## Quick Revision — All Topics Summary

| # | Topic | Key Points to Remember |
|---|-------|----------------------|
| 1 | SQL Commands | DDL (CREATE/ALTER/DROP), DML (INSERT/UPDATE/DELETE), DQL (SELECT), TCL (COMMIT/ROLLBACK) |
| 2 | DELETE vs TRUNCATE vs DROP | DELETE = row by row, rollback possible. TRUNCATE = all rows, resets auto-inc. DROP = removes table |
| 3 | Constraints | PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, DEFAULT |
| 4 | JOINs | INNER = only matches, LEFT = all left, RIGHT = all right, CROSS = cartesian |
| 5 | WHERE vs HAVING | WHERE = before GROUP BY (rows). HAVING = after GROUP BY (groups, with aggregates) |
| 6 | Subqueries | Scalar (one value), Table (multiple rows), Correlated (references outer query) |
| 7 | Indexes | Speed up reads, slow down writes. Use EXPLAIN to verify. Don't over-index |
| 8 | Transactions / ACID | Atomicity, Consistency, Isolation, Durability. COMMIT, ROLLBACK, SAVEPOINT |
| 9 | Normalization | 1NF = atomic values, 2NF = no partial dependency, 3NF = no transitive dependency |
| 10 | Sequelize Setup | sequelize.define(), sync(), authenticate(). paranoid = soft delete |
| 11 | Sequelize CRUD | create, findAll, findOne, findByPk, update, destroy, findAndCountAll |
| 12 | Sequelize Associations | hasOne, belongsTo, hasMany, belongsToMany. include for eager loading |
| 13 | SQL vs NoSQL | SQL = structured, ACID, JOINs. NoSQL = flexible, scalable, embedded docs |
| 14 | MongoDB CRUD | insertOne/Many, find/findOne, updateOne/Many, deleteOne/Many |
| 15 | MongoDB Operators | $eq, $gt, $lt, $in, $and, $or, $regex, $exists, $elemMatch |
| 16 | Aggregation Pipeline | $match, $group, $sort, $project, $lookup, $unwind, $limit, $skip |
| 17 | MongoDB Indexes | Single, Compound, Unique, Text, TTL. Use explain() to check |
| 18 | Embedded vs Referenced | Embedded = fast reads, 16MB limit. Referenced = no duplication, needs $lookup |
| 19 | Mongoose Schema | Types, required, unique, enum, validate, ref, timestamps |
| 20 | Mongoose CRUD | create, find, findOne, findById, findOneAndUpdate, deleteOne, populate |
| 21 | Mongoose populate | Replaces ObjectId with actual document. ref in schema required |
| 22 | Mongoose Middleware | pre/post hooks: save, find, update, delete. Password hashing, cascade delete |
| 23 | SQL Injection | Use parameterized queries, never concatenate user input |
| 24 | NoSQL Injection | Use express-mongo-sanitize, validate input types |
| 25 | Pagination | skip((page-1)*size).limit(size). Return total count + data |

---
