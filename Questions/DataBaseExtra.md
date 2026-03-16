## Topic 1 : MySQL Deep Dive

---

**56. What are Storage Engines in MySQL? Explain the differences.**

Answer:
Storage Engine determines how MySQL stores, retrieves, and manages data internally. Different engines have different features and trade-offs.

```
| Engine   | Transactions | Locking      | Foreign Keys | Speed  | Use Case                    |
|----------|:---:|-------------|:---:|--------|-------------------------------|
| InnoDB   | Yes (ACID)   | Row-level    | Yes          | Good   | Default, most applications   |
| MyISAM   | No           | Table-level  | No           | Fast reads | Read-heavy, full-text search|
| MEMORY   | No           | Table-level  | No           | Fastest| Temp data, caching, sessions |
| CSV      | No           | Table-level  | No           | Slow   | Data import/export           |
| MERGE    | No           | Table-level  | No           | —      | Merge identical MyISAM tables|
```

```sql
-- Check current engine
SHOW TABLE STATUS WHERE Name = 'employees';

-- Create table with specific engine
CREATE TABLE logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    message TEXT
) ENGINE = MyISAM;

-- Change engine of existing table
ALTER TABLE logs ENGINE = InnoDB;

-- Show available engines
SHOW ENGINES;
```

Note:
- Key Point: InnoDB is default since MySQL 5.5. Always use InnoDB unless you have a specific reason not to. InnoDB supports transactions (ACID), row-level locking (better concurrency), and foreign keys. MyISAM is faster for read-only workloads but no transactions. MEMORY stores everything in RAM — data lost on restart.
- Why Interviewer Asks: Shows deep MySQL knowledge. They want to hear "InnoDB is default, supports ACID and row-level locking" and know when other engines might be useful.

---

**57. What is the difference between Row-Level Locking and Table-Level Locking?**

Answer:

**Row-Level Locking (InnoDB)**
- Locks only the specific row being modified
- Other rows in the same table can be read/written simultaneously
- Better for concurrent access (multiple users)
- More memory overhead per lock

**Table-Level Locking (MyISAM)**
- Locks the entire table when any row is being modified
- No other user can read or write ANY row during lock
- Simple but poor for concurrent access
- Less memory overhead

```sql
-- InnoDB: Row-level lock example
-- Transaction 1: locks only row id=1
START TRANSACTION;
UPDATE employees SET salary = 60000 WHERE id = 1;
-- Other users can still UPDATE employees WHERE id = 2 (different row)
COMMIT;

-- MyISAM: Table-level lock
-- When updating ANY row, entire table is locked
-- All other queries on that table must wait
```

```
Scenario: 100 users updating different rows simultaneously

InnoDB (Row Lock):
User 1 → locks row 1 → other 99 users work fine on other rows ✅
High concurrency

MyISAM (Table Lock):
User 1 → locks ENTIRE table → other 99 users WAIT ❌
Low concurrency
```

Note:
- Key Point: Row-level locking = better concurrency, used by InnoDB. Table-level locking = simpler but blocks entire table, used by MyISAM. For web applications with many concurrent users, row-level locking (InnoDB) is essential. Deadlocks can occur with row-level locking when two transactions lock rows in opposite order.
- Why Interviewer Asks: Concurrency and performance question. Understanding locking explains why InnoDB is preferred for web applications.

---

**58. What are Window Functions in MySQL?**

Answer:
Window Functions perform calculations across a set of rows related to the current row without collapsing them into groups (unlike GROUP BY which reduces rows).

```sql
-- ROW_NUMBER() — assigns unique sequential number to each row
SELECT 
    name, department, salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num
FROM employees;
-- Every row gets a unique number: 1, 2, 3, 4, 5...

-- RANK() — assigns rank with gaps for ties
SELECT 
    name, salary,
    RANK() OVER (ORDER BY salary DESC) AS rank_num
FROM employees;
-- If two people have same salary: 1, 2, 2, 4 (skips 3)

-- DENSE_RANK() — assigns rank WITHOUT gaps
SELECT 
    name, salary,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank_num
FROM employees;
-- If two people have same salary: 1, 2, 2, 3 (no skip)

-- PARTITION BY — window function per group
SELECT 
    name, department, salary,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank
FROM employees;
-- Ranks within each department separately

-- LAG / LEAD — access previous/next row value
SELECT 
    name, salary,
    LAG(salary, 1) OVER (ORDER BY salary) AS prev_salary,
    LEAD(salary, 1) OVER (ORDER BY salary) AS next_salary,
    salary - LAG(salary, 1) OVER (ORDER BY salary) AS salary_diff
FROM employees;

-- SUM / AVG / COUNT as window function
SELECT 
    name, department, salary,
    SUM(salary) OVER (PARTITION BY department) AS dept_total,
    AVG(salary) OVER (PARTITION BY department) AS dept_avg,
    COUNT(*) OVER (PARTITION BY department) AS dept_count
FROM employees;
-- Each row shows its department's total/avg/count WITHOUT collapsing rows

-- Running total (cumulative sum)
SELECT 
    name, salary,
    SUM(salary) OVER (ORDER BY id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM employees;

-- NTILE — divide rows into N equal groups
SELECT 
    name, salary,
    NTILE(4) OVER (ORDER BY salary DESC) AS quartile
FROM employees;
-- Divides into 4 groups: top 25%, next 25%, etc.
```

Note:
- Key Point: Window functions do NOT reduce rows (unlike GROUP BY). OVER() defines the window. PARTITION BY = GROUP BY within window. ROW_NUMBER gives unique numbers, RANK has gaps on ties, DENSE_RANK has no gaps. LAG/LEAD access previous/next rows. Very powerful for analytics queries.
- Why Interviewer Asks: Advanced SQL question. Finding Nth highest salary per department, running totals, and ranking are very common interview questions that need window functions.

---

**59. What is a Deadlock in MySQL? How do you handle it?**

Answer:
A Deadlock occurs when two or more transactions wait for each other to release locks, creating a circular dependency. Neither can proceed — they are stuck forever.

```
Transaction 1:                    Transaction 2:
1. Lock Row A ✅                  1. Lock Row B ✅
2. Try to Lock Row B ⏳ WAIT      2. Try to Lock Row A ⏳ WAIT
   (T2 holds Row B)                  (T1 holds Row A)
   
Both waiting for each other → DEADLOCK!
```

```sql
-- MySQL automatically detects deadlocks and rolls back ONE transaction
-- The other transaction continues

-- Example that causes deadlock:
-- Transaction 1:
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- locks row 1
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- waits for row 2

-- Transaction 2 (simultaneously):
START TRANSACTION;
UPDATE accounts SET balance = balance - 50 WHERE id = 2;   -- locks row 2
UPDATE accounts SET balance = balance + 50 WHERE id = 1;   -- waits for row 1
-- DEADLOCK!
```

**Prevention:**
```
1. Access tables/rows in consistent order (both transactions lock row 1 first, then row 2)
2. Keep transactions short (less time holding locks)
3. Use appropriate isolation levels
4. Add indexes (fewer rows locked)
5. Use SELECT ... FOR UPDATE carefully
```

```sql
-- Check for deadlocks
SHOW ENGINE INNODB STATUS;

-- Set lock wait timeout
SET innodb_lock_wait_timeout = 50;  -- seconds before timeout
```

Note:
- Key Point: Deadlock = circular lock dependency. MySQL auto-detects and kills one transaction. Prevention: access rows in same order across all transactions, keep transactions short, use proper indexes. InnoDB handles deadlocks better than MyISAM (row-level vs table-level).
- Why Interviewer Asks: Shows understanding of concurrent database access and transaction management. Practical for high-traffic applications.

---

**60. What is the difference between UNION and JOIN?**

Answer:

| Feature | JOIN | UNION |
|---------|------|-------|
| Purpose | Combine columns from different tables | Combine rows from different queries |
| Direction | Horizontal (adds columns) | Vertical (adds rows) |
| Requirement | Related by foreign key | Same number of columns, compatible types |
| Duplicates | Can have duplicates | UNION removes, UNION ALL keeps |

```sql
-- JOIN: combines COLUMNS (horizontal)
-- "Give me employee name WITH their department name"
SELECT e.name, d.name AS dept
FROM employees e
JOIN departments d ON e.dept_id = d.id;
-- Result: | name  | dept |
--         | Deep  | MERN |

-- UNION: combines ROWS (vertical)
-- "Give me all names from employees AND contractors"
SELECT name FROM employees
UNION
SELECT name FROM contractors;
-- Result: | name    |
--         | Deep    |
--         | Neel    |
--         | Vendor1 |
```

Note:
- Key Point: JOIN = horizontal combination (more columns). UNION = vertical combination (more rows). JOIN needs relationship (ON condition). UNION needs same column count and compatible types. They serve completely different purposes.
- Why Interviewer Asks: Common confusion for beginners. They want clear understanding of when to use which.

---

**61. What are Triggers in MySQL?**

Answer:
A Trigger is a stored program that automatically executes when a specific event (INSERT, UPDATE, DELETE) occurs on a table.

```sql
-- Create trigger: log salary changes
DELIMITER //
CREATE TRIGGER salary_audit
AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
    IF OLD.salary != NEW.salary THEN
        INSERT INTO salary_log (employee_id, old_salary, new_salary, changed_at)
        VALUES (OLD.id, OLD.salary, NEW.salary, NOW());
    END IF;
END //
DELIMITER ;

-- OLD = values before update, NEW = values after update

-- Trigger before insert: auto-set values
DELIMITER //
CREATE TRIGGER set_defaults
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
    IF NEW.status IS NULL THEN
        SET NEW.status = 'active';
    END IF;
    SET NEW.created_at = NOW();
END //
DELIMITER ;

-- View triggers
SHOW TRIGGERS;

-- Drop trigger
DROP TRIGGER salary_audit;
```

**Trigger Types:**
```
BEFORE INSERT — before new row is inserted
AFTER INSERT  — after new row is inserted
BEFORE UPDATE — before row is updated
AFTER UPDATE  — after row is updated
BEFORE DELETE — before row is deleted
AFTER DELETE  — after row is deleted
```

