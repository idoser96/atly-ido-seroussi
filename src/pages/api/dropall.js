import {getDb} from "@/db/db";
import {clearAllCaches} from "@/db/cache";

// USED FOR TESTING PURPOSES ONLY

export default function handler(req, res) {
    if (req.method === 'GET') {
        // clear posts and users tables
        const db = getDb()
        db.prepare('DELETE FROM posts').run()
        db.prepare('DELETE FROM users').run()
        clearAllCaches()
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

}