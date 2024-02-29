import {getRuntimeCache} from "@/db/cache";

export default function handler(req, res) {
    if (req.method === 'GET') {
        // Because we cached the runtimes before, we can just get the average runtime from the cache
        const createPostCache = getRuntimeCache('createPost')
        const getPostsCache = getRuntimeCache('getPosts')

        const createPostTime = createPostCache
            ? createPostCache.runtimeSum / createPostCache.runtimeCount
            : 0
        const getPostsTime = getPostsCache
            ? getPostsCache.runtimeSum / getPostsCache.runtimeCount
            : 0

        const result = {
            createPostTime,
            getPostsTime

        }
        res.status(200).json(result)
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
