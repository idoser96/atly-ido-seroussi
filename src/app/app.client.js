import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [postsNumber, setPostsNumber] = useState(0);
    const [topCreators, setTopCreators] = useState([]);

    useEffect(() => {
        // Fetch posts
        axios.get('/api/posts')
            .then(response => setPosts(response.data))
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
    }, []);

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

    return (
        <div>
            <h2>Posts</h2>
            <table>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Body</th>
                    <th>User Uuid</th>
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

            <button onClick={handleDropAll}>Drop All Data</button>
        </div>
    );
}

export default App;
