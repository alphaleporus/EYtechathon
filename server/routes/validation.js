const express = require('express');
const multer = require('multer');
const {v4: uuidv4} = require('uuid');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const {getDatabase} = require('../database/init');
const {authenticateToken} = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = process.env.UPLOAD_DIR || './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, {recursive: true});
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: {fileSize: 10 * 1024 * 1024}, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.csv', '.xlsx', '.xls'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV and Excel files are allowed'));
        }
    }
});

// Upload and validate file
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({error: {message: 'No file uploaded', status: 400}});
        }

        const db = getDatabase();
        const jobId = uuidv4();

        // Create validation job
        const validationJob = {
            id: jobId,
            file_name: req.file.originalname,
            file_path: req.file.path,
            status: 'pending',
            total_records: 0,
            valid_records: 0,
            invalid_records: 0,
            warnings_count: 0,
            created_at: new Date().toISOString(),
            created_by: req.user.id
        };

        db.get('validation_jobs').push(validationJob).write();

        // Start validation process asynchronously
        processValidation(jobId, req.file.path, req.user.id).catch(error => {
            console.error('Validation processing error:', error);
        });

        res.json({
            message: 'File uploaded successfully. Validation started.',
            jobId,
            fileName: req.file.originalname
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({error: {message: error.message || 'Upload failed', status: 500}});
    }
});

// Get validation job status
router.get('/status/:jobId', (req, res) => {
    try {
        const db = getDatabase();
        const job = db.get('validation_jobs').find({id: req.params.jobId}).value();

        if (!job) {
            return res.status(404).json({error: {message: 'Validation job not found', status: 404}});
        }

        res.json({job});
    } catch (error) {
        console.error('Get status error:', error);
        res.status(500).json({error: {message: 'Failed to fetch status', status: 500}});
    }
});

// Get validation report
router.get('/report/:jobId', (req, res) => {
    try {
        const db = getDatabase();
        const job = db.get('validation_jobs').find({id: req.params.jobId}).value();

        if (!job) {
            return res.status(404).json({error: {message: 'Validation job not found', status: 404}});
        }

        const errors = db.get('validation_errors')
            .filter({job_id: req.params.jobId})
            .sortBy('row_number')
            .value();

        res.json({job, errors});
    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({error: {message: 'Failed to fetch report', status: 500}});
    }
});

// Helper function to process validation
async function processValidation(jobId, filePath, userId) {
    const db = getDatabase();

    try {
        // Update job status
        db.get('validation_jobs')
            .find({id: jobId})
            .assign({status: 'processing', started_at: new Date().toISOString()})
            .write();

        // Parse file
        const records = await parseFile(filePath);
        const totalRecords = records.length;

        let validRecords = 0;
        let invalidRecords = 0;
        let warningsCount = 0;

        // Validate each record
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            const rowNumber = i + 2; // +2 because row 1 is header and we start from 0
            const errors = validateRecord(record);

            if (errors.length > 0) {
                invalidRecords++;

                // Store errors
                errors.forEach(error => {
                    const errorRecord = {
                        id: uuidv4(),
                        job_id: jobId,
                        row_number: rowNumber,
                        field_name: error.field,
                        error_type: error.type,
                        error_message: error.message,
                        current_value: error.currentValue,
                        suggested_value: error.suggestedValue,
                        created_at: new Date().toISOString()
                    };

                    db.get('validation_errors').push(errorRecord).write();

                    if (error.type === 'warning') {
                        warningsCount++;
                    }
                });
            } else {
                validRecords++;

                // Import valid record as provider
                try {
                    const providerId = uuidv4();
                    const qualityScore = calculateQualityScore(record);

                    const newProvider = {
                        id: providerId,
                        npi: record.npi || null,
                        first_name: record.first_name,
                        last_name: record.last_name,
                        specialty: record.specialty || null,
                        phone: record.phone || null,
                        email: record.email || null,
                        address_line1: record.address_line1 || null,
                        address_line2: record.address_line2 || null,
                        city: record.city || null,
                        state: record.state || null,
                        zip_code: record.zip_code || null,
                        license_number: record.license_number || null,
                        license_state: record.license_state || null,
                        license_expiry: record.license_expiry || null,
                        credential: record.credential || null,
                        taxonomy_code: record.taxonomy_code || null,
                        is_active: true,
                        data_quality_score: qualityScore,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        created_by: userId,
                        updated_by: userId
                    };

                    db.get('providers').push(newProvider).write();
                } catch (dbError) {
                    console.error('Error importing provider:', dbError);
                    invalidRecords++;
                    validRecords--;
                }
            }
        }

        // Update job completion
        db.get('validation_jobs')
            .find({id: jobId})
            .assign({
                status: 'completed',
                completed_at: new Date().toISOString(),
                total_records: totalRecords,
                valid_records: validRecords,
                invalid_records: invalidRecords,
                warnings_count: warningsCount
            })
            .write();

    } catch (error) {
        console.error('Validation processing error:', error);

        // Update job as failed
        db.get('validation_jobs')
            .find({id: jobId})
            .assign({status: 'failed', completed_at: new Date().toISOString()})
            .write();
    }
}

