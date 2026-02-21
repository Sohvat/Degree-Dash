// init-new-db.js
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Path to your new database
const dbPath = path.join(__dirname, 'DegreeDashDatabase_new.db');
console.log('Creating new database at:', dbPath);

// Complete schema for Microsoft Authentication with multiple professor support and user types
const schema = `
-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- Users table with student/alumni/faculty support
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    microsoft_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    user_type TEXT DEFAULT 'current' CHECK (user_type IN ('current', 'alumni')),
    graduation_year INTEGER,
    major TEXT,
    enrollment_year INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Courses table (removed instructor field since we have course_professors)
CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT UNIQUE NOT NULL,
    course_name TEXT NOT NULL,
    department TEXT NOT NULL,
    credits INTEGER NOT NULL DEFAULT 3,
    description TEXT,
    prerequisites TEXT,
    schedule TEXT,
    semester TEXT,
    year INTEGER,
    capacity INTEGER DEFAULT 30,
    enrolled INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Professors table
CREATE TABLE professors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department TEXT,
    email TEXT,
    office TEXT,
    bio TEXT,
    website TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, department)
);

-- Junction table for courses and professors (many-to-many)
CREATE TABLE course_professors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    professor_id INTEGER NOT NULL,
    role TEXT DEFAULT 'Instructor',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (professor_id) REFERENCES professors(id) ON DELETE CASCADE,
    UNIQUE(course_id, professor_id)
);

-- Enrollments table (tracks which students are in which courses)
CREATE TABLE enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'dropped', 'completed', 'auditing')),
    grade TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(user_id, course_id)
);

-- Alumni network table (for alumni-specific features)
CREATE TABLE alumni_network (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    current_employer TEXT,
    job_title TEXT,
    industry TEXT,
    location TEXT,
    linkedin_url TEXT,
    mentorship_available BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reviews table
CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    professor_id INTEGER,
    semester_taken TEXT,
    year_taken INTEGER,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5),
    comment TEXT,
    would_recommend BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (professor_id) REFERENCES professors(id) ON DELETE SET NULL,
    UNIQUE(user_id, course_id, professor_id, semester_taken, year_taken)
);

-- Indexes for performance
CREATE INDEX idx_users_microsoft ON users(microsoft_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_users_graduation ON users(graduation_year);
CREATE INDEX idx_users_major ON users(major);
CREATE INDEX idx_courses_code ON courses(course_code);
CREATE INDEX idx_courses_department ON courses(department);
CREATE INDEX idx_courses_semester ON courses(semester, year);
CREATE INDEX idx_course_professors_course ON course_professors(course_id);
CREATE INDEX idx_course_professors_professor ON course_professors(professor_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_reviews_course ON reviews(course_id);
CREATE INDEX idx_reviews_professor ON reviews(professor_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_professors_name ON professors(name);
CREATE INDEX idx_professors_department ON professors(department);
CREATE INDEX idx_alumni_industry ON alumni_network(industry);
CREATE INDEX idx_alumni_mentorship ON alumni_network(mentorship_available);

-- View for course statistics (updated to show multiple professors)
CREATE VIEW course_stats AS
SELECT 
    c.id,
    c.course_code,
    c.course_name,
    c.department,
    c.credits,
    c.capacity,
    c.enrolled,
    (c.capacity - c.enrolled) as seats_available,
    c.schedule,
    c.semester,
    c.year,
    GROUP_CONCAT(DISTINCT p.name, ', ') as instructors,
    COUNT(DISTINCT cp.professor_id) as instructor_count,
    COUNT(DISTINCT r.id) as review_count,
    AVG(r.rating) as avg_rating,
    AVG(r.difficulty) as avg_difficulty,
    SUM(CASE WHEN r.would_recommend THEN 1 ELSE 0 END) * 1.0 / NULLIF(COUNT(r.id), 0) as recommend_rate
FROM courses c
LEFT JOIN course_professors cp ON c.id = cp.course_id
LEFT JOIN professors p ON cp.professor_id = p.id
LEFT JOIN reviews r ON c.id = r.course_id
GROUP BY c.id;

-- View for course details with professor list
CREATE VIEW course_details AS
SELECT 
    c.*,
    GROUP_CONCAT(DISTINCT p.name, ', ') as instructors,
    COUNT(DISTINCT cp.professor_id) as instructor_count
FROM courses c
LEFT JOIN course_professors cp ON c.id = cp.course_id
LEFT JOIN professors p ON cp.professor_id = p.id
GROUP BY c.id;

-- View for user enrollment details
CREATE VIEW user_enrollments AS
SELECT 
    u.id as user_id,
    u.email,
    u.name,
    u.user_type,
    u.graduation_year,
    u.major,
    c.id as course_id,
    c.course_code,
    c.course_name,
    c.department,
    e.enrolled_at,
    e.status,
    e.grade
FROM users u
JOIN enrollments e ON u.id = e.user_id
JOIN courses c ON e.course_id = c.id;

-- View for alumni directory
CREATE VIEW alumni_directory AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.graduation_year,
    u.major,
    a.current_employer,
    a.job_title,
    a.industry,
    a.location,
    a.mentorship_available
FROM users u
LEFT JOIN alumni_network a ON u.id = a.user_id
WHERE u.user_type = 'alumni'
ORDER BY u.graduation_year DESC, u.name;

-- View for user statistics by type
CREATE VIEW user_stats AS
SELECT 
    user_type,
    COUNT(*) as user_count,
    COUNT(DISTINCT major) as majors_count,
    MIN(graduation_year) as earliest_graduation,
    MAX(graduation_year) as latest_graduation,
    AVG(graduation_year) as avg_graduation_year
FROM users
WHERE user_type IS NOT NULL
GROUP BY user_type;

-- View for alumni statistics
CREATE VIEW alumni_stats AS
SELECT 
    COUNT(*) as total_alumni,
    COUNT(DISTINCT major) as distinct_majors,
    COUNT(DISTINCT graduation_year) as graduation_years,
    SUM(CASE WHEN mentorship_available = 1 THEN 1 ELSE 0 END) as mentors_available,
    AVG(graduation_year) as avg_graduation_year,
    GROUP_CONCAT(DISTINCT industry) as industries
FROM users u
LEFT JOIN alumni_network a ON u.id = a.user_id
WHERE u.user_type = 'alumni';
`;

