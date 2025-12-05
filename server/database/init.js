const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const DB_PATH = process.env.DB_PATH || './database.json';
const adapter = new FileSync(DB_PATH);
const db = low(adapter);

function initializeDatabase() {
    // Set default structure
    db.defaults({
        users: [],
        providers: [],
        validation_jobs: [],
        validation_errors: [],
        audit_logs: []
    }).write();

    console.log('✅ Database initialized successfully');
}

function getDatabase() {
    return db;
}

module.exports = {getDatabase, initializeDatabase};
