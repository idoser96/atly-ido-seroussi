const fs = require('fs');
const path = require('path');

const CACHE_DIR = './cache';
const postsNumberPath = path.join(CACHE_DIR, 'postsNumber.json');
fs.mkdirSync(CACHE_DIR, { recursive: true })
// Caches used to avoid querying the database for the same data when not needed
// Generally shouldn't be in the file system, but for the sake of the example, we'll use it
// Can also cache the posts and their queries, but did not have time for it


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

function getRuntimeCache(cacheName) {
    const cachePath = path.join(CACHE_DIR, `runtime-${cacheName}.json`);
    if (fs.existsSync(cachePath)) {
        const data = fs.readFileSync(cachePath, 'utf8');
        return JSON.parse(data);
    }
    return undefined
}

function setRuntimeCache(cacheName, data) {
    const cachePath = path.join(CACHE_DIR, `runtime-${cacheName}.json`);
    fs.writeFileSync(cachePath, JSON.stringify(data), 'utf8');
}

function clearAllCaches() {
    fs.rmdirSync(CACHE_DIR, { recursive: true });
    fs.mkdirSync(CACHE_DIR);
}

module.exports = { getPostsNumber, setPostsNumber, clearAllCaches, getRuntimeCache, setRuntimeCache };
