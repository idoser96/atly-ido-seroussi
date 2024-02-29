import {getDb} from "@/db/db";


export default function handler(req, res) {
    if (req.method === 'GET') {
        // clear posts and users tables
        const db = getDb()
        db.prepare('DELETE FROM posts').run()
        db.prepare('DELETE FROM users').run()
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

}