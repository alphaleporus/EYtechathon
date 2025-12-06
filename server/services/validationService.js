const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');

// Approved specialties list
const APPROVED_SPECIALTIES = [
    'Cardiology',
    'Internal Medicine',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'Neurology',
    'Oncology',
    'Psychiatry',
    'Radiology',
    'Anesthesiology',
    'Emergency Medicine',
    'Family Medicine',
    'Obstetrics and Gynecology',
    'Ophthalmology',
    'Pathology',
    'Physical Medicine and Rehabilitation',
    'Surgery',
    'Urology'
];

// Indian State codes
const INDIAN_STATES = [
    'AN', // Andaman and Nicobar Islands
    'AP', // Andhra Pradesh
    'AR', // Arunachal Pradesh
    'AS', // Assam
    'BR', // Bihar
    'CH', // Chandigarh
    'CG', // Chhattisgarh
    'DN', // Dadra and Nagar Haveli and Daman and Diu
    'DL', // Delhi
    'GA', // Goa
    'GJ', // Gujarat
    'HR', // Haryana
    'HP', // Himachal Pradesh
    'JK', // Jammu and Kashmir
    'JH', // Jharkhand
    'KA', // Karnataka
    'KL', // Kerala
    'LA', // Ladakh
    'LD', // Lakshadweep
    'MP', // Madhya Pradesh
    'MH', // Maharashtra
    'MN', // Manipur
    'ML', // Meghalaya
    'MZ', // Mizoram
    'NL', // Nagaland
    'OD', // Odisha
    'PY', // Puducherry
    'PB', // Punjab
    'RJ', // Rajasthan
    'SK', // Sikkim
    'TN', // Tamil Nadu
    'TS', // Telangana
    'TR', // Tripura
    'UP', // Uttar Pradesh
    'UK', // Uttarakhand
    'WB'  // West Bengal
];

class ValidationService {
    // Validate NPI (National Provider Identifier)
    validateNPI(npi) {
        const errors = [];
        const warnings = [];

        if (!npi) {
            errors.push('NPI is required');
            return {valid: false, errors, warnings};
        }

        const npiStr = String(npi).trim();

        // Must be exactly 10 digits
        if (!/^\d{10}$/.test(npiStr)) {
            errors.push('NPI must be exactly 10 digits');
            return {
                valid: false,
                errors,
                warnings,
                suggested: npiStr.replace(/\D/g, '').padStart(10, '0').slice(0, 10)
            };
        }

        return {valid: true, errors, warnings};
    }

    // Validate Email
    validateEmail(email) {
        const errors = [];
        const warnings = [];

        if (!email) {
            errors.push('Email is required');
            return {valid: false, errors, warnings};
        }

        const emailStr = String(email).trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(emailStr)) {
            errors.push('Invalid email format');
            return {valid: false, errors, warnings, suggested: emailStr.replace(/\s/g, '')};
        }