Note:
- Key Point: Triggers run automatically on specified events. BEFORE triggers can modify the incoming data (NEW). AFTER triggers cannot modify data but can log or cascade changes. OLD = data before change, NEW = data after change. Use triggers for audit logging, auto-calculations, and data validation.
- Why Interviewer Asks: Shows knowledge of database automation. Audit logging trigger is the most practical example.

---

**62. What is the difference between IN and EXISTS?**

Answer:

```sql
-- IN: checks if value matches ANY value in subquery result
-- Subquery executes ONCE, result is cached, then compared
SELECT * FROM employees
WHERE department_id IN (
    SELECT id FROM departments WHERE location = 'Mumbai'
);

-- EXISTS: checks if subquery returns ANY rows (boolean check)
-- Subquery executes FOR EACH ROW of outer query (correlated)
SELECT * FROM employees e
WHERE EXISTS (
    SELECT 1 FROM departments d 
    WHERE d.id = e.department_id AND d.location = 'Mumbai'
);
```

| Feature | IN | EXISTS |
|---------|-----|--------|
| Subquery execution | Once (cached) | Once per outer row |
| NULL handling | Fails with NULL in subquery | Handles NULL properly |
| Best for | Small subquery result set | Large outer table, indexed inner table |
| Returns | Matches against list of values | Boolean (true/false) |

```sql
-- IN fails with NULL:
SELECT * FROM employees WHERE dept_id IN (1, 2, NULL);
-- NULL comparison always returns UNKNOWN, may miss results

-- EXISTS handles NULL correctly:
SELECT * FROM employees e
WHERE EXISTS (SELECT 1 FROM departments d WHERE d.id = e.dept_id);
-- Works correctly even with NULL values
```

Note:
- Key Point: IN is simpler and better for small subquery results. EXISTS is better for large datasets when inner table is indexed (stops after first match). EXISTS handles NULL correctly, IN does not. In practice, modern MySQL optimizer often converts IN to EXISTS internally.
- Why Interviewer Asks: Performance optimization question. Shows you understand query execution and can choose the right approach.

---

**63. What are Common Table Expressions (CTE)?**

Answer:
CTE is a temporary named result set that you can reference within a SELECT, INSERT, UPDATE, or DELETE. Defined using WITH keyword. Makes complex queries more readable.

```sql
-- Basic CTE
WITH dept_stats AS (
    SELECT 
        department,
        COUNT(*) AS emp_count,
        AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department
)
SELECT * FROM dept_stats WHERE avg_salary > 50000;

-- Multiple CTEs
WITH 
    high_earners AS (
        SELECT * FROM employees WHERE salary > 70000
    ),
    mern_team AS (
        SELECT * FROM employees WHERE department = 'MERN'
    )
SELECT h.name, h.salary
FROM high_earners h
INNER JOIN mern_team m ON h.id = m.id;
-- High earners who are also in MERN team

-- Recursive CTE (for hierarchical data like org chart)
WITH RECURSIVE org_chart AS (
    -- Base case: top-level managers (no manager)
    SELECT id, name, manager_id, 1 AS level
    FROM employees
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Recursive case: employees under each manager
    SELECT e.id, e.name, e.manager_id, oc.level + 1
    FROM employees e
    INNER JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT * FROM org_chart ORDER BY level, name;
```

Note:
- Key Point: CTE makes complex queries readable by breaking them into named parts. CTEs exist only for the duration of the query. Recursive CTE is powerful for hierarchical data (org charts, category trees, file systems). CTE is an alternative to subqueries and temporary tables.
- Why Interviewer Asks: Advanced SQL feature. Recursive CTE for hierarchical data is a common interview question. Shows you can write clean, maintainable SQL.

---

**64. Write SQL queries for common interview problems.**

Answer:

```sql
-- 1. Find duplicate records
SELECT email, COUNT(*) AS count
FROM employees
GROUP BY email
HAVING count > 1;

-- 2. Delete duplicate records (keep one)
DELETE e1 FROM employees e1
INNER JOIN employees e2
ON e1.email = e2.email AND e1.id > e2.id;

-- 3. Find employees with no department (orphan records)
SELECT e.* FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
WHERE d.id IS NULL;

-- 4. Find departments with no employees
SELECT d.* FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
WHERE e.id IS NULL;

-- 5. Second highest salary (without window function)
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- 6. Employees earning more than their manager
SELECT e.name AS employee, e.salary AS emp_salary,
       m.name AS manager, m.salary AS mgr_salary
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;

-- 7. Running total / Cumulative sum
SELECT name, salary,
    SUM(salary) OVER (ORDER BY id) AS running_total
FROM employees;

-- 8. Pivot / Cross-tab (count per department per city)
SELECT 
    city,
    SUM(CASE WHEN department = 'MERN' THEN 1 ELSE 0 END) AS MERN,
    SUM(CASE WHEN department = 'Data Science' THEN 1 ELSE 0 END) AS DS,
    SUM(CASE WHEN department = 'DevOps' THEN 1 ELSE 0 END) AS DevOps
FROM employees
GROUP BY city;

-- 9. Find consecutive dates (employees who joined on consecutive days)
SELECT e1.name, e1.joining_date, e2.name, e2.joining_date
FROM employees e1
JOIN employees e2 
ON DATEDIFF(e2.joining_date, e1.joining_date) = 1;

-- 10. Top N per group (top 3 earners per department)
SELECT * FROM (
    SELECT name, department, salary,
        DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
    FROM employees
) ranked
WHERE rnk <= 3;
```

Note:
- Key Point: These are the most commonly asked SQL coding problems in interviews. Practice writing them without looking at answers. The duplicate deletion, Nth highest salary, and self-join (employee vs manager) are asked most frequently.
- Why Interviewer Asks: Tests practical SQL writing ability. They give a scenario and you write the query on paper or whiteboard.

---

**65. What are CASE statements in MySQL?**

Answer:
CASE is MySQL's version of IF-ELSE. It can be used in SELECT, WHERE, ORDER BY, and other clauses.

```sql
-- Simple CASE (equals comparison)
SELECT name, salary,
    CASE department
        WHEN 'MERN' THEN 'Full Stack'
        WHEN 'Data Science' THEN 'Analytics'
        WHEN 'DevOps' THEN 'Infrastructure'
        ELSE 'Other'
    END AS dept_category
FROM employees;

-- Searched CASE (any condition)
SELECT name, salary,
    CASE
        WHEN salary >= 80000 THEN 'Senior'
        WHEN salary >= 50000 THEN 'Mid-Level'
        WHEN salary >= 30000 THEN 'Junior'
        ELSE 'Intern'
    END AS level
FROM employees;

-- CASE in WHERE clause
SELECT * FROM employees
WHERE CASE 
    WHEN department = 'MERN' THEN salary > 50000
    WHEN department = 'DevOps' THEN salary > 60000
    ELSE salary > 40000
END;

-- CASE in ORDER BY
SELECT * FROM employees
ORDER BY 
    CASE department
        WHEN 'MERN' THEN 1
        WHEN 'Data Science' THEN 2
        WHEN 'DevOps' THEN 3
        ELSE 4
    END;

-- CASE for conditional aggregation (pivot)
SELECT 
    department,
    COUNT(CASE WHEN salary >= 50000 THEN 1 END) AS high_earners,
    COUNT(CASE WHEN salary < 50000 THEN 1 END) AS low_earners
FROM employees
GROUP BY department;

-- IF() shorthand (MySQL specific)
SELECT name, IF(salary > 50000, 'High', 'Low') AS salary_level FROM employees;

-- IFNULL / COALESCE (null handling)
SELECT name, IFNULL(phone, 'No Phone') AS phone FROM employees;
SELECT name, COALESCE(phone, email, 'No Contact') AS contact FROM employees;
-- COALESCE returns first non-NULL value
```

Note:
- Key Point: CASE works like switch-case in programming. Can be used anywhere in SQL query. Conditional aggregation (CASE inside COUNT/SUM) is very useful for pivot-like queries. COALESCE returns first non-NULL value from a list. IF() is MySQL-specific shorthand for simple conditions.
- Why Interviewer Asks: Practical SQL question. Conditional aggregation and pivot queries are common real-world requirements.

---

**66. What are MySQL Isolation Levels?**

Answer:
Isolation Level defines how one transaction sees data changes made by other concurrent transactions. Higher isolation = more consistent but slower.

```
| Level              | Dirty Read | Non-Repeatable Read | Phantom Read |
|--------------------|:----------:|:-------------------:|:------------:|
| READ UNCOMMITTED   | ✅ Yes     | ✅ Yes              | ✅ Yes       |
| READ COMMITTED     | ❌ No      | ✅ Yes              | ✅ Yes       |
| REPEATABLE READ    | ❌ No      | ❌ No               | ✅ Yes       |
| SERIALIZABLE       | ❌ No      | ❌ No               | ❌ No        |
```

```
Problems:
- Dirty Read: Reading uncommitted data from another transaction
  T1 updates salary to 70000 but hasn't committed. T2 reads 70000.
  T1 rolls back. T2 has wrong data.

- Non-Repeatable Read: Same query gives different results within same transaction
  T1 reads salary = 50000. T2 updates to 70000 and commits.
  T1 reads again, gets 70000. Different result in same transaction.

- Phantom Read: New rows appear between reads
  T1 counts employees in MERN dept = 5. T2 inserts new MERN employee.
  T1 counts again = 6. New "phantom" row appeared.
```

```sql
-- Check current isolation level
SELECT @@transaction_isolation;

-- Set isolation level
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Default in MySQL (InnoDB): REPEATABLE READ
-- Default in PostgreSQL: READ COMMITTED
```

Note:
- Key Point: MySQL default is REPEATABLE READ (prevents dirty and non-repeatable reads). SERIALIZABLE is safest but slowest (full isolation). READ UNCOMMITTED is fastest but can read dirty data. Choose based on your application's consistency vs performance needs.
- Why Interviewer Asks: Advanced database concept. Shows deep understanding of concurrency and data consistency. Not always asked at entry level but knowing it is impressive.

