import { getDb } from "@/db/db";

const TOP_CREATORS_AMOUNT = 2

export default function handler(req, res) {
    if (req.method === 'GET') {
        const db = getDb()
        const topCreators = db.prepare(`
            SELECT userUuid, COUNT(*) as posts FROM posts 
            GROUP BY userUuid ORDER BY posts DESC LIMIT ?
            `)
            .all(TOP_CREATORS_AMOUNT);
        res.status(200).json(topCreators)

    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
