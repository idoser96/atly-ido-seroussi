import {getDb} from "@/db/db";
import {getPostsNumber, getRuntimeCache, setPostsNumber, setRuntimeCache} from "@/db/cache"

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

const cacheRuntime = (cacheName, func) => {
    const runtimeCache = getRuntimeCache(cacheName);
    let currentTimeSum = 0
    let currentTimeCount = 0
    if (runtimeCache) {
        currentTimeSum = runtimeCache.runtimeSum
        currentTimeCount = runtimeCache.runtimeCount
    }
    const start = performance.now()
    const result = func()
    const end = performance.now()

    const runtime = end - start
    setRuntimeCache(cacheName, {
        runtimeSum: currentTimeSum + runtime,
        runtimeCount: currentTimeCount + 1
    })
    return result
}

export default function handler(req, res) {
    if (req.method === 'POST') {
        const result = cacheRuntime('createPost', () => {
            const db = getDb()
            const {title, body, userUuid} = req.body

            addUserIfNotExists(userUuid)

            const stmt = db.prepare('INSERT INTO posts (title, body, userUuid) VALUES (?, ?, ?)')
            const info = stmt.run(title, body, userUuid)

            // Increment the posts number instead of calculating it again later
            const cachedNumber = getPostsNumber();
            if (cachedNumber !== undefined) {
                setPostsNumber(cachedNumber + 1);
            }
            return info
        })
        res.status(200).json(result)
    } if (req.method === 'GET') {
        const result = cacheRuntime('getPosts', () => {
            const page = parseInt(req.query.page) || 1; // Default 1
            const limit = parseInt(req.query.limit) || 10; // Default 10
            const offset = (page - 1) * limit;

            const db = getDb()
            return db.prepare('SELECT * FROM posts LIMIT ? OFFSET ?').all(limit, offset)
        })
        res.status(200).json(result)
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