---

## Topic 2 : Sequelize Advanced

---

**67. How do you use Sequelize Migrations?**

Answer:
Migrations are like version control for your database schema. Instead of using sync(), you write migration files that describe how to change the database structure. This is the production-safe way to manage schema changes.

```bash
# Install Sequelize CLI
npm install --save-dev sequelize-cli

# Initialize (creates folders)
npx sequelize-cli init
# Creates: config/, models/, migrations/, seeders/

# Generate migration
npx sequelize-cli migration:generate --name create-employees

# Run migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Undo all migrations
npx sequelize-cli db:migrate:undo:all
```

```javascript
// migrations/20250115-create-employees.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('employees', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(100),
                unique: true,
                allowNull: false
            },
            salary: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            department_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'departments',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });
    },
    
    down: async (queryInterface) => {
        await queryInterface.dropTable('employees');
    }
};

// Add column migration
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('employees', 'phone', {
            type: Sequelize.STRING(15),
            allowNull: true
        });
    },
    down: async (queryInterface) => {
        await queryInterface.removeColumn('employees', 'phone');
    }
};
```

Note:
- Key Point: Never use sync({ force: true }) in production — use migrations. up() defines the change, down() reverses it. Migrations are tracked in a SequelizeMeta table. Run migrations in deployment pipelines. Seeders are for initial data (admin users, categories).
- Why Interviewer Asks: Production-level question. Using sync in production is a red flag. Migrations show you know proper database management.

---

**68. How do you use Seeders in Sequelize?**

Answer:
Seeders populate the database with initial or test data. They are like migrations but for data instead of structure.

```bash
# Generate seeder
npx sequelize-cli seed:generate --name seed-departments

# Run all seeders
npx sequelize-cli db:seed:all

# Undo last seeder
npx sequelize-cli db:seed:undo

# Undo all seeders
npx sequelize-cli db:seed:undo:all
```

```javascript
// seeders/20250115-seed-departments.js
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert('departments', [
            { name: 'MERN Stack', location: 'Building A', createdAt: new Date(), updatedAt: new Date() },
            { name: 'Data Science', location: 'Building B', createdAt: new Date(), updatedAt: new Date() },
            { name: 'DevOps', location: 'Building C', createdAt: new Date(), updatedAt: new Date() }
        ]);
    },
    
    down: async (queryInterface) => {
        await queryInterface.bulkDelete('departments', null, {});
    }
};
```

Note:
- Key Point: Seeders are for initial data like admin users, categories, config values. Run seeders after migrations. Production seeders should be idempotent (safe to run multiple times). Use factories for test data generation.
- Why Interviewer Asks: Shows you understand complete database setup workflow: migrations for structure, seeders for data.

---

**69. What are Scopes in Sequelize?**

Answer:
Scopes are predefined query configurations that can be reused. They define common WHERE conditions, attributes, includes that you use frequently.

```javascript
const Employee = sequelize.define('Employee', {
    name: DataTypes.STRING,
    salary: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN,
    department: DataTypes.STRING
}, {
    // Define scopes
    defaultScope: {
        where: { isActive: true }    // always applied unless explicitly removed
    },
    scopes: {
        // Named scopes
        highEarners: {
            where: { salary: { [Op.gt]: 70000 } }
        },
        mernTeam: {
            where: { department: 'MERN' }
        },
        withDepartment: {
            include: [{ model: Department }]
        },
        bySalaryRange(min, max) {   // scope with parameters
            return {
                where: { salary: { [Op.between]: [min, max] } }
            };
        },
        minimal: {
            attributes: ['id', 'name', 'email']
        }
    }
});

// Usage:

// defaultScope is auto-applied
const activeEmployees = await Employee.findAll();
// WHERE isActive = true (always)

// Named scope
const highEarners = await Employee.scope('highEarners').findAll();

// Combine multiple scopes
const highEarningMern = await Employee.scope('highEarners', 'mernTeam').findAll();

// Scope with parameters
const midRange = await Employee.scope({ method: ['bySalaryRange', 40000, 70000] }).findAll();

// Remove default scope
const allIncludingInactive = await Employee.unscoped().findAll();
```

Note:
- Key Point: defaultScope applies to ALL queries automatically. Named scopes are opt-in. Scopes can be combined. unscoped() removes default scope. Scopes keep code DRY — define once, reuse everywhere. Parameterized scopes add flexibility.
- Why Interviewer Asks: Shows advanced Sequelize knowledge and clean code practices. Scopes prevent repeating the same WHERE conditions across multiple queries.

---

**70. What are Hooks (Lifecycle Events) in Sequelize?**

Answer:
Hooks are functions called at specific points during Sequelize model lifecycle. Similar to Mongoose middleware.

```javascript
const Employee = sequelize.define('Employee', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    salary: DataTypes.INTEGER
}, {
    hooks: {
        // Before creating
        beforeCreate: async (employee, options) => {
            if (employee.password) {
                employee.password = await bcrypt.hash(employee.password, 12);
            }
            employee.email = employee.email.toLowerCase();
        },
        
        // After creating
        afterCreate: (employee, options) => {
            console.log(`New employee ${employee.name} created`);
            // Send welcome email
        },
        
        // Before updating
        beforeUpdate: async (employee, options) => {
            if (employee.changed('password')) {
                employee.password = await bcrypt.hash(employee.password, 12);
            }
        },
        
        // Before destroying
        beforeDestroy: async (employee, options) => {
            // Cascade delete related records
            await Project.destroy({ where: { employeeId: employee.id } });
        },
        
        // Before bulk create
        beforeBulkCreate: async (employees, options) => {
            for (const emp of employees) {
                emp.email = emp.email.toLowerCase();
            }
        }
    }
});

// Alternative: define hooks outside model
Employee.addHook('beforeValidate', 'myHookName', (employee) => {
    // ...
});

// Available hooks:
// beforeValidate, afterValidate
// beforeCreate, afterCreate
// beforeUpdate, afterUpdate
// beforeDestroy, afterDestroy
// beforeBulkCreate, afterBulkCreate
// beforeBulkUpdate, afterBulkUpdate
// beforeBulkDestroy, afterBulkDestroy
// beforeFind, afterFind
// beforeSave, afterSave (both create and update)
```

Note:
- Key Point: Hooks are similar to Mongoose middleware. beforeCreate is best for password hashing, email normalization. afterCreate for notifications, logging. beforeDestroy for cascade deletes. employee.changed('field') checks if specific field was modified. Bulk hooks have different behavior — individual hooks do not fire during bulk operations by default.
- Why Interviewer Asks: Shows you understand model lifecycle and can add logic at the right points. Password hashing hook is the most practical example.

---

**71. What is the difference between Sequelize Operators and raw SQL?**

Answer:

```javascript
const { Op } = require('sequelize');

// Comparison
// SQL: WHERE salary > 50000
{ salary: { [Op.gt]: 50000 } }

// SQL: WHERE salary >= 50000 AND salary <= 80000
{ salary: { [Op.gte]: 50000, [Op.lte]: 80000 } }
// OR
{ salary: { [Op.between]: [50000, 80000] } }

// SQL: WHERE department IN ('MERN', 'DevOps')
{ department: { [Op.in]: ['MERN', 'DevOps'] } }

// SQL: WHERE name LIKE '%Deep%'
{ name: { [Op.like]: '%Deep%' } }

// SQL: WHERE name NOT LIKE '%test%'
{ name: { [Op.notLike]: '%test%' } }

// SQL: WHERE email IS NULL
{ email: { [Op.is]: null } }

// SQL: WHERE email IS NOT NULL
{ email: { [Op.not]: null } }

// Logical
// SQL: WHERE (dept = 'MERN' OR dept = 'DS') AND salary > 50000
{
    [Op.and]: [
        { [Op.or]: [{ department: 'MERN' }, { department: 'DS' }] },
        { salary: { [Op.gt]: 50000 } }
    ]
}

// SQL: WHERE salary > 50000 OR (dept = 'MERN' AND age > 20)
{
    [Op.or]: [
        { salary: { [Op.gt]: 50000 } },
        { [Op.and]: [{ department: 'MERN' }, { age: { [Op.gt]: 20 } }] }
    ]
}

// All Operators:
// Op.eq, Op.ne, Op.gt, Op.gte, Op.lt, Op.lte
// Op.between, Op.notBetween
// Op.in, Op.notIn
// Op.like, Op.notLike, Op.iLike (case-insensitive)
// Op.is, Op.not
// Op.and, Op.or
// Op.startsWith, Op.endsWith, Op.substring
// Op.regexp, Op.notRegexp
// Op.col (reference another column)
```

Note:
- Key Point: Always import Op from sequelize. Op operators map directly to SQL operators. Complex nested conditions use [Op.and] and [Op.or] with arrays. Op.col lets you compare two columns. Use Op instead of string operators for security (prevents SQL injection).
- Why Interviewer Asks: Practical Sequelize question. Shows you can write complex query conditions without resorting to raw SQL.

---

**72. How do you implement Eager Loading vs Lazy Loading in Sequelize?**

Answer:

```javascript
// EAGER LOADING — fetch related data in the SAME query (JOIN)
// Fewer queries but potentially larger result set

// Basic eager loading
const employees = await Employee.findAll({
    include: [{ model: Department }]
});
// SQL: SELECT * FROM employees LEFT JOIN departments ON ...
// One query, gets employees + departments together

// Multiple eager loads
const full = await Employee.findAll({
    include: [
        { model: Department, attributes: ['name'] },
        { model: Project, where: { isActive: true } },
        { model: Profile }
    ]
});

// Nested eager loading
const deep = await Department.findAll({
    include: {
        model: Employee,
        include: { model: Profile }
    }
});


// LAZY LOADING — fetch related data in SEPARATE queries on demand
// More queries but smaller initial load

const employee = await Employee.findByPk(1);
// One query: SELECT * FROM employees WHERE id = 1

// Later, when needed:
const department = await employee.getDepartment();
// Another query: SELECT * FROM departments WHERE id = ...

const projects = await employee.getProjects();
// Another query: SELECT * FROM projects JOIN ...

// Lazy loading methods (auto-generated by associations):
// hasOne:      getDepartment(), setDepartment(), createDepartment()
// hasMany:     getProjects(), setProjects(), addProject(), removeProject(), countProjects()
// belongsTo:   getDepartment(), setDepartment(), createDepartment()
// belongsToMany: getProjects(), setProjects(), addProject(), removeProject()
```

