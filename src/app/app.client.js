import React, { useState, useEffect } from 'react';
import axios from 'axios';

const POSTS_PER_PAGE = 10;

function App() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);

    const [users, setUsers] = useState([]);
    const [postsNumber, setPostsNumber] = useState(0);
    const [topCreators, setTopCreators] = useState([]);
    const [runtimeStatistics, setRuntimeStatistics] = useState([]);

    // Form state
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [userUuid, setUserUuid] = useState('');

    useEffect(() => {
        // Fetch posts
        axios.get('/api/posts')
            .then(response => {
                setPosts(response.data)
                setCurrentPage(2)
            })
            .catch(error => console.error("There was an error fetching the posts: ", error));

        // Fetch users
        axios.get('/api/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error("There was an error fetching the users: ", error));

        // Fetch posts number
        axios.get('/api/postsnumber')
            .then(response => setPostsNumber(response.data))
            .catch(error => console.error("There was an error fetching the posts number: ", error));
        axios.get('/api/statictics/topcreators')
            .then(response => setTopCreators(response.data))
            .catch(error => console.error("There was an error fetching the top creators: ", error));
        axios.get('/api/statictics/runtimes')
            .then(response => setRuntimeStatistics(response.data))
            .catch(error => console.error("There was an error fetching the runtimes: ", error));
    }, []);

    const fetchMorePosts = () => {
        if (!hasMorePosts) return;

        axios.get(`/api/posts?page=${currentPage}&limit=${POSTS_PER_PAGE}`)
            .then(response => {
                setPosts(prevPosts => [...prevPosts, ...response.data]);
                setCurrentPage(prevPage => prevPage + 1);
                // Update hasMorePosts based on response, e.g., by checking the length of the response
                setHasMorePosts(response.data.length === POSTS_PER_PAGE);
            })
            .catch(error => console.error("There was an error fetching more posts: ", error));
    };

    const handleDropAll = () => {
        axios.get('/api/dropall')
            .then(() => {
                // Optionally reset local state or refetch data
                console.log('All data dropped successfully.');
                setPosts([]);
                setUsers([]);
                setPostsNumber(0);
            })
            .catch(error => console.error("There was an error dropping all data: ", error));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        axios.post('/api/posts', { title, body, userUuid })
            .then(() => {
                // Optionally, fetch the updated list of posts or append the new post to the posts state
                console.log('Post added successfully.');
                // Reset form fields
                setTitle('');
                setBody('');
                setUserUuid('');
            })
            .catch(error => console.error("There was an error adding the post: ", error));
    };

    return (
        <div>
            <h2>Posts</h2>
            <table>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Body</th>
                    <th>User</th>
                </tr>
                </thead>
                <tbody>
                {posts.map(post => (
                    <tr key={post.id}>
                        <td>{post.title}</td>
                        <td>{post.body}</td>
                        <td>{post.userUuid}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button onClick={fetchMorePosts} disabled={!hasMorePosts}>
                Get More Posts
            </button>

            <h2>Add New Post</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
                </label>
                <label>
                    Body:
                    <input value={body} onChange={e => setBody(e.target.value)} />
                </label>
                <label>
                    User:
                    <input type="text" value={userUuid} onChange={e => setUserUuid(e.target.value)} />
                </label>
                <button type="submit">Add Post</button>
            </form>

            <h2>Users</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Uuid</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.uuid}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>Top Creators</h2>
            <table>
                <thead>
                <tr>
                    <th>Uuid</th>
                    <th>Posts</th>
                </tr>
                </thead>
                <tbody>
                {topCreators.map(creator => (
                    <tr key={creator.userUuid}>
                        <td>{creator.userUuid}</td>
                        <td>{creator.posts}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>Posts Number: {postsNumber}</h2>

            <h2>Statistics</h2>
            {Object.entries(runtimeStatistics).map(([key, value]) => (
                <p key={key}>{key}: {value}</p>
            ))}


            <button onClick={handleDropAll}>Drop All Data</button>
        </div>
    );
}

export default App;
