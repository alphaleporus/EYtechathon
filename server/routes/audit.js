const express = require('express');
const {getDatabase} = require('../database/init');
const {authenticateToken} = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// Get audit logs
router.get('/logs', (req, res) => {
    try {
        const db = getDatabase();
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const action = req.query.action || '';
        const entityType = req.query.entity_type || '';

        let auditLogs = db.get('audit_logs').value() || [];
        const users = db.get('users').value() || [];

        // Apply filters
        if (action) {
            auditLogs = auditLogs.filter(log => log.action === action);
        }

        if (entityType) {
            auditLogs = auditLogs.filter(log => log.entity_type === entityType);
        }

        const total = auditLogs.length;
        const totalPages = Math.ceil(total / limit);
        const offset = (page - 1) * limit;

        // Sort by created_at descending and paginate
        const logs = auditLogs
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(offset, offset + limit)
            .map(log => {
                const user = users.find(u => u.id === log.user_id);
                return {
                    ...log,
                    user_name: user ? user.name : 'Unknown',
                    user_email: user ? user.email : 'Unknown'
                };
            });

        res.json({
            logs,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('Get audit logs error:', error);
        res.status(500).json({error: {message: 'Failed to fetch audit logs', status: 500}});
    }
});

// Get audit log detail
router.get('/logs/:id', (req, res) => {
    try {
        const db = getDatabase();
        const log = db.get('audit_logs').find({id: req.params.id}).value();

        if (!log) {
            return res.status(404).json({error: {message: 'Audit log not found', status: 404}});
        }

        const users = db.get('users').value() || [];
        const user = users.find(u => u.id === log.user_id);

        const logWithUser = {
            ...log,
            user_name: user ? user.name : 'Unknown',
            user_email: user ? user.email : 'Unknown'
        };

        // Parse JSON fields
        if (logWithUser.old_value) {
            try {
                logWithUser.old_value = JSON.parse(logWithUser.old_value);
            } catch (e) {
                // Keep as string if not valid JSON
            }
        }

        if (logWithUser.new_value) {
            try {
                logWithUser.new_value = JSON.parse(logWithUser.new_value);
            } catch (e) {
                // Keep as string if not valid JSON
            }
        }

        res.json({log: logWithUser});
    } catch (error) {
        console.error('Get audit log detail error:', error);
        res.status(500).json({error: {message: 'Failed to fetch audit log', status: 500}});
    }
});

module.exports = router;
