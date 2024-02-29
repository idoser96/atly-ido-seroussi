import Database from 'better-sqlite3'
let db;

function getDb() {
    if (!db) {
        db = new Database('atly.db');
        db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT UNIQUE
            );
        `);
        db.exec(`
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                userUuid TEXT,
                FOREIGN KEY (userUuid) REFERENCES users(uuid)
            );
`);
    }
    return db;
}

module.exports = { getDb };