// Parse CSV or Excel file
async function parseFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.csv') {
        return parseCSV(filePath);
    } else if (ext === '.xlsx' || ext === '.xls') {
        return parseExcel(filePath);
    }

    throw new Error('Unsupported file format');
}

function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const records = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => records.push(normalizeKeys(row)))
            .on('end', () => resolve(records))
            .on('error', reject);
    });
}

function parseExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const records = XLSX.utils.sheet_to_json(worksheet);
    return records.map(normalizeKeys);
}

// Normalize object keys to lowercase with underscores
function normalizeKeys(obj) {
    const normalized = {};
    for (const key in obj) {
        const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
        normalized[normalizedKey] = obj[key];
    }
    return normalized;
}

// Validate a single record
function validateRecord(record) {
    const errors = [];

    // Required fields
    if (!record.first_name || record.first_name.trim() === '') {
        errors.push({
            field: 'first_name',
            type: 'error',
            message: 'First name is required',
            currentValue: record.first_name,
            suggestedValue: null
        });
    }

    if (!record.last_name || record.last_name.trim() === '') {
        errors.push({
            field: 'last_name',
            type: 'error',
            message: 'Last name is required',
            currentValue: record.last_name,
            suggestedValue: null
        });
    }

    // NPI validation (10 digits)
    if (record.npi && !/^\d{10}$/.test(record.npi)) {
        errors.push({
            field: 'npi',
            type: 'error',
            message: 'NPI must be exactly 10 digits',
            currentValue: record.npi,
            suggestedValue: null
        });
    }

    // Email validation
    if (record.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) {
        errors.push({
            field: 'email',
            type: 'error',
            message: 'Invalid email format',
            currentValue: record.email,
            suggestedValue: null
        });
    }

    // Phone validation (basic)
    if (record.phone && !/^\+?[\d\s\-()]+$/.test(record.phone)) {
        errors.push({
            field: 'phone',
            type: 'warning',
            message: 'Phone number format may be invalid',
            currentValue: record.phone,
            suggestedValue: null
        });
    }

    // Zip code validation (5 or 9 digits)
    if (record.zip_code && !/^\d{5}(-\d{4})?$/.test(record.zip_code)) {
        errors.push({
            field: 'zip_code',
            type: 'error',
            message: 'Zip code must be 5 or 9 digits (XXXXX or XXXXX-XXXX)',
            currentValue: record.zip_code,
            suggestedValue: null
        });
    }

    // State validation (2 letters)
    if (record.state && !/^[A-Z]{2}$/i.test(record.state)) {
        errors.push({
            field: 'state',
            type: 'error',
            message: 'State must be 2-letter code (e.g., CA, NY)',
            currentValue: record.state,
            suggestedValue: record.state ? record.state.toUpperCase().substring(0, 2) : null
        });
    }

    // License state validation
    if (record.license_state && !/^[A-Z]{2}$/i.test(record.license_state)) {
        errors.push({
            field: 'license_state',
            type: 'error',
            message: 'License state must be 2-letter code',
            currentValue: record.license_state,
            suggestedValue: record.license_state ? record.license_state.toUpperCase().substring(0, 2) : null
        });
    }

    // Data completeness warnings
    const importantFields = ['specialty', 'phone', 'email', 'city', 'state'];
    const missingFields = importantFields.filter(field => !record[field] || record[field].trim() === '');

    if (missingFields.length > 0) {
        errors.push({
            field: 'completeness',
            type: 'warning',
            message: `Missing recommended fields: ${missingFields.join(', ')}`,
            currentValue: null,
            suggestedValue: null
        });
    }

    return errors;
}

function calculateQualityScore(provider) {
    const fields = [
        'npi', 'first_name', 'last_name', 'specialty', 'phone', 'email',
        'address_line1', 'city', 'state', 'zip_code', 'license_number',
        'license_state', 'credential', 'taxonomy_code'
    ];

    const filledFields = fields.filter(field => provider[field] && provider[field].toString().trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
}

module.exports = router;
