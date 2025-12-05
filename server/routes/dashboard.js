const express = require('express');
const {getDatabase} = require('../database/init');
const {authenticateToken} = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// Get dashboard statistics
router.get('/stats', (req, res) => {
    try {
        const db = getDatabase();

        const providers = db.get('providers').value() || [];
        const validationJobs = db.get('validation_jobs').value() || [];

        // Total providers
        const total_providers = providers.length;

        // Active providers
        const active_providers = providers.filter(p => p.is_active).length;

        // Average quality score
        const avg_quality = providers.length > 0
            ? providers.reduce((sum, p) => sum + (p.data_quality_score || 0), 0) / providers.length
            : 0;

        // Total validation jobs
        const total_jobs = validationJobs.length;

        // Recent validation jobs (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recent_jobs = validationJobs.filter(j => new Date(j.created_at) >= thirtyDaysAgo).length;

        // Jobs by status
        const jobsByStatus = {};
        validationJobs.forEach(job => {
            jobsByStatus[job.status] = (jobsByStatus[job.status] || 0) + 1;
        });

        // Quality score distribution
        const qualityDistribution = [
            {quality_range: 'High (80-100)', count: providers.filter(p => p.data_quality_score >= 80).length},
            {
                quality_range: 'Medium (60-79)',
                count: providers.filter(p => p.data_quality_score >= 60 && p.data_quality_score < 80).length
            },
            {
                quality_range: 'Low (40-59)',
                count: providers.filter(p => p.data_quality_score >= 40 && p.data_quality_score < 60).length
            },
            {quality_range: 'Very Low (0-39)', count: providers.filter(p => p.data_quality_score < 40).length}
        ];

        // Top specialties
        const specialtyCounts = {};
        providers.forEach(p => {
            if (p.specialty) {
                specialtyCounts[p.specialty] = (specialtyCounts[p.specialty] || 0) + 1;
            }
        });
        const topSpecialties = Object.entries(specialtyCounts)
            .map(([specialty, count]) => ({specialty, count}))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Providers by state
        const stateCounts = {};
        providers.forEach(p => {
            if (p.state) {
                stateCounts[p.state] = (stateCounts[p.state] || 0) + 1;
            }
        });
        const providersByState = Object.entries(stateCounts)
            .map(([state, count]) => ({state, count}))
            .sort((a, b) => b.count - a.count)
            .slice(0, 15);

        res.json({
            totalProviders: total_providers,
            activeProviders: active_providers,
            averageQualityScore: Math.round(avg_quality || 0),
            totalValidationJobs: total_jobs,
            recentValidationJobs: recent_jobs,
            jobsByStatus: Object.entries(jobsByStatus).map(([status, count]) => ({status, count})),
            qualityDistribution,
            topSpecialties,
            providersByState
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({error: {message: 'Failed to fetch statistics', status: 500}});
    }
});

// Get recent activity
router.get('/recent-activity', (req, res) => {
    try {
        const db = getDatabase();
        const limit = parseInt(req.query.limit) || 20;

        const auditLogs = db.get('audit_logs').value() || [];
        const users = db.get('users').value() || [];

        const activities = auditLogs
            .map(log => {
                const user = users.find(u => u.id === log.user_id);
                return {
                    ...log,
                    user_name: user ? user.name : 'Unknown',
                    user_email: user ? user.email : 'Unknown'
                };
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, limit);

        res.json({activities});
    } catch (error) {
        console.error('Recent activity error:', error);
        res.status(500).json({error: {message: 'Failed to fetch recent activity', status: 500}});
    }
});

module.exports = router;