        return {valid: true, errors, warnings};
    }

    // Validate Phone (Indian format)
    validatePhone(phone) {
        const errors = [];
        const warnings = [];

        if (!phone) {
            errors.push('Phone is required');
            return {valid: false, errors, warnings};
        }

        const phoneStr = String(phone).trim();
        // Indian phone format: +91-XXXXX-XXXXX or +91 XXXXX XXXXX or variations
        const phoneRegex = /^\+91[\s-]?\d{5}[\s-]?\d{5}$/;

        if (!phoneRegex.test(phoneStr)) {
            // Try to format the phone number
            const digits = phoneStr.replace(/\D/g, '');

            // Check if it's a valid 10-digit Indian number
            if (digits.length === 10 && digits[0] >= '6' && digits[0] <= '9') {
                const suggested = `+91-${digits.slice(0, 5)}-${digits.slice(5)}`;
                warnings.push('Phone format should be +91-XXXXX-XXXXX');
                return {valid: true, errors, warnings, suggested};
            }
            // Check if it has country code
            else if (digits.length === 12 && digits.startsWith('91')) {
                const suggested = `+91-${digits.slice(2, 7)}-${digits.slice(7)}`;
                warnings.push('Phone format should be +91-XXXXX-XXXXX');
                return {valid: true, errors, warnings, suggested};
            } else {
                errors.push('Invalid Indian phone number format');
                return {valid: false, errors, warnings};
            }
        }

        return {valid: true, errors, warnings};
    }

    // Validate Specialty
    validateSpecialty(specialty) {
        const errors = [];
        const warnings = [];

        if (!specialty) {
            errors.push('Specialty is required');
            return {valid: false, errors, warnings};
        }

        const specialtyStr = String(specialty).trim();

        // Check if specialty is in approved list (case-insensitive)
        const isApproved = APPROVED_SPECIALTIES.some(
            approved => approved.toLowerCase() === specialtyStr.toLowerCase()
        );

        if (!isApproved) {
            // Find closest match
            const suggested = APPROVED_SPECIALTIES.find(
                approved => approved.toLowerCase().includes(specialtyStr.toLowerCase()) ||
                    specialtyStr.toLowerCase().includes(approved.toLowerCase())
            ) || 'Internal Medicine';

            errors.push('Specialty not found in approved list');
            return {valid: false, errors, warnings, suggested};
        }

        return {valid: true, errors, warnings};
    }

    // Validate State Code (Indian states)
    validateState(state) {
        const errors = [];
        const warnings = [];

        if (!state) {
            errors.push('State is required');
            return {valid: false, errors, warnings};
        }

        const stateStr = String(state).trim().toUpperCase();

        if (stateStr.length !== 2) {
            errors.push('State code must be 2 letters');
            return {valid: false, errors, warnings, suggested: stateStr.slice(0, 2)};
        }

        if (!INDIAN_STATES.includes(stateStr)) {
            errors.push('Invalid Indian state code');
            return {valid: false, errors, warnings};
        }

        return {valid: true, errors, warnings};
    }

    // Validate Quality Score
    validateQualityScore(score) {
        const errors = [];
        const warnings = [];

        if (score === null || score === undefined || score === '') {
            errors.push('Quality score is required');
            return {valid: false, errors, warnings};
        }

        const numScore = Number(score);

        if (isNaN(numScore)) {
            errors.push('Quality score must be a number');
            return {valid: false, errors, warnings};
        }

        if (numScore < 0 || numScore > 100) {
            errors.push('Quality score must be between 0 and 100');
            return {valid: false, errors, warnings, suggested: Math.max(0, Math.min(100, numScore))};
        }

        if (numScore < 40) {
            warnings.push('Very low quality score - please verify');
        }

        return {valid: true, errors, warnings};
    }

    // Validate Name
    validateName(name) {
        const errors = [];
        const warnings = [];

        if (!name) {
            errors.push('Name is required');
            return {valid: false, errors, warnings};
        }

        const nameStr = String(name).trim();

        if (nameStr.length < 3) {
            errors.push('Name must be at least 3 characters');
            return {valid: false, errors, warnings};
        }

        return {valid: true, errors, warnings};
    }

    // Validate a single provider record
    validateRecord(record, rowNumber) {
        const fieldValidations = {
            npi: this.validateNPI(record.npi),
            name: this.validateName(record.name),
            email: this.validateEmail(record.email),
            phone: this.validatePhone(record.phone),
            specialty: this.validateSpecialty(record.specialty),
            license_state: this.validateState(record.license_state || record.state),
            quality_score: this.validateQualityScore(record.quality_score || record.qualityScore)
        };

        const recordErrors = [];
        const recordWarnings = [];

        // Collect all errors and warnings
        Object.entries(fieldValidations).forEach(([field, result]) => {
            if (result.errors.length > 0) {
                result.errors.forEach(error => {
                    recordErrors.push({
                        row: rowNumber,
                        field: field,
                        message: error,
                        current: record[field] || record[field.replace('_', '')],
                        suggested: result.suggested || ''
                    });
                });
            }

            if (result.warnings.length > 0) {
                result.warnings.forEach(warning => {
                    recordWarnings.push({
                        row: rowNumber,
                        field: field,
                        message: warning,
                        current: record[field] || record[field.replace('_', '')],
                        suggested: result.suggested || ''
                    });
                });
            }
        });

        return {
            isValid: recordErrors.length === 0,
            hasWarnings: recordWarnings.length > 0,
            errors: recordErrors,
            warnings: recordWarnings
        };
    }

    // Parse CSV file
    async parseCSV(filePath) {
        return new Promise((resolve, reject) => {
            const records = [];

            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => records.push(data))
                .on('end', () => resolve(records))
                .on('error', reject);
        });
    }

    // Parse XLSX file
    async parseXLSX(filePath) {
        try {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const records = XLSX.utils.sheet_to_json(worksheet);
            return records;
        } catch (error) {
            throw new Error(`Failed to parse XLSX file: ${error.message}`);
        }
    }

    // Main validation function
    async validateFile(filePath, fileType) {
        try {
            // Parse the file
            let records;
            if (fileType === 'csv') {
                records = await this.parseCSV(filePath);
            } else if (fileType === 'xlsx') {
                records = await this.parseXLSX(filePath);
            } else {
                throw new Error('Unsupported file type');
            }

            // Validate each record
            const validRecords = [];
            const invalidRecords = [];
            const allErrors = [];
            const allWarnings = [];
            const warningRecords = new Set();
            const allRecordsWithValidation = [];

            records.forEach((record, index) => {
                const rowNumber = index + 2; // +2 because row 1 is header, index starts at 0
                const validation = this.validateRecord(record, rowNumber);

                const recordWithValidation = {
                    row: rowNumber,
                    npi: record.npi,
                    name: record.name,
                    email: record.email,
                    phone: record.phone,
                    specialty: record.specialty,
                    license_state: record.license_state || record.state,
                    quality_score: record.quality_score || record.qualityScore,
                    isValid: validation.isValid,
                    errors: validation.errors,
                    warnings: validation.warnings
                };

                allRecordsWithValidation.push(recordWithValidation);

                if (validation.isValid) {
                    validRecords.push(record);
                } else {
                    invalidRecords.push(record);
                }

                if (validation.warnings.length > 0) {
                    warningRecords.add(rowNumber);
                }

                allErrors.push(...validation.errors);
                allWarnings.push(...validation.warnings);
            });

            return {
                totalRecords: records.length,
                validRecords: validRecords.length,
                invalidRecords: invalidRecords.length,
                warningRecords: warningRecords.size,
                errors: allErrors,
                warnings: allWarnings,
                allRecords: allRecordsWithValidation // Changed from parsedRecords to allRecords
            };
        } catch (error) {
            throw new Error(`Validation failed: ${error.message}`);
        }
    }
}

module.exports = new ValidationService();
