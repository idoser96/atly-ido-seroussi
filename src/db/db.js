import Database from 'better-sqlite3'
let db;

function getDb() {
    if (!db) {
        db = new Database('atly.db');
        // Init tables
        db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT UNIQUE
            );
        `);

// Create Posts Table
        db.exec(`
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                userId INTEGER,
                FOREIGN KEY (userId) REFERENCES users(id)
            );
`);
    }
    return db;
}

module.exports = { getDb };