// Delete old database if it exists
try {
    if (fs.existsSync(dbPath)) {
        console.log('Old database found, removing it...');
        fs.unlinkSync(dbPath);
        console.log('Old database removed');
    }
} catch (err) {
    console.log('Could not remove old database:', err.message);
}

// Create new database and run schema
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error creating database:', err.message);
        return;
    }
    console.log(' New database file created successfully');
    
    // Execute schema
    db.exec(schema, (err) => {
        if (err) {
            console.error(' Error creating schema:', err);
        } else {
            console.log(' Database schema created successfully!');
            console.log('\n Tables created:');
            console.log('  - users (with user_type, graduation_year, major)');
            console.log('  - courses');
            console.log('  - professors');
            console.log('  - course_professors (enables multiple professors per course)');
            console.log('  - enrollments');
            console.log('  - alumni_network (for alumni-specific data)');
            console.log('  - reviews');
            console.log('\n Views created:');
            console.log('  - course_stats (shows all professors)');
            console.log('  - course_details');
            console.log('  - user_enrollments');
            console.log('  - alumni_directory');
            console.log('  - user_stats');
            console.log('  - alumni_stats');
        }
    
        // Verify tables were created
        db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
            if (err) {
                console.error(' Error verifying tables:', err);
            } else {
                console.log('\n Verified tables in database:');
                tables.forEach(table => {
                    console.log('   - ' + table.name);
                });
            }
            
            // Show counts of indexes
            db.all("SELECT name FROM sqlite_master WHERE type='index'", (err, indexes) => {
                if (err) {
                    console.error('Error verifying indexes:', err);
                } else {
                    console.log(`\n Created ${indexes.length} indexes for performance`);
                }
                
                // Show counts of views
                db.all("SELECT name FROM sqlite_master WHERE type='view'", (err, views) => {
                    if (err) {
                        console.error('Error verifying views:', err);
                    } else {
                        console.log(` Created ${views.length} views:`);
                        views.forEach(view => {
                            console.log('   - ' + view.name);
                        });
                    }
                    
                    // Close database
                    db.close((err) => {
                        if (err) {
                            console.error(' Error closing database:', err);
                        } else {
                            console.log('\n Database initialization complete!');
                            console.log(' Next step: Run node seed-new.js to add sample data');
                            console.log('   This will create users of different types (current, alumni, faculty)');
                        }
                    });
                });
            });
        });
    });
});