| Feature | Eager Loading | Lazy Loading |
|---------|:---:|:---:|
| Queries | One JOIN query | Multiple separate queries |
| Data loaded | All at once | On demand |
| Performance | Better for related data you always need | Better when you rarely need related data |
| N+1 Problem | Avoids | Can cause N+1 |
| Syntax | include: [] | get methods |

Note:
- Key Point: Eager loading uses JOINs (include) — one query, all data. Lazy loading uses getters — separate queries when needed. Use eager when you always need related data. Use lazy when you sometimes need it. N+1 problem: if you lazy load in a loop, you get N+1 queries (1 for main + N for each relation). Eager loading solves N+1.
- Why Interviewer Asks: Performance optimization question. N+1 problem is a very common interview topic. Understanding when to use eager vs lazy shows practical experience.

---

**73. What is the N+1 Query Problem? How do you solve it?**

Answer:
N+1 problem occurs when you fetch N records and then make 1 additional query for each record to get related data. Total = N+1 queries instead of 1-2 queries.

```javascript
// N+1 PROBLEM — BAD
const employees = await Employee.findAll();  // 1 query
for (const emp of employees) {
    const dept = await emp.getDepartment();   // N queries (one per employee)
    console.log(`${emp.name} — ${dept.name}`);
}
// If 100 employees → 101 queries! Very slow.

// SOLUTION — Eager Loading
const employees = await Employee.findAll({
    include: [{ model: Department }]          // 1 JOIN query
});
for (const emp of employees) {
    console.log(`${emp.name} — ${emp.Department.name}`);
}
// Only 1 query total! Fast.

// In Mongoose:
// N+1 PROBLEM:
const employees = await Employee.find();
for (const emp of employees) {
    const dept = await Department.findById(emp.department_id);  // N queries
}

// SOLUTION — populate:
const employees = await Employee.find().populate('department_id');
// 2 queries total (1 for employees, 1 for all needed departments)
```

Note:
- Key Point: N+1 happens with lazy loading in loops. Solution: use eager loading (Sequelize include, Mongoose populate). Always think about query count when accessing related data. Tools like query logging can help detect N+1 issues.
- Why Interviewer Asks: One of the most common performance problems in ORM usage. If you know this, it shows you write performant code.

---

## Topic 3 : MongoDB Advanced

---

**74. What is the 16MB Document Size Limit in MongoDB?**

Answer:
MongoDB has a maximum document size of 16MB. This means a single document (including all embedded data, arrays, and nested objects) cannot exceed 16MB.

```javascript
// This could exceed 16MB:
{
    _id: ObjectId("..."),
    name: "Blog Post",
    comments: [
        // If this blog post gets 100,000 comments with content,
        // the document could exceed 16MB!
        { user: "...", text: "...", date: "..." },
        // ... 100,000 more comments
    ]
}

// SOLUTION: Reference instead of embed
// posts collection
{
    _id: ObjectId("post1"),
    title: "Blog Post"
}

// comments collection (separate)
{
    _id: ObjectId("comment1"),
    post_id: ObjectId("post1"),
    user: "Deep",
    text: "Great post!",
    date: new Date()
}

// For files larger than 16MB, use GridFS
// GridFS splits files into chunks (255KB each) and stores them across documents
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
// GridFS can store files of any size (images, videos, PDFs)
```

Note:
- Key Point: 16MB limit applies to single document. Unbounded arrays (comments, logs, events) can hit this limit. Solution: reference instead of embed for large/growing data. GridFS handles files larger than 16MB by splitting into chunks. Monitor document sizes in production.
- Why Interviewer Asks: Important design constraint. Shows you know the limits and can design schemas that avoid hitting them.

---

**75. What is the difference between `$match` before and after `$group` in Aggregation?**

Answer:

```javascript
// $match BEFORE $group = WHERE clause (filters individual documents)
// $match AFTER $group = HAVING clause (filters groups)

// SQL equivalent:
// SELECT department, AVG(salary)
// FROM employees
// WHERE isActive = true           ← $match BEFORE $group
// GROUP BY department
// HAVING AVG(salary) > 50000      ← $match AFTER $group

db.employees.aggregate([
    // Stage 1: WHERE — filter individual documents BEFORE grouping
    { $match: { isActive: true } },
    
    // Stage 2: GROUP BY
    { $group: {
        _id: "$department",
        avgSalary: { $avg: "$salary" },
        count: { $sum: 1 }
    }},
    
    // Stage 3: HAVING — filter groups AFTER grouping
    { $match: { avgSalary: { $gt: 50000 }, count: { $gte: 3 } } },
    
    // Stage 4: ORDER BY
    { $sort: { avgSalary: -1 } }
]);
```

**Performance tip:**
```javascript
// GOOD: $match early (reduces documents before expensive operations)
db.employees.aggregate([
    { $match: { isActive: true } },    // Filter FIRST — fewer docs to process
    { $group: { _id: "$dept", avg: { $avg: "$salary" } } }
]);

// BAD: $match late (processes all documents then filters)
db.employees.aggregate([
    { $group: { _id: "$dept", avg: { $avg: "$salary" } } },  // Groups ALL docs
    { $match: { _id: { $ne: "Inactive" } } }                  // Filter after
]);
```

Note:
- Key Point: $match before $group = WHERE (filter rows). $match after $group = HAVING (filter groups). Always put $match as early as possible in pipeline for performance — it reduces the number of documents subsequent stages process. Early $match can use indexes.
- Why Interviewer Asks: Practical aggregation question. Understanding stage order and its impact on performance is important.

---

**76. How do you implement Text Search in MongoDB?**

Answer:

```javascript
// Step 1: Create text index
db.articles.createIndex({ title: "text", content: "text", tags: "text" });

// Step 2: Search using $text operator
db.articles.find({
    $text: { $search: "javascript react" }   // searches for "javascript" OR "react"
});

// Phrase search (exact phrase)
db.articles.find({
    $text: { $search: '"MERN Stack"' }       // exact phrase in quotes
});

// Exclude word
db.articles.find({
    $text: { $search: "javascript -angular" } // has javascript but NOT angular
});

// Sort by relevance score
db.articles.find(
    { $text: { $search: "mongodb tutorial" } },
    { score: { $meta: "textScore" } }         // include relevance score
).sort(
    { score: { $meta: "textScore" } }         // sort by relevance
);

// Case insensitive and diacritic insensitive by default
db.articles.find({
    $text: {
        $search: "cafe",
        $caseSensitive: false,                // default
        $diacriticSensitive: false            // default (café matches cafe)
    }
});

// Alternative: $regex for simple pattern matching
db.articles.find({ title: { $regex: /mongodb/i } });
// $regex is slower than $text for large collections (no special index optimization)
```

Note:
- Key Point: Text search requires a text index. Only ONE text index per collection. $text searches across all text-indexed fields. Results are ranked by relevance. Use $regex for simple patterns, $text for full-text search. For advanced search consider MongoDB Atlas Search or Elasticsearch.
- Why Interviewer Asks: Practical feature for any application with search functionality. Understanding text index vs regex and relevance scoring shows practical knowledge.

---

**77. What is Change Streams in MongoDB?**

Answer:
Change Streams allow applications to watch for real-time changes in a collection, database, or deployment. Like event listeners for database changes.

```javascript
// Watch for changes on a collection
const changeStream = db.employees.watch();

changeStream.on('change', (change) => {
    console.log('Change detected:', change);
    // change object contains:
    // {
    //   operationType: 'insert' / 'update' / 'delete' / 'replace',
    //   fullDocument: { ... },         // the changed document (for insert/update)
    //   documentKey: { _id: ... },     // which document changed
    //   updateDescription: {           // for update operations
    //     updatedFields: { salary: 70000 },
    //     removedFields: []
    //   }
    // }
});

// Watch with filter (only specific operations)
const pipeline = [
    { $match: { 
        operationType: { $in: ['insert', 'update'] },
        'fullDocument.department': 'MERN'
    }}
];
const filteredStream = db.employees.watch(pipeline);

// Mongoose change streams
const Employee = mongoose.model('Employee', employeeSchema);
Employee.watch().on('change', (change) => {
    if (change.operationType === 'insert') {
        console.log('New employee:', change.fullDocument.name);
        // Send notification, update cache, etc.
    }
});

// Use cases:
// 1. Real-time notifications
// 2. Cache invalidation
// 3. Data synchronization
// 4. Audit logging
// 5. Trigger-like behavior (since MongoDB doesn't have SQL triggers)
```

Note:
- Key Point: Change Streams require replica set. They provide real-time data change notifications. Unlike polling (checking every few seconds), change streams are event-driven (instant). Use for notifications, cache invalidation, and microservices data sync.
- Why Interviewer Asks: Advanced MongoDB feature. Shows you know real-time capabilities beyond basic CRUD. Useful for building real-time features in MERN apps.

---

**78. What is MongoDB Atlas Search?**

Answer:
MongoDB Atlas Search is a full-text search engine built on Apache Lucene, integrated directly into MongoDB Atlas. It provides powerful search capabilities beyond basic $text search.

```javascript
// Atlas Search uses $search stage in aggregation pipeline
db.products.aggregate([
    {
        $search: {
            index: "default",                    // search index name
            text: {
                query: "wireless headphones",
                path: ["name", "description"],   // fields to search
                fuzzy: {
                    maxEdits: 1                  // allow 1 character typo
                }
            }
        }
    },
    { $limit: 10 },
    {
        $project: {
            name: 1,
            description: 1,
            price: 1,
            score: { $meta: "searchScore" }      // relevance score
        }
    }
]);

// Autocomplete search
db.products.aggregate([
    {
        $search: {
            autocomplete: {
                query: "head",
                path: "name",
                fuzzy: { maxEdits: 1 }
            }
        }
    }
]);

// Features:
// 1. Fuzzy matching (typo tolerance)
// 2. Autocomplete
// 3. Faceted search (filters + counts)
// 4. Highlighting (show matched text)
// 5. Synonyms
// 6. Custom scoring/boosting
```

