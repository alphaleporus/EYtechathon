const express = require('express');
const {v4: uuidv4} = require('uuid');
const {getDatabase} = require('../database/init');
const {authenticateToken} = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();
router.use(authenticateToken);

// Validation schema
const providerSchema = Joi.object({
    npi: Joi.string().length(10).allow('', null),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    specialty: Joi.string().allow('', null),
    phone: Joi.string().allow('', null),
    email: Joi.string().email().allow('', null),
    address_line1: Joi.string().allow('', null),
    address_line2: Joi.string().allow('', null),
    city: Joi.string().allow('', null),
    state: Joi.string().max(2).allow('', null),
    zip_code: Joi.string().allow('', null),
    license_number: Joi.string().allow('', null),
    license_state: Joi.string().max(2).allow('', null),
    license_expiry: Joi.string().allow('', null),
    credential: Joi.string().allow('', null),
    taxonomy_code: Joi.string().allow('', null),
    is_active: Joi.boolean(),
});

// Get all providers with pagination and filtering
router.get('/', (req, res) => {
    try {
        const db = getDatabase();
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1000; // Default to 1000 to get all providers
        const search = req.query.search || '';
        const specialty = req.query.specialty || '';
        const state = req.query.state || '';

        let providers = db.get('providers').value() || [];

        // Apply filters
        if (search) {
            const searchLower = search.toLowerCase();
            providers = providers.filter(p =>
                p.first_name.toLowerCase().includes(searchLower) ||
                p.last_name.toLowerCase().includes(searchLower) ||
                (p.npi && p.npi.includes(search)) ||
                (p.email && p.email.toLowerCase().includes(searchLower))
            );
        }

        if (specialty) {
            providers = providers.filter(p =>
                p.specialty && p.specialty.toLowerCase().includes(specialty.toLowerCase())
            );
        }

        if (state) {
            providers = providers.filter(p => p.state === state);
        }

        const total = providers.length;
        const totalPages = Math.ceil(total / limit);
        const offset = (page - 1) * limit;

        console.log(`[Providers API] Total in DB: ${total}, Page: ${page}, Limit: ${limit}, Offset: ${offset}`);

        providers = providers.slice(offset, offset + limit);

        console.log(`[Providers API] Returning ${providers.length} providers`);

        res.json({
            providers,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('Get providers error:', error);
        res.status(500).json({error: {message: 'Failed to fetch providers', status: 500}});
    }
});

// Get provider by ID
router.get('/:id', (req, res) => {
    try {
        const db = getDatabase();
        const provider = db.get('providers').find({id: req.params.id}).value();

        if (!provider) {
            return res.status(404).json({error: {message: 'Provider not found', status: 404}});
        }

        res.json({provider});
    } catch (error) {
        console.error('Get provider error:', error);
        res.status(500).json({error: {message: 'Failed to fetch provider', status: 500}});
    }
});

// Create provider
router.post('/', (req, res) => {
    try {
        const {error, value} = providerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({error: {message: error.details[0].message, status: 400}});
        }

        const db = getDatabase();
        const providerId = uuidv4();

        // Calculate data quality score
        const qualityScore = calculateQualityScore(value);

        const newProvider = {
            id: providerId,
            ...value,
            is_active: value.is_active !== false,
            data_quality_score: qualityScore,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: req.user.id,
            updated_by: req.user.id
        };

        db.get('providers').push(newProvider).write();

        // Log audit
        logAudit(db, req.user.id, 'CREATE', 'provider', providerId, null, newProvider, req.ip);

        res.status(201).json({
            message: 'Provider created successfully',
            provider: newProvider
        });
    } catch (error) {
        console.error('Create provider error:', error);
        res.status(500).json({error: {message: 'Failed to create provider', status: 500}});
    }
});

// Update provider
router.put('/:id', (req, res) => {
    try {
        const {error, value} = providerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({error: {message: error.details[0].message, status: 400}});
        }

        const db = getDatabase();
        const oldProvider = db.get('providers').find({id: req.params.id}).value();

        if (!oldProvider) {
            return res.status(404).json({error: {message: 'Provider not found', status: 404}});
        }

        const qualityScore = calculateQualityScore(value);

        const updatedProvider = {
            ...oldProvider,
            ...value,
            is_active: value.is_active !== false,
            data_quality_score: qualityScore,
            updated_at: new Date().toISOString(),
            updated_by: req.user.id
        };

        db.get('providers')
            .find({id: req.params.id})
            .assign(updatedProvider)
            .write();

        // Log audit
        logAudit(db, req.user.id, 'UPDATE', 'provider', req.params.id, oldProvider, updatedProvider, req.ip);

        res.json({
            message: 'Provider updated successfully',
            provider: updatedProvider
        });
    } catch (error) {
        console.error('Update provider error:', error);
        res.status(500).json({error: {message: 'Failed to update provider', status: 500}});
    }
});

// Delete provider
router.delete('/:id', (req, res) => {
    try {
        const db = getDatabase();
        const provider = db.get('providers').find({id: req.params.id}).value();

        if (!provider) {
            return res.status(404).json({error: {message: 'Provider not found', status: 404}});
        }

        db.get('providers').remove({id: req.params.id}).write();

        // Log audit
        logAudit(db, req.user.id, 'DELETE', 'provider', req.params.id, provider, null, req.ip);

        res.json({message: 'Provider deleted successfully'});
    } catch (error) {
        console.error('Delete provider error:', error);
        res.status(500).json({error: {message: 'Failed to delete provider', status: 500}});
    }
});

// Helper functions
function calculateQualityScore(provider) {
    const fields = [
        'npi', 'first_name', 'last_name', 'specialty', 'phone', 'email',
        'address_line1', 'city', 'state', 'zip_code', 'license_number',
        'license_state', 'credential', 'taxonomy_code'
    ];

    const filledFields = fields.filter(field => provider[field] && provider[field].toString().trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
}

function logAudit(db, userId, action, entityType, entityId, oldValue, newValue, ipAddress) {
    try {
        const auditLog = {
            id: uuidv4(),
            user_id: userId,
            action,
            entity_type: entityType,
            entity_id: entityId,
            old_value: oldValue ? JSON.stringify(oldValue) : null,
            new_value: newValue ? JSON.stringify(newValue) : null,
            ip_address: ipAddress,
            created_at: new Date().toISOString()
        };

        db.get('audit_logs').push(auditLog).write();
    } catch (error) {
        console.error('Audit log error:', error);
    }
}

module.exports = router;
