/*

@MongoDB
=> MongoDB is a NoSQL (Not Only SQL) Database that stores data in flexible, 
   JSON-like documents (BSON — Binary JSON) instead of rows and columns.
=> It is Document-Oriented Database — data stored as "Documents" inside "Collections"
=> Developed by MongoDB Inc. in 2009, Written in C++
=> Schema-less — each document can have different structure (flexible)
=> Horizontally Scalable (can add more servers easily)
=> Used in MERN Stack — M stands for MongoDB


@SQL vs NoSQL (MySQL vs MongoDB)

| Feature          | MySQL (SQL)           | MongoDB (NoSQL)           |
|------------------|-----------------------|---------------------------|
| Data Model       | Tables (Rows/Columns) | Collections (Documents)   |
| Schema           | Fixed Schema          | Flexible/Dynamic Schema   |
| Query Language   | SQL                   | MongoDB Query Language    |
| Relationships    | JOINs (Foreign Keys)  | Embedded Docs / $lookup   |
| Scalability      | Vertical (bigger server)| Horizontal (more servers)|
| ACID             | Full ACID support     | ACID at document level    |
| Best For         | Structured data       | Unstructured/Semi-structured |
| Terminology      | Database→Table→Row→Column | Database→Collection→Document→Field |

@Terminology Mapping (MySQL → MongoDB)
=> Database     → Database
=> Table        → Collection
=> Row          → Document
=> Column       → Field
=> Primary Key  → _id (auto-generated ObjectId)
=> JOIN         → $lookup (aggregation) or Embedded Documents
=> INDEX        → INDEX (same concept)
=> GROUP BY     → $group (aggregation pipeline)


============================================================================
                         @INSTALLATION & SETUP
============================================================================

@MongoDB Installation
-- Download MongoDB Community Server from mongodb.com
-- Or use MongoDB Atlas (Cloud — Free Tier available)

@MongoDB Shell (mongosh)
-- Command line interface to interact with MongoDB
-- Install: npm install -g mongosh
-- Connect: mongosh "mongodb://localhost:27017"
-- Connect to Atlas: mongosh "mongodb+srv://username:password@cluster.mongodb.net/dbname"

@MongoDB Compass
-- GUI tool (like phpMyAdmin for MySQL) to visualize and manage MongoDB data
-- Download from mongodb.com/products/compass

@MongoDB Atlas
-- Cloud-hosted MongoDB service (Database as a Service)
-- Free tier: 512MB storage, shared cluster
-- Used in production MERN apps
-- Connection string: mongodb+srv://user:pass@cluster.mongodb.net/dbname


============================================================================
                          @DATA TYPES
============================================================================

@MongoDB Data Types (BSON Types)

=> String        : UTF-8 string               "Deep"
=> Number        : Integer (32/64 bit)         23
=> Double        : Floating point              3.14
=> Boolean       : true / false                true
=> ObjectId      : Unique 12-byte ID           ObjectId("507f1f77bcf86cd799439011")
=> Date          : Date & time                 ISODate("2025-01-15T10:30:00Z")
=> Array         : List of values              ["JS", "React", "Node"]
=> Object        : Embedded document           { city: "Surat", state: "Gujarat" }
=> Null          : Null value                  null
=> Binary Data   : For files (images, etc.)    BinData(...)
=> Decimal128    : High precision decimal      NumberDecimal("9.99")
=> Timestamp     : Internal MongoDB use        Timestamp(...)
=> RegExp        : Regular expression          /pattern/

@ObjectId (Most Important)
=> 12 bytes = 24 hex characters
=> Auto-generated as _id for every document if not provided
=> Structure: 4 bytes timestamp + 5 bytes random + 3 bytes counter
=> Every document MUST have _id field (MongoDB creates it automatically)
=> You can use custom _id but ObjectId is recommended

-- Example:
{
    _id: ObjectId("507f1f77bcf86cd799439011"),  -- auto generated
    name: "Deep",
    age: 23
}


============================================================================
                     @DATABASE & COLLECTION COMMANDS
============================================================================

@Database Commands
-- Show all databases
show dbs

-- Show current database
db

-- Create / Switch to database (created when first document is inserted)
use myDatabase

-- Drop (delete) current database
db.dropDatabase()

-- Show database stats
db.stats()


@Collection Commands
-- Show all collections in current database
show collections

-- Create collection explicitly
db.createCollection("employees")

-- Create collection with options (validation, capped)
db.createCollection("logs", {
    capped: true,           -- fixed size collection (old data removed when full)
    size: 5242880,          -- max size in bytes (5MB)
    max: 5000               -- max number of documents
})

-- Drop (delete) collection
db.employees.drop()

-- Rename collection
db.employees.renameCollection("staff")


============================================================================
                    @CRUD OPERATIONS (Create, Read, Update, Delete)
============================================================================


-- =======================================================================
-- @INSERT (Create) — DML equivalent
-- =======================================================================

-- Insert single document
db.employees.insertOne({
    name: "Deep Patel",
    age: 23,
    email: "deep@test.com",
    salary: 50000,
    department: "MERN",
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    address: {
        city: "Surat",
        state: "Gujarat",
        pin: 394101
    },
    joining_date: new Date("2024-01-15"),
    isActive: true
})
-- Returns: { acknowledged: true, insertedId: ObjectId("...") }

-- Insert multiple documents
db.employees.insertMany([
    { name: "Neel", age: 22, salary: 45000, department: "MERN" },
    { name: "Ketul", age: 27, salary: 70000, department: "Data Science" },
    { name: "Ujjval", age: 23, salary: 55000, department: "Dot Net" },
    { name: "Jigo", age: 18, salary: 30000, department: "MERN" }
])
-- Returns: { acknowledged: true, insertedIds: { '0': ObjectId(...), '1': ObjectId(...), ... } }

-- Insert with custom _id
db.employees.insertOne({
    _id: "EMP001",
    name: "Deep",
    age: 23
})


-- =======================================================================
-- @SELECT (Read) — DQL equivalent
-- =======================================================================

-- Find ALL documents (like SELECT * FROM employees)
db.employees.find()

-- Find with pretty print (formatted output)
db.employees.find().pretty()

-- Find ONE document (returns first match)
db.employees.findOne({ name: "Deep Patel" })

-- Find by _id
db.employees.findOne({ _id: ObjectId("507f1f77bcf86cd799439011") })


-- @@Projection (SELECT specific columns)
-- 1 = include, 0 = exclude (cannot mix 1 and 0 except for _id)

-- Select only name and salary (like SELECT name, salary FROM employees)
db.employees.find({}, { name: 1, salary: 1 })
-- Output: { _id: ObjectId(...), name: "Deep", salary: 50000 }

-- Exclude _id from result
db.employees.find({}, { name: 1, salary: 1, _id: 0 })
-- Output: { name: "Deep", salary: 50000 }

-- Exclude specific fields (show everything EXCEPT these)
db.employees.find({}, { address: 0, skills: 0 })


-- @@WHERE Clause (Query Filters)

-- Simple equality (like WHERE name = "Deep")
db.employees.find({ name: "Deep Patel" })

-- Multiple conditions (like WHERE department = "MERN" AND age > 20)
db.employees.find({ department: "MERN", age: { $gt: 20 } })


-- @@Query / Comparison Operators

-- $eq  : Equal to (default, can omit)
db.employees.find({ age: { $eq: 23 } })
db.employees.find({ age: 23 })              -- same as above

-- $ne  : Not equal to
db.employees.find({ department: { $ne: "MERN" } })

-- $gt  : Greater than
db.employees.find({ salary: { $gt: 50000 } })

-- $gte : Greater than or equal
db.employees.find({ age: { $gte: 21 } })

-- $lt  : Less than
db.employees.find({ salary: { $lt: 60000 } })

-- $lte : Less than or equal
db.employees.find({ age: { $lte: 25 } })

-- $in  : Matches any value in array (like WHERE city IN ("Surat","Navsari"))
db.employees.find({ department: { $in: ["MERN", "Data Science"] } })

-- $nin : Not in array
db.employees.find({ department: { $nin: ["MERN"] } })

-- $exists : Check if field exists
db.employees.find({ email: { $exists: true } })

-- $type : Check field data type
db.employees.find({ age: { $type: "number" } })

-- $regex : Pattern matching (like LIKE in SQL)
db.employees.find({ name: { $regex: /^Deep/i } })    -- starts with "Deep" (case insensitive)
db.employees.find({ name: { $regex: /patel$/i } })    -- ends with "patel"
db.employees.find({ email: { $regex: /@gmail/ } })    -- contains "@gmail"

-- $size : Array field has specific number of elements
db.employees.find({ skills: { $size: 3 } })

-- $all  : Array contains ALL specified values
db.employees.find({ skills: { $all: ["JavaScript", "React"] } })

-- $elemMatch : At least one array element matches ALL conditions
db.employees.find({
    scores: { $elemMatch: { $gt: 80, $lt: 90 } }
})


-- @@Logical Operators

-- $and : All conditions must be true (AND)
db.employees.find({
    $and: [
        { age: { $gte: 20 } },
        { salary: { $gt: 40000 } },
        { department: "MERN" }
    ]
})
-- Short form (implicit AND — comma separated):
db.employees.find({ age: { $gte: 20 }, salary: { $gt: 40000 } })

-- $or  : Any one condition must be true (OR)
db.employees.find({
    $or: [
        { department: "MERN" },
        { department: "Data Science" }
    ]
})

-- $not : Negates the condition
db.employees.find({
    age: { $not: { $gt: 25 } }
})

-- $nor : None of the conditions should be true
db.employees.find({
    $nor: [
        { department: "MERN" },
        { isActive: false }
    ]
})

-- Combined AND + OR (like WHERE (dept="MERN" OR dept="Data") AND age > 20)
db.employees.find({
    $and: [
        { $or: [{ department: "MERN" }, { department: "Data Science" }] },
        { age: { $gt: 20 } }
    ]
})


-- @@Sorting (like ORDER BY)
-- 1 = ascending, -1 = descending

db.employees.find().sort({ salary: -1 })           -- highest salary first
db.employees.find().sort({ name: 1 })              -- alphabetical by name
db.employees.find().sort({ department: 1, age: -1 }) -- dept asc, then age desc


-- @@Limit & Skip (like LIMIT and OFFSET — for Pagination)

db.employees.find().limit(5)                        -- first 5 documents
db.employees.find().skip(10).limit(5)               -- skip 10, get next 5

-- Pagination formula:
-- Page 1: skip(0).limit(10)
-- Page 2: skip(10).limit(10)
-- Page 3: skip(20).limit(10)
-- Formula: skip( (pageNumber - 1) * pageSize ).limit(pageSize)


-- @@Count Documents

db.employees.countDocuments()                       -- total count
db.employees.countDocuments({ department: "MERN" }) -- count with filter
db.employees.estimatedDocumentCount()               -- faster but approximate


-- @@Distinct Values (like SELECT DISTINCT)

db.employees.distinct("department")
-- Output: ["MERN", "Data Science", "Dot Net"]

db.employees.distinct("city", { salary: { $gt: 50000 } })
-- distinct cities where salary > 50000


-- =======================================================================
-- @UPDATE — DML equivalent
-- =======================================================================

-- @@Update Operators

-- $set     : Set field value (create if not exists)
-- $unset   : Remove field
-- $inc     : Increment/Decrement numeric value
-- $min/$max: Update only if new value is less/greater
-- $mul     : Multiply value
-- $rename  : Rename field
-- $push    : Add element to array
-- $pull    : Remove element from array
-- $addToSet: Add to array only if not already exists
-- $pop     : Remove first (-1) or last (1) element from array
-- $each    : Used with $push/$addToSet for multiple values


-- Update ONE document (first match)
db.employees.updateOne(
    { name: "Deep Patel" },                    -- filter (WHERE)
    { $set: { salary: 60000, city: "Mumbai" } } -- update (SET)
)

-- Update MANY documents
db.employees.updateMany(
    { department: "MERN" },                    -- filter
    { $inc: { salary: 5000 } }                 -- increment salary by 5000
)

-- $set : Set/create fields
db.employees.updateOne(
    { name: "Deep" },
    { $set: { salary: 70000, "address.city": "Mumbai" } }
    -- dot notation for nested fields
)

-- $unset : Remove fields
db.employees.updateOne(
    { name: "Deep" },
    { $unset: { city: "" } }                   -- removes 'city' field entirely
)

-- $inc : Increment (positive) / Decrement (negative)
db.employees.updateOne(
    { name: "Deep" },
    { $inc: { age: 1, salary: -5000 } }        -- age +1, salary -5000
)

-- $mul : Multiply
db.employees.updateOne(
    { name: "Deep" },
    { $mul: { salary: 1.1 } }                  -- 10% raise
)

-- $min / $max : Update only if new value is less/more than current
db.employees.updateOne(
    { name: "Deep" },
    { $min: { salary: 40000 } }                -- set salary to 40000 ONLY if current > 40000
)

-- $rename : Rename a field
db.employees.updateMany(
    {},
    { $rename: { "department": "dept" } }      -- rename field from "department" to "dept"
)

-- @@Array Update Operators

-- $push : Add element to array
db.employees.updateOne(
    { name: "Deep" },
    { $push: { skills: "TypeScript" } }
)

-- $push with $each : Add multiple elements
db.employees.updateOne(
    { name: "Deep" },
    { $push: { skills: { $each: ["Python", "Java", "Go"] } } }
)

-- $addToSet : Add only if NOT already in array (no duplicates)
db.employees.updateOne(
    { name: "Deep" },
    { $addToSet: { skills: "JavaScript" } }    -- won't add if already exists
)

-- $pull : Remove specific value from array
db.employees.updateOne(
    { name: "Deep" },
    { $pull: { skills: "Java" } }              -- removes "Java" from skills array
)

-- $pop : Remove first or last element
db.employees.updateOne(
    { name: "Deep" },
    { $pop: { skills: 1 } }                    -- 1 = remove last, -1 = remove first
)

-- @@Replace document entirely (keeps same _id)
db.employees.replaceOne(
    { name: "Deep" },
    { name: "Deep Patel", age: 24, salary: 80000 }
    -- replaces entire document (all old fields gone)
)

-- @@Upsert (Update or Insert)
-- If filter matches → update, if no match → insert new document
db.employees.updateOne(
    { email: "new@test.com" },
    { $set: { name: "New Employee", salary: 35000 } },
    { upsert: true }                           -- creates if not found
)


-- =======================================================================
-- @DELETE — DML equivalent
-- =======================================================================

-- Delete ONE document (first match)
db.employees.deleteOne({ name: "Jigo" })

-- Delete MANY documents
db.employees.deleteMany({ department: "Dot Net" })

-- Delete ALL documents (like TRUNCATE)
db.employees.deleteMany({})

-- Drop entire collection (like DROP TABLE)
db.employees.drop()


============================================================================
                      @AGGREGATION PIPELINE
============================================================================

-- Aggregation is MongoDB's way of doing GROUP BY, JOINs, computed fields
-- It uses a PIPELINE — data flows through stages, each stage transforms it
-- Syntax: db.collection.aggregate([ stage1, stage2, stage3, ... ])

-- @@Pipeline Stages

-- $match    : Filter documents (like WHERE)
-- $group    : Group documents and apply aggregates (like GROUP BY)
-- $sort     : Sort results (like ORDER BY)
-- $project  : Select/reshape fields (like SELECT columns)
-- $limit    : Limit results
-- $skip     : Skip results
-- $lookup   : Join with another collection (like JOIN)
-- $unwind   : Deconstruct array field into separate documents
-- $count    : Count documents
-- $addFields: Add new computed fields
-- $out      : Write results to new collection
-- $merge    : Merge results into existing collection
-- $bucket   : Group into ranges/buckets
-- $facet    : Multiple aggregation pipelines in parallel


-- @@$match (WHERE equivalent)
db.employees.aggregate([
    { $match: { department: "MERN", age: { $gte: 20 } } }
])


-- @@$group (GROUP BY equivalent)
-- _id field is REQUIRED — defines what to group by

-- Count employees per department
db.employees.aggregate([
    {
        $group: {
            _id: "$department",            -- group by department
            totalEmployees: { $sum: 1 },   -- COUNT(*)
            avgSalary: { $avg: "$salary" },-- AVG(salary)
            maxSalary: { $max: "$salary" },-- MAX(salary)
            minSalary: { $min: "$salary" },-- MIN(salary)
            totalSalary: { $sum: "$salary" }-- SUM(salary)
        }
    }
])
-- Output: { _id: "MERN", totalEmployees: 3, avgSalary: 41666, ... }

-- @@Group Accumulators
-- $sum    : Sum values or count (use 1 for count)
-- $avg    : Average
-- $min    : Minimum
-- $max    : Maximum
-- $first  : First value in group
-- $last   : Last value in group
-- $push   : Add all values to array
-- $addToSet : Add unique values to array


-- @@$project (SELECT specific fields / reshape)
db.employees.aggregate([
    {
        $project: {
            _id: 0,                              -- exclude _id
            employeeName: "$name",                -- rename field
            monthlySalary: { $divide: ["$salary", 12] },  -- computed field
            department: 1                         -- include as-is
        }
    }
])


-- @@$sort (ORDER BY equivalent)
db.employees.aggregate([
    { $sort: { salary: -1 } }                    -- descending by salary
])


-- @@$limit and $skip
db.employees.aggregate([
    { $sort: { salary: -1 } },
    { $skip: 10 },
    { $limit: 5 }
])


-- @@$addFields (add new computed fields without removing existing)
db.employees.aggregate([
    {
        $addFields: {
            experience: { $subtract: [2025, { $year: "$joining_date" }] },
            fullName: { $concat: ["$firstName", " ", "$lastName"] }
        }
    }
])


-- @@$unwind (Deconstruct array into separate documents)
-- If employee has skills: ["JS", "React", "Node"]
-- $unwind creates 3 separate documents, one for each skill

db.employees.aggregate([
    { $unwind: "$skills" }
])
-- Output:
-- { name: "Deep", skills: "JS" }
-- { name: "Deep", skills: "React" }
-- { name: "Deep", skills: "Node" }

-- Practical: Count most popular skills
db.employees.aggregate([
    { $unwind: "$skills" },
    { $group: { _id: "$skills", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
])


-- @@$lookup (JOIN equivalent)
-- Like LEFT OUTER JOIN in SQL

-- employees collection has department_id
-- departments collection has _id, name

db.employees.aggregate([
    {
        $lookup: {
            from: "departments",          -- foreign collection (table to join)
            localField: "department_id",   -- field in employees
            foreignField: "_id",           -- field in departments
            as: "departmentInfo"           -- output array field name
        }
    }
])
-- Output: each employee document gets a "departmentInfo" array with matching department

-- Flatten the lookup result (since $lookup gives array)
db.employees.aggregate([
    {
        $lookup: {
            from: "departments",
            localField: "department_id",
            foreignField: "_id",
            as: "dept"
        }
    },
    { $unwind: "$dept" },                  -- convert array to object
    {
        $project: {
            name: 1,
            salary: 1,
            departmentName: "$dept.name"   -- access joined field
        }
    }
])


-- @@$count
db.employees.aggregate([
    { $match: { salary: { $gt: 50000 } } },
    { $count: "highEarners" }
])
-- Output: { highEarners: 15 }


-- @@$bucket (Group into ranges)
db.employees.aggregate([
    {
        $bucket: {
            groupBy: "$salary",
            boundaries: [0, 30000, 50000, 70000, 100000],  -- ranges
            default: "Other",                                -- for values outside boundaries
            output: {
                count: { $sum: 1 },
                employees: { $push: "$name" }
            }
        }
    }
])


-- @@$facet (Multiple aggregations in parallel)
db.employees.aggregate([
    {
        $facet: {
            "byDepartment": [
                { $group: { _id: "$department", count: { $sum: 1 } } }
            ],
            "salaryStats": [
                { $group: { _id: null, avg: { $avg: "$salary" }, max: { $max: "$salary" } } }
            ],
            "topPaid": [
                { $sort: { salary: -1 } },
                { $limit: 3 },
                { $project: { name: 1, salary: 1 } }
            ]
        }
    }
])


-- @@Complex Aggregation Example
-- Get average salary per department where avg > 50000, sorted descending

db.employees.aggregate([
    { $match: { isActive: true } },                          -- WHERE isActive = true
    {
        $group: {
            _id: "$department",                               -- GROUP BY department
            avgSalary: { $avg: "$salary" },                  -- AVG(salary)
            empCount: { $sum: 1 }                            -- COUNT(*)
        }
    },
    { $match: { avgSalary: { $gt: 50000 } } },              -- HAVING AVG(salary) > 50000
    { $sort: { avgSalary: -1 } },                            -- ORDER BY avgSalary DESC
    { $limit: 10 },                                          -- LIMIT 10
    {
        $project: {
            department: "$_id",                               -- rename _id to department
            avgSalary: { $round: ["$avgSalary", 2] },       -- round to 2 decimals
            empCount: 1,
            _id: 0
        }
    }
])

-- @@Aggregation Expressions (used inside $project, $addFields, $group)

-- Arithmetic: $add, $subtract, $multiply, $divide, $mod, $abs, $ceil, $floor, $round
-- String: $concat, $substr, $toUpper, $toLower, $trim, $split, $strlen
-- Date: $year, $month, $dayOfMonth, $hour, $minute, $second, $dateToString
-- Comparison: $cmp, $eq, $gt, $gte, $lt, $lte, $ne
-- Conditional: $cond (ternary), $ifNull, $switch
-- Array: $size, $arrayElemAt, $filter, $map, $reduce, $in

-- $cond (like IF-ELSE or ternary)
db.employees.aggregate([
    {
        $project: {
            name: 1,
            salaryGrade: {
                $cond: {
                    if: { $gte: ["$salary", 70000] },
                    then: "Senior",
                    else: "Junior"
                }
            }
        }
    }
])

-- $switch (like CASE-WHEN)
db.employees.aggregate([
    {
        $project: {
            name: 1,
            level: {
                $switch: {
                    branches: [
                        { case: { $gte: ["$salary", 80000] }, then: "Senior" },
                        { case: { $gte: ["$salary", 50000] }, then: "Mid" },
                        { case: { $gte: ["$salary", 30000] }, then: "Junior" }
                    ],
                    default: "Intern"
                }
            }
        }
    }
])

-- $dateToString
db.employees.aggregate([
    {
        $project: {
            name: 1,
            joinDate: {
                $dateToString: { format: "%Y-%m-%d", date: "$joining_date" }
            }
        }
    }
])


============================================================================
                         @INDEXES
============================================================================

-- Indexes improve query performance by creating efficient data structures
-- Without index: MongoDB scans every document (Collection Scan — slow)
-- With index: MongoDB uses index to find documents directly (Index Scan — fast)

-- @@Types of Indexes

-- 1. Single Field Index
db.employees.createIndex({ name: 1 })          -- ascending
db.employees.createIndex({ salary: -1 })       -- descending

-- 2. Compound Index (multiple fields)
db.employees.createIndex({ department: 1, salary: -1 })

-- 3. Unique Index (like UNIQUE constraint)
db.employees.createIndex({ email: 1 }, { unique: true })

-- 4. Text Index (for full-text search)
db.employees.createIndex({ name: "text", bio: "text" })
db.employees.find({ $text: { $search: "MERN developer" } })

-- 5. TTL Index (Time-To-Live — auto-delete after time)
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })
-- Documents auto-deleted after 1 hour

-- 6. Partial Index (index only documents matching filter)
db.employees.createIndex(
    { salary: 1 },
    { partialFilterExpression: { isActive: true } }
)

-- @@Index Management
-- View all indexes
db.employees.getIndexes()

-- Drop specific index
db.employees.dropIndex("name_1")

-- Drop all indexes (except _id)
db.employees.dropIndexes()

-- Explain query (see if index is used)
db.employees.find({ name: "Deep" }).explain("executionStats")
-- Look for "IXSCAN" (index scan = good) vs "COLLSCAN" (collection scan = bad)

-- @@Index Best Practices
-- 1. Index fields used in WHERE (find filters), SORT, and JOIN ($lookup)
-- 2. Don't over-index — each index uses memory and slows writes
-- 3. Compound index order matters — put most selective field first
-- 4. Use explain() to verify index is being used
-- 5. _id field is automatically indexed


============================================================================
                    @RELATIONSHIPS (Data Modeling)
============================================================================

-- MongoDB has TWO approaches for relationships:

-- @@1. Embedded Documents (Denormalization) — Data Inside Document
-- Store related data INSIDE the parent document
-- Best for: One-to-One, One-to-Few relationships
-- Pros: Single query fetches all data (fast reads)
-- Cons: Document size limit (16MB), data duplication

{
    _id: ObjectId("..."),
    name: "Deep",
    age: 23,
    address: {                          -- embedded ONE-TO-ONE
        city: "Surat",
        state: "Gujarat",
        pin: 394101
    },
    education: [                        -- embedded ONE-TO-MANY
        { degree: "BCA", year: 2022 },
        { degree: "MCA", year: 2024 }
    ]
}

-- @@2. Referenced Documents (Normalization) — Separate Collections
-- Store reference (_id) to related document in another collection
-- Best for: One-to-Many, Many-to-Many relationships
-- Pros: No duplication, no size issues
-- Cons: Requires $lookup or multiple queries (slower reads)

-- employees collection
{
    _id: ObjectId("emp1"),
    name: "Deep",
    department_id: ObjectId("dept1")    -- reference to departments
}

-- departments collection
{
    _id: ObjectId("dept1"),
    name: "MERN Stack",
    location: "Building A"
}

-- Query with $lookup (JOIN)
db.employees.aggregate([
    {
        $lookup: {
            from: "departments",
            localField: "department_id",
            foreignField: "_id",
            as: "department"
        }
    },
    { $unwind: "$department" }
])

-- @@When to Embed vs Reference?
-- Embed when: Data is accessed together, rarely changes, small size
-- Reference when: Data changes frequently, shared across documents, large size

-- @@Many-to-Many (Junction approach)
-- students_courses collection (like junction table in MySQL)
{
    student_id: ObjectId("student1"),
    course_id: ObjectId("course1"),
    enrolledDate: new Date()
}


============================================================================
                    @SCHEMA VALIDATION
============================================================================

-- MongoDB is schema-less but you CAN enforce validation rules

db.createCollection("employees", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "email", "age"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                email: {
                    bsonType: "string",
                    pattern: "^.+@.+$",
                    description: "must be a valid email"
                },
                age: {
                    bsonType: "int",
                    minimum: 18,
                    maximum: 65,
                    description: "must be between 18 and 65"
                },
                salary: {
                    bsonType: "double",
                    minimum: 0
                },
                department: {
                    enum: ["MERN", "Data Science", "Dot Net", "DevOps"],
                    description: "must be one of the specified values"
                },
                status: {
                    bsonType: "string",
                    enum: ["active", "inactive", "suspended"]
                }
            }
        }
    },
    validationLevel: "strict",       -- strict (default) or moderate
    validationAction: "error"        -- error (default) or warn
})

-- Modify validation on existing collection
db.runCommand({
    collMod: "employees",
    validator: { $jsonSchema: { ... } }
})


============================================================================
                    @TRANSACTIONS
============================================================================

-- MongoDB supports multi-document ACID transactions (from v4.0)
-- Needed when multiple operations must ALL succeed or ALL fail

const session = db.getMongo().startSession();
session.startTransaction();

try {
    db.accounts.updateOne(
        { name: "Deep" },
        { $inc: { balance: -1000 } },
        { session }
    );
    
    db.accounts.updateOne(
        { name: "Neel" },
        { $inc: { balance: 1000 } },
        { session }
    );
    
    session.commitTransaction();     -- COMMIT — save all changes
} catch (error) {
    session.abortTransaction();      -- ROLLBACK — undo all changes
} finally {
    session.endSession();
}


============================================================================
============================================================================
                         @MONGOOSE (MongoDB ORM)
============================================================================
============================================================================

-- Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js
-- Like Sequelize is for MySQL, Mongoose is for MongoDB
-- It provides: Schema definition, Validation, Middleware, Population (JOIN)

-- Install: npm install mongoose


-- =======================================================================
-- @CONNECTION
-- =======================================================================

const mongoose = require('mongoose');
-- or: import mongoose from 'mongoose';

-- Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myDatabase')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('Connection Error:', err));

-- With options
mongoose.connect('mongodb://localhost:27017/myDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

-- Connection with Atlas
mongoose.connect('mongodb+srv://username:password@cluster.mongodb.net/dbName')

-- Connection Events
mongoose.connection.on('connected', () => console.log('Connected'));
mongoose.connection.on('error', (err) => console.log('Error:', err));
mongoose.connection.on('disconnected', () => console.log('Disconnected'));

-- Close connection
mongoose.connection.close();
-- or: mongoose.disconnect();


-- =======================================================================
-- @SCHEMA & MODEL
-- =======================================================================

-- Schema defines the structure/shape of documents in a collection
-- Model is a constructor compiled from Schema — used to create/query documents

const { Schema, model } = require('mongoose');

-- @@Define Schema
const employeeSchema = new Schema(
    -- First argument: Schema definition (fields)
    {
        name: {
            type: String,
            required: [true, 'Name is required'],    -- custom error message
            trim: true,                                -- remove whitespace
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
            uppercase: true,                           -- auto uppercase
        },
        email: {
            type: String,
            required: true,
            unique: true,                              -- unique index
            lowercase: true,                           -- auto lowercase
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],  -- regex validation
            index: true,                               -- create index
        },
        age: {
            type: Number,
            required: true,
            min: [18, 'Must be at least 18'],
            max: [65, 'Must be at most 65'],
        },
        salary: {
            type: Number,
            default: 0,
            validate: {
                validator: function(val) {
                    return val >= 0;
                },
                message: 'Salary cannot be negative'
            }
        },
        department: {
            type: String,
            enum: {
                values: ['MERN', 'Data Science', 'Dot Net', 'DevOps'],
                message: '{VALUE} is not a valid department'
            },
            default: 'MERN'
        },
        skills: {
            type: [String],                            -- array of strings
            default: []
        },
        address: {                                      -- embedded document
            city: String,
            state: String,
            pin: Number
        },
        department_id: {
            type: Schema.Types.ObjectId,                -- reference to another collection
            ref: 'Department',                          -- model name to reference
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        joining_date: {
            type: Date,
            default: Date.now                           -- default current date
        },
        profileImage: {
            type: Buffer                                -- for binary data
        },
        metadata: {
            type: Schema.Types.Mixed                    -- any type (flexible)
        }
    },
    -- Second argument: Schema options
    {
        timestamps: true,               -- auto adds createdAt, updatedAt
        collection: 'employees',         -- explicit collection name
        versionKey: false,              -- disable __v field
        toJSON: { virtuals: true },     -- include virtuals in JSON output
        toObject: { virtuals: true }
    }
);

-- @@Create Model from Schema
const Employee = model('Employee', employeeSchema);
-- 'Employee' → model name, Mongoose auto-creates collection 'employees' (lowercase + plural)

module.exports = Employee;


-- @@Schema Data Types (Mongoose)
-- String, Number, Boolean, Date, Buffer, Schema.Types.ObjectId
-- Schema.Types.Mixed, Array, Map, Schema.Types.Decimal128, BigInt


-- =======================================================================
-- @SCHEMA FEATURES (Virtuals, Methods, Statics, Middleware)
-- =======================================================================

-- @@Virtual Fields (computed fields not stored in DB)
employeeSchema.virtual('info').get(function() {
    return `${this.name} — ${this.department} — ₹${this.salary}`;
});
-- Usage: employee.info → "Deep — MERN — ₹50000"

-- Virtual for reverse population
employeeSchema.virtual('projects', {
    ref: 'Project',              -- model to populate
    localField: '_id',           -- field in this model
    foreignField: 'employee_id'  -- field in Project model
});


-- @@Instance Methods (available on document instances)
employeeSchema.methods.getExperience = function() {
    const years = new Date().getFullYear() - this.joining_date.getFullYear();
    return `${this.name} has ${years} years of experience`;
};
-- Usage: 
-- const emp = await Employee.findById(id);
-- console.log(emp.getExperience());


-- @@Static Methods (available on the Model itself)
employeeSchema.statics.findByDepartment = function(dept) {
    return this.find({ department: dept });
};
-- Usage: 
-- const mernDevs = await Employee.findByDepartment('MERN');


-- @@Query Helpers (chainable custom query methods)
employeeSchema.query.byDepartment = function(dept) {
    return this.where({ department: dept });
};
-- Usage: 
-- const result = await Employee.find().byDepartment('MERN').sort({ salary: -1 });


-- @@Middleware / Hooks (pre and post hooks)
-- Runs before (pre) or after (post) certain operations

-- Pre-save middleware (runs before document.save())
employeeSchema.pre('save', function(next) {
    -- 'this' refers to the document being saved
    if (this.isModified('name')) {
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
    }
    next();
});

-- Post-save middleware
employeeSchema.post('save', function(doc) {
    console.log(`Employee ${doc.name} has been saved`);
});

-- Pre-find middleware (query middleware)
employeeSchema.pre('find', function() {
    -- 'this' refers to the query
    this.where({ isActive: true });  -- always filter active employees
});

-- Pre-findOneAndDelete
employeeSchema.pre('findOneAndDelete', async function() {
    const doc = await this.model.findOne(this.getFilter());
    console.log(`About to delete: ${doc.name}`);
});

-- Available hooks: 
-- Document: validate, save, remove, updateOne, deleteOne, init
-- Query: count, countDocuments, find, findOne, findOneAndDelete, 
--        findOneAndUpdate, update, updateOne, updateMany, deleteOne, deleteMany
-- Aggregate: aggregate
-- Model: insertMany


-- =======================================================================
-- @CRUD OPERATIONS (Mongoose)
-- =======================================================================


-- @@CREATE (Insert)

-- Method 1: create() — builds and saves in one step
const newEmployee = await Employee.create({
    name: "Deep Patel",
    email: "deep@test.com",
    age: 23,
    salary: 50000,
    department: "MERN",
    skills: ["JavaScript", "React", "Node.js"],
    address: { city: "Surat", state: "Gujarat" },
    department_id: "60f7b2c9e8b1a2d3c4e5f6a7"
});

-- Method 2: new Model() + save() — build first, save later
const employee = new Employee({
    name: "Neel",
    email: "neel@test.com",
    age: 22,
    salary: 45000,
    department: "Data Science"
});
-- Can modify before saving
employee.skills.push("Python");
await employee.save();                   -- saves to database

-- Bulk Insert
const employees = await Employee.insertMany([
    { name: "Ketul", email: "ketul@test.com", age: 27, salary: 70000 },
    { name: "Ujjval", email: "ujjval@test.com", age: 23, salary: 55000 },
    { name: "Jigo", email: "jigo@test.com", age: 18, salary: 30000 }
]);


-- @@READ (Select / Find)

-- Find all
const allEmployees = await Employee.find();

-- Find with filter (WHERE)
const mernDevs = await Employee.find({ department: "MERN" });

-- Find one (first match)
const emp = await Employee.findOne({ email: "deep@test.com" });

-- Find by ID
const empById = await Employee.findById("60f7b2c9e8b1a2d3c4e5f6a7");

-- @@Projection (select specific fields)
const names = await Employee.find({}, 'name email salary');
-- or using select()
const names2 = await Employee.find().select('name email salary');
-- Exclude fields
const noAddress = await Employee.find().select('-address -skills');

-- @@Filtering with operators
const filtered = await Employee.find({
    age: { $gte: 20, $lte: 30 },
    department: { $in: ["MERN", "Data Science"] },
    salary: { $gt: 40000 }
});

-- @@Sorting
const sorted = await Employee.find().sort({ salary: -1 });           -- descending
const sorted2 = await Employee.find().sort({ department: 1, age: -1 }); -- multi-sort
const sorted3 = await Employee.find().sort('-salary name');           -- string syntax

-- @@Pagination (limit + skip)
const page = 2;
const pageSize = 10;
const paginated = await Employee.find()
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .sort({ createdAt: -1 });

-- @@Count
const total = await Employee.countDocuments({ department: "MERN" });

-- @@Distinct
const departments = await Employee.distinct('department');

-- @@Chaining (combine multiple query methods)
const result = await Employee.find({ isActive: true })
    .select('name salary department')
    .where('age').gte(20).lte(30)
    .sort('-salary')
    .skip(0)
    .limit(10)
    .lean();                             -- returns plain JS objects (faster, no Mongoose features)

-- @@exists
const hasEmail = await Employee.exists({ email: "deep@test.com" });
-- Returns { _id: ObjectId } if exists, null if not


-- @@UPDATE

-- Update one document
const updated = await Employee.updateOne(
    { email: "deep@test.com" },          -- filter
    { $set: { salary: 60000 } }          -- update
);

-- Update many documents
await Employee.updateMany(
    { department: "MERN" },
    { $inc: { salary: 5000 } }
);

-- Find, update, and return the UPDATED document
const updatedDoc = await Employee.findOneAndUpdate(
    { email: "deep@test.com" },
    { $set: { salary: 70000, "address.city": "Mumbai" } },
    { 
        new: true,                        -- return updated doc (default: returns old)
        runValidators: true               -- run schema validations on update
    }
);

-- Find by ID and update
const updatedById = await Employee.findByIdAndUpdate(
    "60f7b2c9e8b1a2d3c4e5f6a7",
    { $set: { salary: 75000 } },
    { new: true, runValidators: true }
);

-- @@Upsert
const upserted = await Employee.updateOne(
    { email: "new@test.com" },
    { $set: { name: "New Employee", salary: 35000 } },
    { upsert: true }
);


-- @@DELETE

-- Delete one
await Employee.deleteOne({ email: "jigo@test.com" });

-- Delete many
await Employee.deleteMany({ isActive: false });

-- Find and delete (returns the deleted document)
const deleted = await Employee.findOneAndDelete({ email: "old@test.com" });

-- Find by ID and delete
const deletedById = await Employee.findByIdAndDelete("60f7b2c9e8b1a2d3c4e5f6a7");


-- =======================================================================
-- @POPULATE (JOIN equivalent in Mongoose)
-- =======================================================================

-- populate() replaces ObjectId references with actual documents from other collection
-- Like SQL JOIN but happens at application level

-- @@Setup (Two schemas with reference)

-- Department Schema
const departmentSchema = new Schema({
    name: String,
    location: String
});
const Department = model('Department', departmentSchema);

-- Employee Schema (references Department)
const employeeSchema = new Schema({
    name: String,
    salary: Number,
    department_id: {
        type: Schema.Types.ObjectId,
        ref: 'Department'                    -- reference Department model
    }
});
const Employee = model('Employee', employeeSchema);


-- @@Basic Populate
const employees = await Employee.find()
    .populate('department_id');
-- Instead of ObjectId, you get the full department document

-- Output without populate:
-- { name: "Deep", department_id: ObjectId("abc123") }

-- Output with populate:
-- { name: "Deep", department_id: { _id: "abc123", name: "MERN", location: "Building A" } }


-- @@Selective Populate (only specific fields)
const emps = await Employee.find()
    .populate('department_id', 'name location');   -- only name and location from department
    -- or
    .populate({ path: 'department_id', select: 'name location' });


-- @@Nested Populate
const result = await Employee.find()
    .populate({
        path: 'department_id',
        populate: {
            path: 'manager_id',               -- populate inside populate
            select: 'name email'
        }
    });


-- @@Multiple Populates
const full = await Employee.find()
    .populate('department_id')
    .populate('project_id')
    .populate('manager_id');
    -- or
    .populate(['department_id', 'project_id', 'manager_id']);


-- @@Populate with conditions
const filtered = await Employee.find()
    .populate({
        path: 'department_id',
        match: { isActive: true },            -- only populate if department is active
        select: 'name'
    });


-- =======================================================================
-- @AGGREGATION (Mongoose)
-- =======================================================================

-- Same as MongoDB aggregation but through Mongoose model

const stats = await Employee.aggregate([
    { $match: { isActive: true } },
    {
        $group: {
            _id: '$department',
            avgSalary: { $avg: '$salary' },
            count: { $sum: 1 }
        }
    },
    { $sort: { avgSalary: -1 } }
]);

-- With $lookup (JOIN in aggregation)
const joined = await Employee.aggregate([
    {
        $lookup: {
            from: 'departments',              -- actual collection name (lowercase, plural)
            localField: 'department_id',
            foreignField: '_id',
            as: 'department'
        }
    },
    { $unwind: '$department' },
    {
        $project: {
            name: 1,
            salary: 1,
            departmentName: '$department.name'
        }
    }
]);


-- =======================================================================
-- @MIDDLEWARE PATTERNS (Common Real-World Use Cases)
-- =======================================================================

-- @@Password Hashing (before save)
const bcrypt = require('bcryptjs');

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

-- @@Compare Password (instance method)
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

-- @@Cascade Delete (delete related documents)
employeeSchema.pre('findOneAndDelete', async function(next) {
    const empId = this.getFilter()._id;
    await Project.deleteMany({ employee_id: empId });
    next();
});

-- @@Auto-populate
employeeSchema.pre(/^find/, function(next) {
    this.populate('department_id', 'name');
    next();
});

-- @@Soft Delete Pattern
employeeSchema.add({
    deletedAt: { type: Date, default: null }
});

employeeSchema.pre(/^find/, function(next) {
    this.where({ deletedAt: null });
    next();
});

employeeSchema.methods.softDelete = function() {
    this.deletedAt = new Date();
    return this.save();
};


-- =======================================================================
-- @ERROR HANDLING (Mongoose)
-- =======================================================================

try {
    const emp = await Employee.create({ name: "", email: "invalid" });
} catch (error) {
    if (error.name === 'ValidationError') {
        -- Validation error
        for (let field in error.errors) {
            console.log(`${field}: ${error.errors[field].message}`);
        }
    } else if (error.code === 11000) {
        -- Duplicate key error (unique constraint violation)
        console.log('Duplicate value:', error.keyValue);
    } else if (error.name === 'CastError') {
        -- Invalid ObjectId format
        console.log('Invalid ID format');
    }
}


-- =======================================================================
-- @USEFUL PATTERNS
-- =======================================================================

-- @@Lean queries (for read-only, faster)
const fast = await Employee.find().lean();
-- Returns plain JS objects, not Mongoose documents
-- Cannot use .save(), virtuals, methods on lean results
-- 5-10x faster for large queries

-- @@Select vs Projection
-- Both do the same thing:
await Employee.find({}, 'name email');          -- projection as 2nd arg
await Employee.find().select('name email');      -- select method
await Employee.find().select({ name: 1, email: 1, _id: 0 }); -- object syntax

-- @@Bulk Operations
await Employee.bulkWrite([
    {
        insertOne: {
            document: { name: "New", email: "new@test.com", age: 25 }
        }
    },
    {
        updateOne: {
            filter: { email: "deep@test.com" },
            update: { $set: { salary: 80000 } }
        }
    },
    {
        deleteOne: {
            filter: { email: "old@test.com" }
        }
    }
]);


============================================================================
                  @COMPARISON: MySQL/Sequelize vs MongoDB/Mongoose
============================================================================

-- @@CRUD Comparison

-- INSERT
-- MySQL:     INSERT INTO employees (name, age) VALUES ("Deep", 23)
-- Sequelize: Employee.create({ name: "Deep", age: 23 })
-- MongoDB:   db.employees.insertOne({ name: "Deep", age: 23 })
-- Mongoose:  Employee.create({ name: "Deep", age: 23 })

-- SELECT ALL
-- MySQL:     SELECT * FROM employees
-- Sequelize: Employee.findAll()
-- MongoDB:   db.employees.find()
-- Mongoose:  Employee.find()

-- SELECT WITH WHERE
-- MySQL:     SELECT name, salary FROM employees WHERE age > 20 AND dept = "MERN"
-- Sequelize: Employee.findAll({ attributes: ['name','salary'], where: { age: {[Op.gt]:20}, dept: "MERN" } })
-- MongoDB:   db.employees.find({ age: {$gt:20}, dept: "MERN" }, { name:1, salary:1 })
-- Mongoose:  Employee.find({ age: {$gt:20}, dept: "MERN" }).select('name salary')

-- UPDATE
-- MySQL:     UPDATE employees SET salary = 60000 WHERE name = "Deep"
-- Sequelize: Employee.update({ salary: 60000 }, { where: { name: "Deep" } })
-- MongoDB:   db.employees.updateOne({ name: "Deep" }, { $set: { salary: 60000 } })
-- Mongoose:  Employee.findOneAndUpdate({ name: "Deep" }, { salary: 60000 }, { new: true })

-- DELETE
-- MySQL:     DELETE FROM employees WHERE name = "Deep"
-- Sequelize: Employee.destroy({ where: { name: "Deep" } })
-- MongoDB:   db.employees.deleteOne({ name: "Deep" })
-- Mongoose:  Employee.findOneAndDelete({ name: "Deep" })

-- JOIN
-- MySQL:     SELECT * FROM employees e JOIN departments d ON e.dept_id = d.id
-- Sequelize: Employee.findAll({ include: { model: Department } })
-- MongoDB:   db.employees.aggregate([{ $lookup: { from: "departments", ... } }])
-- Mongoose:  Employee.find().populate('department_id')

-- GROUP BY
-- MySQL:     SELECT dept, COUNT(*) FROM employees GROUP BY dept
-- Sequelize: Employee.findAll({ attributes: ['dept', [fn('COUNT','*'),'count']], group: 'dept' })
-- MongoDB:   db.employees.aggregate([{ $group: { _id: "$dept", count: { $sum: 1 } } }])
-- Mongoose:  Employee.aggregate([{ $group: { _id: "$dept", count: { $sum: 1 } } }])

-- PAGINATION
-- MySQL:     SELECT * FROM employees LIMIT 10 OFFSET 20
-- Sequelize: Employee.findAll({ limit: 10, offset: 20 })
-- MongoDB:   db.employees.find().skip(20).limit(10)
-- Mongoose:  Employee.find().skip(20).limit(10)


============================================================================
                    @OPERATOR COMPARISON
============================================================================

-- Comparison
-- SQL:     =, !=, >, >=, <, <=
-- Sequelize: Op.eq, Op.ne, Op.gt, Op.gte, Op.lt, Op.lte
-- MongoDB: $eq, $ne, $gt, $gte, $lt, $lte

-- Logical
-- SQL:     AND, OR, NOT
-- Sequelize: Op.and, Op.or, Op.not
-- MongoDB: $and, $or, $not, $nor

-- Range
-- SQL:     BETWEEN, IN, NOT IN
-- Sequelize: Op.between, Op.in, Op.notIn
-- MongoDB: $in, $nin, { $gte: min, $lte: max }

-- Pattern
-- SQL:     LIKE '%dev%'
-- Sequelize: Op.like
-- MongoDB: $regex: /dev/i

-- Null Check
-- SQL:     IS NULL, IS NOT NULL
-- Sequelize: Op.is (null)
-- MongoDB: { $exists: true/false }, { field: null }


============================================================================
                    @MONGODB SHELL QUICK COMMANDS
============================================================================

-- Show databases
show dbs

-- Switch database
use mydb

-- Show collections
show collections

-- Insert
db.collection.insertOne({})
db.collection.insertMany([{},{}])

-- Find
db.collection.find({filter}, {projection})
db.collection.findOne({filter})

-- Update
db.collection.updateOne({filter}, {$set: {}})
db.collection.updateMany({filter}, {$set: {}})
db.collection.replaceOne({filter}, {newDoc})

-- Delete
db.collection.deleteOne({filter})
db.collection.deleteMany({filter})

-- Aggregation
db.collection.aggregate([stages])

-- Index
db.collection.createIndex({field: 1})
db.collection.getIndexes()
db.collection.dropIndex("indexName")

-- Count
db.collection.countDocuments({filter})

-- Distinct
db.collection.distinct("field")

-- Explain
db.collection.find({}).explain("executionStats")

*/