export default function handler(req, res) {
    if (req.method === 'POST') {
        const db = getDb()
        const { title, body, userId } = req.body
        const stmt = db.prepare('INSERT INTO posts (title, body, userId) VALUES (?, ?, ?)')
        const info = stmt.run(title, body, userId)
        res.status(200).json(info)
    } if (req.method === 'GET') {
        const page = parseInt(req.query.page) || 1; // Default 1
        const limit = parseInt(req.query.limit) || 10; // Default 10
        const offset = (page - 1) * limit;

        const db = getDb()
        const posts = db.prepare('SELECT * FROM posts LIMIT ? OFFSET ?').all(limit, offset);
        res.status(200).json(posts)

    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
