const fs = require('fs');
const path = require('path');

const CACHE_DIR = './cache';
const postsCachePath = path.join(CACHE_DIR, 'postsCache.json');
const postsNumberPath = path.join(CACHE_DIR, 'postsNumber.json');

function getPostsCache() {
    if (fs.existsSync(postsCachePath)) {
        const data = fs.readFileSync(postsCachePath, 'utf8');
        return JSON.parse(data);
    }
    return undefined;
}
function setPostsCache(posts) {
    fs.writeFileSync(postsCachePath, JSON.stringify(posts), 'utf8');
}

function getPostsNumber() {
    if (fs.existsSync(postsNumberPath)) {
        const data = fs.readFileSync(postsNumberPath, 'utf8');
        return JSON.parse(data);
    }
    return undefined;
}

function setPostsNumber(number) {
    fs.writeFileSync(postsNumberPath, JSON.stringify(number), 'utf8');
}

function clearAllCaches() {
    if (fs.existsSync(postsCachePath)) {
        fs.unlinkSync(postsCachePath);
    }
    if (fs.existsSync(postsNumberPath)) {
        fs.unlinkSync(postsNumberPath);
    }
}

module.exports = { getPostsCache, setPostsCache, getPostsNumber, setPostsNumber, clearAllCaches };
