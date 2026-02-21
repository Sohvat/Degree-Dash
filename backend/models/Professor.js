// backend/models/Professor.js
const { runAsync, getAsync, allAsync } = require('../config/database');

class Professor {
    /**
     * Find all professors
     */
    static async findAll(filters = {}) {
        try {
            let sql = 'SELECT * FROM professors WHERE 1=1';
            const params = [];

            if (filters.department) {
                sql += ' AND department = ?';
                params.push(filters.department);
            }

            if (filters.search) {
                sql += ' AND (name LIKE ? OR department LIKE ?)';
                const searchTerm = `%${filters.search}%`;
                params.push(searchTerm, searchTerm);
            }

            sql += ' ORDER BY name';
            return await allAsync(sql, params);
        } catch (error) {
            console.error('Error finding professors:', error);
            throw error;
        }
    }

    /**
     * Find professor by ID
     */
    static async findById(id) {
        try {
            const sql = 'SELECT * FROM professors WHERE id = ?';
            return await getAsync(sql, [id]);
        } catch (error) {
            console.error('Error finding professor by ID:', error);
            throw error;
        }
    }

    /**
     * Find professor by name
     */
    static async findByName(name) {
        try {
            const sql = 'SELECT * FROM professors WHERE name = ?';
            return await getAsync(sql, [name]);
        } catch (error) {
            console.error('Error finding professor by name:', error);
            throw error;
        }
    }

    /**
     * Create a new professor
     */
    static async create(professorData) {
        try {
            const { name, department, email, office } = professorData;

            const sql = `
                INSERT INTO professors (name, department, email, office)
                VALUES (?, ?, ?, ?)
            `;

            const result = await runAsync(sql, [name, department, email, office]);
            return await this.findById(result.id);
        } catch (error) {
            console.error('Error creating professor:', error);
            throw error;
        }
    }

    /**
     * Update professor
     */
    static async update(id, professorData) {
        try {
            const { name, department, email, office } = professorData;

            const sql = `
                UPDATE professors 
                SET name = ?, department = ?, email = ?, office = ?
                WHERE id = ?
            `;

            await runAsync(sql, [name, department, email, office, id]);
            return await this.findById(id);
        } catch (error) {
            console.error('Error updating professor:', error);
            throw error;
        }
    }

    /**
     * Delete professor
     */
    static async delete(id) {
        try {
            // Check if professor is linked to any courses
            const courseCheck = await getAsync(
                'SELECT COUNT(*) as count FROM course_professors WHERE professor_id = ?',
                [id]
            );

            if (courseCheck.count > 0) {
                throw new Error('Cannot delete professor who is teaching courses');
            }

            const sql = 'DELETE FROM professors WHERE id = ?';
            const result = await runAsync(sql, [id]);
            return result.changes > 0;
        } catch (error) {
            console.error('Error deleting professor:', error);
            throw error;
        }
    }

    /**
     * Get courses taught by professor
     */
    static async getCourses(professorId) {
        try {
            const sql = `
                SELECT c.*, cp.role
                FROM courses c
                JOIN course_professors cp ON c.id = cp.course_id
                WHERE cp.professor_id = ?
                ORDER BY c.year DESC, c.semester
            `;
            return await allAsync(sql, [professorId]);
        } catch (error) {
            console.error('Error getting professor courses:', error);
            throw error;
        }
    }

    /**
     * Get professor statistics
     */
    static async getStats() {
        try {
            const stats = await getAsync(`
                SELECT 
                    COUNT(*) as total_professors,
                    COUNT(DISTINCT department) as total_departments,
                    AVG(course_count) as avg_courses_per_professor
                FROM professors p
                LEFT JOIN (
                    SELECT professor_id, COUNT(*) as course_count
                    FROM course_professors
                    GROUP BY professor_id
                ) cp ON p.id = cp.professor_id
            `);
            return stats;
        } catch (error) {
            console.error('Error getting professor stats:', error);
            throw error;
        }
    }
}

module.exports = Professor;
