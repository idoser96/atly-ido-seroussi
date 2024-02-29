import { getDb } from "@/db/db";

const TOP_CREATORS_AMOUNT = 2

export default function handler(req, res) {
    if (req.method === 'GET') {
        // This is very slow when there are many posts
        // An option to make it faster is to calculate it real time and cache it
        // But it will be a bit more complex and outside the time of this task
        const db = getDb()
        const topCreators = db.prepare(`
            SELECT userUuid, COUNT(*) as posts FROM posts 
            GROUP BY userUuid ORDER BY posts DESC LIMIT ?
            `)
            .all(TOP_CREATORS_AMOUNT);
        res.status(200).json(topCreators)

    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