Note:
- Key Point: Atlas Search is only available on MongoDB Atlas (cloud). It is much more powerful than basic $text search. Supports fuzzy matching, autocomplete, facets. Alternative to Elasticsearch for MongoDB users. Requires creating search indexes in Atlas dashboard.
- Why Interviewer Asks: Shows awareness of MongoDB ecosystem beyond basic operations. Relevant if building search features in MERN applications.

---

## Topic 4 : Mongoose Advanced

---

**79. How do you implement Pagination with Total Count in Mongoose?**

Answer:

```javascript
// Basic pagination function
async function paginate(model, query = {}, options = {}) {
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 10;
    const sort = options.sort || { createdAt: -1 };
    const select = options.select || '';
    const populate = options.populate || '';
    
    const skip = (page - 1) * limit;
    
    // Execute both queries in parallel for performance
    const [data, totalCount] = await Promise.all([
        model.find(query)
            .select(select)
            .populate(populate)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
        model.countDocuments(query)
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return {
        data,
        pagination: {
            currentPage: page,
            pageSize: limit,
            totalItems: totalCount,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
}

// Usage in Express route
app.get('/api/employees', async (req, res) => {
    const { page, limit, department, sort } = req.query;
    
    const query = {};
    if (department) query.department = department;
    
    const result = await paginate(Employee, query, {
        page,
        limit,
        sort: sort || '-salary',
        select: 'name email salary department',
        populate: 'department_id'
    });
    
    res.json(result);
});

// Response:
// {
//   data: [...10 employees...],
//   pagination: {
//     currentPage: 2,
//     pageSize: 10,
//     totalItems: 47,
//     totalPages: 5,
//     hasNextPage: true,
//     hasPrevPage: true
//   }
// }

// Cursor-based pagination (better for large datasets)
async function cursorPaginate(model, query = {}, options = {}) {
    const limit = parseInt(options.limit) || 10;
    const cursor = options.cursor;  // last item's _id from previous page
    
    if (cursor) {
        query._id = { $gt: cursor };  // get documents after cursor
    }
    
    const data = await model.find(query)
        .sort({ _id: 1 })
        .limit(limit + 1)  // fetch one extra to check if next page exists
        .lean();
    
    const hasNextPage = data.length > limit;
    if (hasNextPage) data.pop();  // remove the extra item
    
    return {
        data,
        nextCursor: hasNextPage ? data[data.length - 1]._id : null,
        hasNextPage
    };
}
```

