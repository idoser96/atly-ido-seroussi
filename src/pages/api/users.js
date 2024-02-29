import { getDb } from "@/db/db";

// DEBUGGING ONLY

export default function handler(req, res) {
    if (req.method === 'GET') {
        const db = getDb()
        const users = db.prepare('SELECT * FROM users').all()
        res.status(200).json(users)

    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
