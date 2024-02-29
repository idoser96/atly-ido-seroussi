import { getDb } from "@/db/db";
import {getPostsCache, getPostsNumber, setPostsCache, setPostsNumber} from "@/db/cache"

const addUserIfNotExists = (userUuid) => {
    const db = getDb()
    // Check if the user exists
    const userCheckStmt = db.prepare('SELECT id FROM users WHERE uuid = ?');
    const userExists = userCheckStmt.get(userUuid);

    // If the user doesn't exist, create a new user
    if (!userExists) {
        const insertUserStmt = db.prepare('INSERT INTO users (uuid) VALUES (?)');
        insertUserStmt.run(userUuid);
    }
}

export default function handler(req, res) {
    if (req.method === 'POST') {
        const db = getDb()
        const { title, body, userUuid } = req.body

        addUserIfNotExists(userUuid)

        const stmt = db.prepare('INSERT INTO posts (title, body, userUuid) VALUES (?, ?, ?)')
        const info = stmt.run(title, body, userUuid)

        const cachedNumber = getPostsNumber();
        if (cachedNumber !== undefined) {
            setPostsNumber(cachedNumber + 1);
        }

        res.status(200).json(info)
    } if (req.method === 'GET') {
        const page = parseInt(req.query.page) || 1; // Default 1
        const limit = parseInt(req.query.limit) || 10; // Default 10
        const offset = (page - 1) * limit;

        const db = getDb()
        const posts = db.prepare('SELECT * FROM posts LIMIT ? OFFSET ?').all(limit, offset);
        res.status(200).json(posts)

    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