Note:
- Key Point: Use Promise.all to run count and find in parallel (2x faster). Always return pagination metadata (totalPages, hasNext, hasPrev). Skip-based pagination is simple but slow for large offsets. Cursor-based pagination is more performant for large datasets (doesn't skip documents). Return hasNextPage and hasPrevPage for UI pagination controls.
- Why Interviewer Asks: Every API needs pagination. Running count and find in parallel shows performance awareness. Cursor-based pagination shows advanced knowledge.

---

**80. How do you implement Search with Filters in Mongoose?**

Answer:

```javascript
// Dynamic search with filters — common API pattern
app.get('/api/employees', async (req, res) => {
    const {
        search,         // text search
        department,     // exact match filter
        minSalary,      // range filter
        maxSalary,
        skills,         // array filter
        sortBy,         // sort field
        sortOrder,      // asc or desc
        page,
        limit
    } = req.query;
    
    // Build query dynamically
    const query = {};
    
    // Text search (name or email)
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }
    
    // Exact match filter
    if (department) {
        query.department = department;
    }
    
    // Range filter
    if (minSalary || maxSalary) {
        query.salary = {};
        if (minSalary) query.salary.$gte = parseInt(minSalary);
        if (maxSalary) query.salary.$lte = parseInt(maxSalary);
    }
    
    // Array contains filter
    if (skills) {
        query.skills = { $all: skills.split(',') };
    }
    
    // Build sort
    const sort = {};
    sort[sortBy || 'createdAt'] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute with pagination
    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    
    const [data, total] = await Promise.all([
        Employee.find(query)
            .sort(sort)
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .populate('department_id', 'name')
            .lean(),
        Employee.countDocuments(query)
    ]);
    
    res.json({
        success: true,
        data,
        pagination: {
            page: pageNum,
            limit: pageSize,
            total,
            pages: Math.ceil(total / pageSize)
        }
    });
});

// Example API calls:
// GET /api/employees?search=deep&department=MERN&minSalary=40000&sortBy=salary&sortOrder=desc&page=1&limit=10
// GET /api/employees?skills=JavaScript,React&maxSalary=80000
```

Note:
- Key Point: Build query object dynamically based on provided filters. Only add conditions for provided parameters (empty query = find all). Use $regex with 'i' option for case-insensitive search. Use $all for "must have ALL skills" or $in for "must have ANY skill". Always sanitize and parse query parameters.
- Why Interviewer Asks: Very practical MERN question. This is what real APIs look like. Shows you can build flexible, filterable API endpoints.

---

**81. What are Mongoose Plugins?**

Answer:
Plugins are reusable pieces of schema logic that can be applied to any schema. They help avoid repeating the same functionality across multiple schemas.

```javascript
// Define a plugin
function timestampPlugin(schema, options) {
    // Add fields
    schema.add({
        createdBy: { type: String },
        updatedBy: { type: String }
    });
    
    // Add pre-save hook
    schema.pre('save', function(next) {
        if (this.isNew) {
            this.createdBy = options.defaultUser || 'system';
        }
        this.updatedBy = options.defaultUser || 'system';
        next();
    });
    
    // Add static method
    schema.statics.findRecent = function(days = 7) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return this.find({ createdAt: { $gte: date } });
    };
}

// Soft delete plugin
function softDeletePlugin(schema) {
    schema.add({ deletedAt: { type: Date, default: null } });
    
    schema.pre(/^find/, function(next) {
        this.where({ deletedAt: null });
        next();
    });
    
    schema.methods.softDelete = function() {
        this.deletedAt = new Date();
        return this.save();
    };
    
    schema.methods.restore = function() {
        this.deletedAt = null;
        return this.save();
    };
    
    schema.statics.findDeleted = function() {
        return this.find({ deletedAt: { $ne: null } });
    };
}

// Apply plugin to specific schema
employeeSchema.plugin(timestampPlugin, { defaultUser: 'admin' });
employeeSchema.plugin(softDeletePlugin);

// Apply plugin globally to ALL schemas
mongoose.plugin(timestampPlugin);

// Popular community plugins:
// mongoose-paginate-v2  — pagination
// mongoose-unique-validator — better unique error messages
// mongoose-autopopulate — auto-populate references
// mongoose-lean-virtuals — include virtuals in lean queries
```

Note:
- Key Point: Plugins are reusable schema middleware. Apply to specific schemas or globally. Used for cross-cutting concerns like soft delete, audit logging, pagination. Community plugins save development time. Global plugins affect ALL models — use carefully.
- Why Interviewer Asks: Shows you write reusable, DRY code. Plugin architecture is a common pattern in Node.js ecosystem.

---

**82. How do you handle File Uploads with MongoDB (GridFS)?**

Answer:

```javascript
// GridFS splits large files into chunks (255KB each) and stores them in MongoDB
// Two collections: fs.files (metadata) and fs.chunks (data chunks)

const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const multer = require('multer');
const { Readable } = require('stream');

// Setup GridFS
let gridFSBucket;
mongoose.connection.on('connected', () => {
    gridFSBucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
});

// Upload file
app.post('/upload', multer().single('file'), async (req, res) => {
    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);
    
    const uploadStream = gridFSBucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
        metadata: { uploadedBy: req.user.id }
    });
    
    readableStream.pipe(uploadStream);
    
    uploadStream.on('finish', () => {
        res.json({ fileId: uploadStream.id, filename: req.file.originalname });
    });
});

// Download file
app.get('/download/:id', async (req, res) => {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = gridFSBucket.openDownloadStream(fileId);
    
    downloadStream.pipe(res);
    
    downloadStream.on('error', () => {
        res.status(404).json({ error: 'File not found' });
    });
});

// Delete file
app.delete('/files/:id', async (req, res) => {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    await gridFSBucket.delete(fileId);
    res.json({ message: 'File deleted' });
});

// List files
app.get('/files', async (req, res) => {
    const files = await gridFSBucket.find().toArray();
    res.json(files);
});

// Alternative: Store files in cloud (AWS S3, Cloudinary) and save URL in MongoDB
// This is the recommended approach for most applications
const employeeSchema = new Schema({
    name: String,
    profileImage: String  // URL to S3/Cloudinary
});
```

Note:
- Key Point: GridFS splits files into 255KB chunks. Good for files > 16MB. For most MERN applications, use cloud storage (AWS S3, Cloudinary) and store the URL in MongoDB. GridFS is useful when you want everything in MongoDB or cannot use cloud storage.
- Why Interviewer Asks: Practical file handling question. Knowing both GridFS and cloud storage approaches shows you can choose the right solution.

---

## Topic 5 : Performance & Optimization

---

**83. How do you optimize MongoDB queries?**

Answer:

```javascript
// 1. Use INDEXES on frequently queried fields
db.employees.createIndex({ department: 1, salary: -1 });

// 2. Use explain() to analyze query performance
db.employees.find({ name: "Deep" }).explain("executionStats");
// Look for:
// - IXSCAN (index scan) = GOOD
// - COLLSCAN (collection scan) = BAD
// - totalDocsExamined: should be close to nReturned

// 3. Use PROJECTION — select only needed fields
// BAD: fetches entire document
const emp = await Employee.find({ department: 'MERN' });

// GOOD: fetches only needed fields
const emp = await Employee.find({ department: 'MERN' })
    .select('name salary email');

// 4. Use lean() for read-only queries
const data = await Employee.find().lean();  // 5-10x faster

// 5. Use $match EARLY in aggregation pipeline
// BAD:
db.employees.aggregate([
    { $lookup: { ... } },     // heavy operation on ALL documents
    { $match: { dept: "MERN" } } // filter late
]);

// GOOD:
db.employees.aggregate([
    { $match: { dept: "MERN" } }, // filter FIRST — fewer docs to process
    { $lookup: { ... } }          // heavy operation on fewer documents
]);

// 6. Limit results
const recent = await Employee.find()
    .sort({ createdAt: -1 })
    .limit(10);

// 7. Use countDocuments instead of find().length
// BAD:
const employees = await Employee.find({ dept: "MERN" });
const count = employees.length;  // loads ALL documents into memory

// GOOD:
const count = await Employee.countDocuments({ dept: "MERN" });

// 8. Use bulkWrite for multiple operations
await Employee.bulkWrite([
    { updateOne: { filter: { _id: id1 }, update: { $set: { salary: 50000 } } } },
    { updateOne: { filter: { _id: id2 }, update: { $set: { salary: 60000 } } } }
]);  // One round trip instead of N

// 9. Avoid unbounded arrays in documents
// BAD: { comments: [...100000 items...] } → document too large
// GOOD: Separate comments collection with post_id reference

// 10. Use connection pooling
mongoose.connect(uri, { maxPoolSize: 10 });
```

Note:
- Key Point: Index frequently queried fields. Use explain() to verify. Select only needed fields. Use lean() for read-only. Filter early in aggregation. Limit results. Use bulkWrite for batch operations. Avoid unbounded arrays. These optimizations can dramatically improve API response times.
- Why Interviewer Asks: Performance is critical in production. These are practical tips that show you have experience with real-world applications.

---

**84. How do you optimize MySQL queries?**

Answer:

```sql
-- 1. Use EXPLAIN to analyze query
EXPLAIN SELECT * FROM employees WHERE department = 'MERN';
-- Check: type (ref/const = good, ALL = bad), rows examined, key used

-- 2. Add proper INDEXES
CREATE INDEX idx_dept ON employees(department);
CREATE INDEX idx_dept_salary ON employees(department, salary);

-- 3. SELECT only needed columns
-- BAD:
SELECT * FROM employees;
-- GOOD:
SELECT name, salary FROM employees;

-- 4. Avoid SELECT * in subqueries
-- BAD:
SELECT * FROM employees WHERE dept_id IN (SELECT * FROM departments);
-- GOOD:
SELECT name FROM employees WHERE dept_id IN (SELECT id FROM departments);

-- 5. Use JOIN instead of subquery when possible
-- Subquery (can be slow):
SELECT * FROM employees WHERE dept_id IN (SELECT id FROM departments WHERE location = 'Mumbai');
-- JOIN (usually faster):
SELECT e.* FROM employees e JOIN departments d ON e.dept_id = d.id WHERE d.location = 'Mumbai';

-- 6. Use LIMIT for large result sets
SELECT * FROM employees ORDER BY salary DESC LIMIT 10;

-- 7. Avoid functions on indexed columns in WHERE
-- BAD (index not used):
SELECT * FROM employees WHERE YEAR(joining_date) = 2024;
-- GOOD (index used):
SELECT * FROM employees WHERE joining_date >= '2024-01-01' AND joining_date < '2025-01-01';

-- 8. Use BETWEEN instead of multiple OR
-- BAD:
SELECT * FROM employees WHERE age = 20 OR age = 21 OR age = 22;
-- GOOD:
SELECT * FROM employees WHERE age BETWEEN 20 AND 22;

-- 9. Avoid wildcards at the beginning of LIKE
-- BAD (full scan):
SELECT * FROM employees WHERE name LIKE '%Deep';
-- GOOD (can use index):
SELECT * FROM employees WHERE name LIKE 'Deep%';

-- 10. Use query cache and connection pooling
-- Set in MySQL config or Sequelize pool settings
```

Note:
- Key Point: EXPLAIN before optimizing. Index columns used in WHERE, JOIN, ORDER BY. Select only needed columns. Avoid functions on indexed columns. Use JOIN over subquery. LIMIT results. These are the most impactful optimizations for MySQL performance.
- Why Interviewer Asks: Performance optimization is expected knowledge for any developer working with databases. These are practical tips they want to hear.

---

## Topic 6 : Data Modeling Scenarios

---

**85. How would you design a schema for an E-commerce application?**

Answer:

```javascript
// ===== MySQL / Sequelize Approach =====

// Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin', 'vendor') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

// Products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    category_id INT,
    vendor_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (vendor_id) REFERENCES users(id)
);

// Orders table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total DECIMAL(10, 2),
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

// Order Items (junction table)
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);


// ===== MongoDB / Mongoose Approach =====

// User Schema
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin', 'vendor'], default: 'customer' },
    addresses: [{                          // EMBEDDED — user's addresses
        street: String,
        city: String,
        state: String,
        zip: String,
        isDefault: Boolean
    }]
}, { timestamps: true });

// Product Schema
const productSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },   // REFERENCED
    vendor: { type: Schema.Types.ObjectId, ref: 'User' },
    images: [String],                      // EMBEDDED — product images URLs
    reviews: [{                            // EMBEDDED — if few reviews expected
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Order Schema
const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{                              // EMBEDDED — order items
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: String,                      // denormalized — product name at time of order
        price: Number,                     // denormalized — price at time of order
        quantity: { type: Number, min: 1 }
    }],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    shippingAddress: {                     // EMBEDDED — snapshot of address
        street: String,
        city: String,
        state: String,
        zip: String
    },
    paymentInfo: {                         // EMBEDDED
        method: String,
        transactionId: String,
        status: String
    }
}, { timestamps: true });
```

**Key Design Decisions:**
```
MongoDB:
- Addresses EMBEDDED in User → accessed together, few per user
- Order items EMBEDDED in Order → always accessed together, bounded
- Product name/price DENORMALIZED in Order items → price at time of purchase
- Reviews: embed if few expected, reference if many (avoid 16MB limit)
- Category and User are REFERENCED → shared across many products

MySQL:
- Everything normalized into separate tables
- Foreign keys enforce relationships
- Junction tables for many-to-many (order_items)
- No denormalization needed (JOINs handle it)
```

Note:
- Key Point: E-commerce is the most common schema design question. In MongoDB, denormalize order items (store product name/price at order time so changes to product don't affect past orders). Embed address in user (few items, accessed together). Reference products in orders (shared, large data). In MySQL, normalize everything and use foreign keys.
- Why Interviewer Asks: Tests real-world schema design ability. They want to see your decision-making process for embed vs reference and normalization choices.

---

**86. How would you design a schema for a Social Media application?**

Answer:

```javascript
// MongoDB approach (more suitable for social media)

// User Schema
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: String,
    bio: String,
    avatar: String,
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],   // REFERENCED
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followerCount: { type: Number, default: 0 },                  // DENORMALIZED count
    followingCount: { type: Number, default: 0 }
}, { timestamps: true });

// Post Schema
const postSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, maxlength: 500 },
    images: [String],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likeCount: { type: Number, default: 0 },                      // DENORMALIZED
    commentCount: { type: Number, default: 0 },                   // DENORMALIZED
    tags: [String],
    visibility: { type: String, enum: ['public', 'private', 'friends'], default: 'public' }
}, { timestamps: true });

// Comment Schema (SEPARATE collection — can be unbounded)
const commentSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 300 },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    parentComment: { type: Schema.Types.ObjectId, ref: 'Comment' }  // for replies
}, { timestamps: true });

// Notification Schema
const notificationSchema = new Schema({
    recipient: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['like', 'comment', 'follow', 'mention'] },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });
```

**Design Decisions:**
```
- Comments in SEPARATE collection (unbounded, could exceed 16MB per post)
- Likes stored as array of user IDs (bounded, quick to check if user liked)
- Denormalized counts (likeCount, commentCount, followerCount) for fast display
  Update count when like/comment/follow happens using $inc
- Notifications in separate collection (unbounded per user)
- Followers/Following as ObjectId arrays (for small-medium users)
  For celebrities with millions of followers, use separate collection
```

Note:
- Key Point: Social media data is read-heavy — denormalize counts for fast display. Comments must be separate collection (unbounded). Likes can be embedded as array (check if user already liked). Use $inc to update denormalized counts atomically. For very large scale, consider separate collections for followers/following.
- Why Interviewer Asks: Tests data modeling for read-heavy, high-scale applications. Shows you think about performance and scalability in design.

---

## Topic 7 : Security & Production

---

**87. What are the best practices for MongoDB security?**

Answer:

```javascript
// 1. Enable Authentication
// mongod --auth
// Always create admin user and application-specific users

// 2. Use Strong Connection Strings
mongoose.connect('mongodb+srv://user:strongPassword@cluster.mongodb.net/db', {
    // Use environment variables
});

// 3. Validate and Sanitize Input
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());  // prevents NoSQL injection

// 4. Use Schema Validation
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        match: /^\S+@\S+\.\S+$/,
        maxlength: 100
    },
    age: {
        type: Number,
        min: 0,
        max: 150
    }
});

// 5. Encrypt Sensitive Data
const bcrypt = require('bcryptjs');
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// 6. Use Environment Variables for Credentials
// .env file (never commit to git)
// DB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
// JWT_SECRET=your-secret-key

// 7. Enable SSL/TLS for connections
mongoose.connect(uri, { ssl: true });

// 8. Implement Rate Limiting
const rateLimit = require('express-rate-limit');
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// 9. Use Helmet for HTTP headers
const helmet = require('helmet');
app.use(helmet());

// 10. Principle of Least Privilege
// Create database users with only necessary permissions
// Don't use admin account for application
```

Note:
- Key Point: Always enable authentication. Sanitize input (express-mongo-sanitize). Hash passwords (bcrypt). Use environment variables for secrets. Enable SSL. Rate limit APIs. Use helmet for HTTP security headers. These are must-haves for production MERN applications.
- Why Interviewer Asks: Security awareness is critical. Shows you build production-ready applications, not just hobby projects.

---

**88. What is the difference between `findById` and `findOne({ _id: id })`?**

Answer:

```javascript
// findById — Mongoose convenience method
const emp = await Employee.findById('60f7b2c9e8b1a2d3c4e5f6a7');
// Automatically casts string to ObjectId
// Throws CastError if invalid format

// findOne — standard MongoDB query
const emp = await Employee.findOne({ _id: '60f7b2c9e8b1a2d3c4e5f6a7' });
// Also casts to ObjectId but you specify the field explicitly

// Key Differences:

// 1. findById only searches by _id
//    findOne can search by ANY field
const byEmail = await Employee.findOne({ email: 'deep@test.com' });

// 2. findById(null) returns null
//    findOne({ _id: null }) matches documents where _id IS null (edge case)

// 3. findById is slightly more concise
await Employee.findById(id);
// vs
await Employee.findOne({ _id: id });

// Both return null if not found
// Both support select, populate, lean
const emp = await Employee.findById(id)
    .select('name salary')
    .populate('department_id')
    .lean();
```

Note:
- Key Point: findById is just a shorthand for findOne({ _id: id }). Both auto-cast string to ObjectId. findById(null/undefined) safely returns null. In practice they are interchangeable for _id lookups. Use findOne when searching by other fields.
- Why Interviewer Asks: Quick knowledge question. Shows you understand Mongoose convenience methods and their equivalents.

---

## Topic 8 : Remaining Comparison Questions

---

**89. Compare Aggregation: MySQL GROUP BY vs MongoDB $group.**

Answer:

```sql
-- ===== MySQL =====
-- Department-wise stats
SELECT 
    department,
    COUNT(*) AS emp_count,
    AVG(salary) AS avg_salary,
    MAX(salary) AS max_salary,
    MIN(salary) AS min_salary,
    SUM(salary) AS total_salary
FROM employees
WHERE is_active = 1
GROUP BY department
HAVING AVG(salary) > 50000
ORDER BY avg_salary DESC;
```

```javascript
// ===== MongoDB =====
db.employees.aggregate([
    { $match: { isActive: true } },
    { $group: {
        _id: "$department",                    // GROUP BY
        empCount: { $sum: 1 },                 // COUNT(*)
        avgSalary: { $avg: "$salary" },        // AVG(salary)
        maxSalary: { $max: "$salary" },        // MAX(salary)
        minSalary: { $min: "$salary" },        // MIN(salary)
        totalSalary: { $sum: "$salary" }       // SUM(salary)
    }},
    { $match: { avgSalary: { $gt: 50000 } } }, // HAVING
    { $sort: { avgSalary: -1 } }               // ORDER BY
]);

// ===== Sequelize =====
const stats = await Employee.findAll({
    attributes: [
        'department',
        [sequelize.fn('COUNT', '*'), 'empCount'],
        [sequelize.fn('AVG', sequelize.col('salary')), 'avgSalary'],
        [sequelize.fn('MAX', sequelize.col('salary')), 'maxSalary']
    ],
    where: { isActive: true },
    group: 'department',
    having: sequelize.where(
        sequelize.fn('AVG', sequelize.col('salary')), { [Op.gt]: 50000 }
    ),
    order: [[sequelize.fn('AVG', sequelize.col('salary')), 'DESC']]
});

// ===== Mongoose =====
const stats = await Employee.aggregate([
    { $match: { isActive: true } },
    { $group: {
        _id: '$department',
        empCount: { $sum: 1 },
        avgSalary: { $avg: '$salary' }
    }},
    { $match: { avgSalary: { $gt: 50000 } } },
    { $sort: { avgSalary: -1 } }
]);
```

Note:
- Key Point: MySQL uses GROUP BY clause, MongoDB uses $group stage. MySQL HAVING = MongoDB second $match after $group. Sequelize aggregate syntax is verbose — sometimes raw queries are cleaner. Mongoose aggregation is same as native MongoDB aggregation.
- Why Interviewer Asks: Tests if you can translate between SQL and MongoDB. Common task when migrating or working with both databases.

---

**90. Compare Transactions across MySQL, Sequelize, MongoDB, and Mongoose.**

Answer:

```sql
-- ===== MySQL =====
START TRANSACTION;
UPDATE accounts SET balance = balance - 1000 WHERE name = 'Deep';
UPDATE accounts SET balance = balance + 1000 WHERE name = 'Neel';
-- If success:
COMMIT;
-- If failure:
ROLLBACK;
```

```javascript
// ===== Sequelize =====
const t = await sequelize.transaction();
try {
    await Account.update(
        { balance: sequelize.literal('balance - 1000') },
        { where: { name: 'Deep' }, transaction: t }
    );
    await Account.update(
        { balance: sequelize.literal('balance + 1000') },
        { where: { name: 'Neel' }, transaction: t }
    );
    await t.commit();
} catch (error) {
    await t.rollback();
}

// ===== MongoDB (native) =====
const session = db.getMongo().startSession();
session.startTransaction();
try {
    db.accounts.updateOne({ name: 'Deep' }, { $inc: { balance: -1000 } }, { session });
    db.accounts.updateOne({ name: 'Neel' }, { $inc: { balance: 1000 } }, { session });
    session.commitTransaction();
} catch (error) {
    session.abortTransaction();
} finally {
    session.endSession();
}

// ===== Mongoose =====
const session = await mongoose.startSession();
session.startTransaction();
try {
    await Account.updateOne(
        { name: 'Deep' },
        { $inc: { balance: -1000 } },
        { session }
    );
    await Account.updateOne(
        { name: 'Neel' },
        { $inc: { balance: 1000 } },
        { session }
    );
    await session.commitTransaction();
} catch (error) {
    await session.abortTransaction();
    throw error;
} finally {
    session.endSession();
}
```

Note:
- Key Point: All four follow the same pattern: start → operations → commit or rollback. Sequelize uses transaction object passed to each query. MongoDB/Mongoose use session object. MongoDB transactions require replica set. Pass session/transaction to every operation within the transaction.
- Why Interviewer Asks: Shows you can ensure data integrity across all database technologies. The bank transfer example demonstrates practical understanding.

---

## Topic 9 : More Coding Problems

---

**91. Write a MongoDB aggregation to find most popular skills.**

Answer:

```javascript
// Each employee has skills: ["JS", "React", "Node", ...]
// Find which skills are most common across all employees

db.employees.aggregate([
    // Flatten skills arrays into separate documents
    { $unwind: "$skills" },
    
    // Group by skill and count
    { $group: {
        _id: "$skills",
        count: { $sum: 1 },
        employees: { $push: "$name" }     // list of employees with this skill
    }},
    
    // Sort by count descending
    { $sort: { count: -1 } },
    
    // Top 5 skills
    { $limit: 5 },
    
    // Rename for clarity
    { $project: {
        skill: "$_id",
        count: 1,
        employees: 1,
        _id: 0
    }}
]);

// Output:
// [
//   { skill: "JavaScript", count: 15, employees: ["Deep","Neel",...] },
//   { skill: "React", count: 12, employees: [...] },
//   { skill: "Node.js", count: 10, employees: [...] },
//   ...
// ]
```

Note:
- Key Point: $unwind is essential for analyzing array data. It creates one document per array element. Then $group counts occurrences. $push collects related data into array. This pattern (unwind → group → sort) is very common for analyzing array fields.
- Why Interviewer Asks: Practical aggregation question. Tests $unwind understanding and pipeline composition.

---

**92. Write a query to find employees who joined in the last 30 days.**

Answer:

```sql
-- MySQL
SELECT * FROM employees
WHERE joining_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
ORDER BY joining_date DESC;
```

```javascript
// MongoDB
db.employees.find({
    joining_date: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30))
    }
}).sort({ joining_date: -1 });

// Mongoose
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const recentEmployees = await Employee.find({
    joining_date: { $gte: thirtyDaysAgo }
}).sort({ joining_date: -1 });

// Sequelize
const { Op } = require('sequelize');
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const recentEmployees = await Employee.findAll({
    where: {
        joining_date: { [Op.gte]: thirtyDaysAgo }
    },
    order: [['joining_date', 'DESC']]
});
```

Note:
- Key Point: MySQL uses DATE_SUB for date arithmetic. MongoDB uses JavaScript Date object. The pattern is same across all: filter by date >= (today - 30 days). Date queries are very common in real applications (recent orders, new users, expiring subscriptions).
- Why Interviewer Asks: Practical query that tests date handling. Common in dashboard and reporting features.

---

**93. How do you implement Full-Text Search across MySQL and MongoDB?**

Answer:

```sql
-- ===== MySQL Full-Text Search =====
-- Step 1: Create FULLTEXT index
ALTER TABLE articles ADD FULLTEXT INDEX ft_search (title, content);

-- Step 2: Search using MATCH AGAINST
-- Natural language mode (default)
SELECT *, MATCH(title, content) AGAINST('javascript react' IN NATURAL LANGUAGE MODE) AS relevance
FROM articles
WHERE MATCH(title, content) AGAINST('javascript react')
ORDER BY relevance DESC;

-- Boolean mode (AND, OR, NOT operators)
SELECT * FROM articles
WHERE MATCH(title, content) AGAINST('+javascript -angular' IN BOOLEAN MODE);
-- + = must include, - = must exclude, no prefix = optional

-- Simple LIKE (no fulltext needed, slower)
SELECT * FROM articles
WHERE title LIKE '%javascript%' OR content LIKE '%react%';
```

```javascript
// ===== MongoDB Full-Text Search =====
// Step 1: Create text index
db.articles.createIndex({ title: "text", content: "text" });

// Step 2: Search
db.articles.find(
    { $text: { $search: "javascript react" } },
    { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } });

// Phrase search
db.articles.find({ $text: { $search: '"MERN Stack"' } });

// Exclude word
db.articles.find({ $text: { $search: "javascript -angular" } });

// ===== Mongoose =====
// Create text index in schema
articleSchema.index({ title: 'text', content: 'text' });

const results = await Article.find(
    { $text: { $search: "javascript react" } },
    { score: { $meta: 'textScore' } }
).sort({ score: { $meta: 'textScore' } });
```

Note:
- Key Point: Both MySQL and MongoDB support full-text search with relevance scoring. MySQL uses MATCH AGAINST, MongoDB uses $text. Both require creating special indexes first. For advanced search (fuzzy, autocomplete, facets) consider Elasticsearch or MongoDB Atlas Search.
- Why Interviewer Asks: Search is a common feature in applications. Knowing how to implement it in both databases shows practical ability.

---

## Topic 10 : Error Handling & Debugging

---

**94. How do you handle common database errors in a MERN application?**

Answer:

```javascript
// Centralized error handler for Express + Mongoose
const handleDatabaseError = (error, req, res, next) => {
    console.error('Database Error:', error);
    
    // Mongoose Validation Error
    if (error.name === 'ValidationError') {
        const errors = {};
        Object.keys(error.errors).forEach(key => {
            errors[key] = error.errors[key].message;
        });
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors
        });
    }
    
    // Duplicate Key Error (unique constraint)
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(409).json({
            status: 'error',
            message: `${field} already exists`,
            field
        });
    }
    
    // Invalid ObjectId
    if (error.name === 'CastError') {
        return res.status(400).json({
            status: 'error',
            message: `Invalid ${error.path}: ${error.value}`
        });
    }
    
    // Document Not Found
    if (error.name === 'DocumentNotFoundError') {
        return res.status(404).json({
            status: 'error',
            message: 'Resource not found'
        });
    }
    
    // MongoDB Connection Error
    if (error.name === 'MongoServerError') {
        return res.status(503).json({
            status: 'error',
            message: 'Database service unavailable'
        });
    }
    
    // Sequelize Errors
    if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(e => ({
            field: e.path,
            message: e.message
        }));
        return res.status(400).json({ status: 'error', errors });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            status: 'error',
            message: 'Duplicate entry'
        });
    }
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
            status: 'error',
            message: 'Referenced record does not exist'
        });
    }
    
    // Default server error
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
};

// Use as Express error middleware
app.use(handleDatabaseError);

// In route handlers, wrap with try-catch
app.post('/api/employees', async (req, res, next) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json({ data: employee });
    } catch (error) {
        next(error);  // passes to error handler middleware
    }
});
```

Note:
- Key Point: Always handle specific error types with appropriate HTTP status codes. 400 = bad input, 404 = not found, 409 = conflict (duplicate), 500 = server error. Centralized error handler keeps code DRY. Use next(error) in routes to pass errors to the handler. Never send raw error messages to client in production (security risk).
- Why Interviewer Asks: Error handling is what separates junior from mid-level developers. Proper error responses with correct status codes show production-ready skills.

---

**95. How do you debug slow database queries?**

Answer:

```javascript
// ===== MySQL Debugging =====

// 1. EXPLAIN query
EXPLAIN SELECT * FROM employees WHERE department = 'MERN' AND salary > 50000;
-- Look for:
-- type: "ALL" = full scan (BAD), "ref"/"const" = index used (GOOD)
-- rows: number of rows examined (lower is better)
-- Extra: "Using where" "Using index" (GOOD), "Using filesort" (BAD)

// 2. Slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;  -- log queries taking > 2 seconds

// 3. Show processlist
SHOW PROCESSLIST;  -- see currently running queries


// ===== MongoDB Debugging =====

// 1. explain()
db.employees.find({ department: "MERN" }).explain("executionStats");
// Look for:
// executionStats.executionTimeMillis — total time
// executionStats.totalDocsExamined — docs scanned
// executionStats.nReturned — docs returned
// winningPlan.stage — "IXSCAN" (good) vs "COLLSCAN" (bad)

// 2. MongoDB Profiler
db.setProfilingLevel(1, { slowms: 100 });  // log queries > 100ms
db.system.profile.find().sort({ ts: -1 }).limit(5);  // view slow queries

// 3. Current operations
db.currentOp();  // see running operations


// ===== Sequelize Debugging =====

// Enable query logging
const sequelize = new Sequelize(db, user, pass, {
    logging: console.log  // logs all SQL queries
    // logging: (msg) => logger.debug(msg)  // custom logger
});


// ===== Mongoose Debugging =====

// Enable query logging
mongoose.set('debug', true);
// Logs: Mongoose: employees.find({ department: 'MERN' }) 23ms

// Custom profiling
const start = Date.now();
const result = await Employee.find({ department: 'MERN' });
console.log(`Query took: ${Date.now() - start}ms`);
```

Note:
- Key Point: Always use EXPLAIN/explain() before optimizing. Check if indexes are being used. Enable query logging in development. Monitor slow queries in production. Common fixes: add indexes, reduce selected fields, add limits, optimize query structure.
- Why Interviewer Asks: Shows you can identify and fix performance issues. Debugging skills are essential for maintaining production applications.

---

## Quick Revision — Complete Topics Covered

| # | Topic | File | Questions |
|---|-------|------|:---------:|
| 1 | SQL Basics & Commands | File 2 | 1-2 |
| 2 | Constraints & Keys | File 2 | 3-4 |
| 3 | Data Types | File 2 | 5, 46 |
| 4 | Query Execution Order | File 2 | 6 |
| 5 | JOINs (All Types) | File 2 | 7 |
| 6 | WHERE vs HAVING | File 2 | 8 |
| 7 | Aggregate Functions | File 2 | 9 |
| 8 | Subqueries | File 2 | 10 |
| 9 | Indexes (MySQL & MongoDB) | File 2 | 11, 28 |
| 10 | Transactions & ACID | File 2, File 3 | 12, 54, 90 |
| 11 | Normalization | File 2 | 13 |
| 12 | Nth Highest Salary | File 2 | 14 |
| 13 | SET Operations | File 2 | 15 |
| 14 | String & Date Functions | File 2 | 16 |
| 15 | Storage Engines | File 3 | 56 |
| 16 | Row vs Table Locking | File 3 | 57 |
| 17 | Window Functions | File 3 | 58 |
| 18 | Deadlocks | File 3 | 59 |
| 19 | UNION vs JOIN | File 3 | 60 |
| 20 | Triggers | File 3 | 61 |
| 21 | IN vs EXISTS | File 3 | 62 |
| 22 | CTEs | File 3 | 63 |
| 23 | Common SQL Problems | File 3 | 64 |
| 24 | CASE Statements | File 3 | 65 |
| 25 | Isolation Levels | File 3 | 66 |
| 26 | Views & Stored Procedures | File 2 | 44-45 |
| 27 | Sequelize Setup & Models | File 2 | 17-18 |
| 28 | Sequelize CRUD | File 2 | 19 |
| 29 | Sequelize Associations | File 2 | 20 |
| 30 | Sequelize Raw Queries | File 2 | 21 |
| 31 | Sequelize Migrations & Seeders | File 3 | 67-68 |
| 32 | Sequelize Scopes | File 3 | 69 |
| 33 | Sequelize Hooks | File 3 | 70 |
| 34 | Sequelize Operators | File 3 | 71 |
| 35 | Eager vs Lazy Loading | File 3 | 72 |
| 36 | N+1 Problem | File 3 | 73 |
| 37 | SQL vs NoSQL | File 2 | 22 |
| 38 | MongoDB Basics | File 2 | 23 |
| 39 | Embedded vs Referenced | File 2 | 24 |
| 40 | MongoDB CRUD | File 2 | 25 |
| 41 | MongoDB Operators | File 2 | 26 |
| 42 | Aggregation Pipeline | File 2 | 27, 52, 75, 89, 91 |
| 43 | MongoDB Indexes | File 2 | 28 |
| 44 | Sharding & Replica Sets | File 2 | 36-37 |
| 45 | find vs aggregate | File 2 | 38 |
| 46 | 16MB Document Limit | File 3 | 74 |
| 47 | Text Search | File 3 | 76, 93 |
| 48 | Change Streams | File 3 | 77 |
| 49 | Atlas Search | File 3 | 78 |
| 50 | Array Update Operators | File 2 | 55 |
| 51 | ObjectId | File 2 | 53 |
| 52 | Mongoose Setup & Schema | File 2 | 29-30 |
| 53 | Mongoose CRUD | File 2 | 31 |
| 54 | Mongoose populate | File 2 | 32 |
| 55 | Mongoose Middleware | File 2 | 33 |
| 56 | Mongoose Virtuals | File 2 | 47 |
| 57 | Mongoose Error Handling | File 2 | 48 |
| 58 | save vs create | File 2 | 49 |
| 59 | lean() | File 2 | 50 |
| 60 | findOneAndUpdate vs updateOne | File 2 | 51 |
| 61 | Mongoose Pagination | File 3 | 79 |
| 62 | Search with Filters | File 3 | 80 |
| 63 | Mongoose Plugins | File 3 | 81 |
| 64 | GridFS File Upload | File 3 | 82 |
| 65 | findById vs findOne | File 3 | 88 |
| 66 | SQL Injection | File 2 | 39 |
| 67 | NoSQL Injection | File 2 | 40 |
| 68 | Security Best Practices | File 3 | 87 |
| 69 | Pagination (All DBs) | File 2 | 41 |
| 70 | Soft Delete | File 2 | 42 |
| 71 | Connection Pooling | File 2 | 43 |
| 72 | CRUD Comparison (All 4) | File 2 | 34-35 |
| 73 | MongoDB Query Optimization | File 3 | 83 |
| 74 | MySQL Query Optimization | File 3 | 84 |
| 75 | E-commerce Schema Design | File 3 | 85 |
| 76 | Social Media Schema Design | File 3 | 86 |
| 77 | Database Error Handling | File 3 | 94 |
| 78 | Debugging Slow Queries | File 3 | 95 |
| 79 | Date Queries (All DBs) | File 3 | 92 |
| 80 | Aggregation Comparison | File 3 | 89 |
| 81 | Transaction Comparison | File 3 | 90 |

---
