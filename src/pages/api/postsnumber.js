import { getDb } from "@/db/db";
import {getPostsNumber, setPostsNumber} from "@/db/cache";

export default function handler(req, res) {
    if (req.method === 'GET') {
        const cachedNumber = getPostsNumber();
        if (cachedNumber !== undefined) {
            res.status(200).json(cachedNumber);
            return;
        }
        const db = getDb()
        const posts = db.prepare('SELECT COUNT(*) AS count FROM posts').get()
        setPostsNumber(posts.count)
        res.status(200).json(posts.count)

    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
