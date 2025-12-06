const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const validationService = require('../services/validationService');
const {authenticateToken} = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'validation-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['.csv', '.xlsx', '.xls'];
        const ext = path.extname(file.originalname).toLowerCase();

        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV and XLSX files are allowed'));
        }
    }
});

// Upload and validate file
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        const filePath = req.file.path;
        const fileExt = path.extname(req.file.originalname).toLowerCase();
        const fileType = fileExt === '.csv' ? 'csv' : 'xlsx';

        // Validate the file using validation service
        const validationResult = await validationService.validateFile(filePath, fileType);

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        // Save validation result to database (optional)
        // You can store this in your database for audit purposes

        res.json({
            success: true,
            message: 'File validated successfully',
            filename: req.file.originalname,
            data: validationResult
        });

    } catch (error) {
        // Clean up file if exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get approved specialties list
router.get('/specialties', authenticateToken, (req, res) => {
    const specialties = [
        'Cardiology', 'Internal Medicine', 'Pediatrics', 'Orthopedics',
        'Dermatology', 'Neurology', 'Oncology', 'Psychiatry',
        'Radiology', 'Anesthesiology', 'Emergency Medicine',
        'Family Medicine', 'Obstetrics and Gynecology', 'Ophthalmology',
        'Pathology', 'Physical Medicine and Rehabilitation', 'Surgery', 'Urology'
    ];
    res.json({
        success: true,
        specialties
    });
});

// Get valid state codes (Indian states)
router.get('/states', authenticateToken, (req, res) => {
    const states = [
        {code: 'AN', name: 'Andaman and Nicobar Islands'},
        {code: 'AP', name: 'Andhra Pradesh'},
        {code: 'AR', name: 'Arunachal Pradesh'},
        {code: 'AS', name: 'Assam'},
        {code: 'BR', name: 'Bihar'},
        {code: 'CH', name: 'Chandigarh'},
        {code: 'CG', name: 'Chhattisgarh'},
        {code: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu'},
        {code: 'DL', name: 'Delhi'},
        {code: 'GA', name: 'Goa'},
        {code: 'GJ', name: 'Gujarat'},
        {code: 'HR', name: 'Haryana'},
        {code: 'HP', name: 'Himachal Pradesh'},
        {code: 'JK', name: 'Jammu and Kashmir'},
        {code: 'JH', name: 'Jharkhand'},
        {code: 'KA', name: 'Karnataka'},
        {code: 'KL', name: 'Kerala'},
        {code: 'LA', name: 'Ladakh'},
        {code: 'LD', name: 'Lakshadweep'},
        {code: 'MP', name: 'Madhya Pradesh'},
        {code: 'MH', name: 'Maharashtra'},
        {code: 'MN', name: 'Manipur'},
        {code: 'ML', name: 'Meghalaya'},
        {code: 'MZ', name: 'Mizoram'},
        {code: 'NL', name: 'Nagaland'},
        {code: 'OD', name: 'Odisha'},
        {code: 'PY', name: 'Puducherry'},
        {code: 'PB', name: 'Punjab'},
        {code: 'RJ', name: 'Rajasthan'},
        {code: 'SK', name: 'Sikkim'},
        {code: 'TN', name: 'Tamil Nadu'},
        {code: 'TS', name: 'Telangana'},
        {code: 'TR', name: 'Tripura'},
        {code: 'UP', name: 'Uttar Pradesh'},
        {code: 'UK', name: 'Uttarakhand'},
        {code: 'WB', name: 'West Bengal'}
    ];
    res.json({
        success: true,
        states
    });
});

// Get validation template (Indian format)
router.get('/template', authenticateToken, (req, res) => {
    const template = {
        fields: [
            {name: 'npi', type: 'string', required: true, format: '10 digits'},
            {name: 'name', type: 'string', required: true, minLength: 3},
            {name: 'email', type: 'string', required: true, format: 'email'},
            {name: 'phone', type: 'string', required: true, format: '+91-XXXXX-XXXXX'},
            {name: 'specialty', type: 'string', required: true},
            {name: 'license_state', type: 'string', required: true, format: '2 letter Indian state code'},
            {name: 'quality_score', type: 'number', required: true, min: 0, max: 100}
        ],
        example: {
            npi: '1234567890',
            name: 'Dr. Rajesh Kumar',
            email: 'rajesh.kumar@apollohospital.com',
            phone: '+91-98765-43210',
            specialty: 'Cardiology',
            license_state: 'MH',
            quality_score: 92
        }
    };

    res.json({
        success: true,
        template
    });
});

module.exports = router;
