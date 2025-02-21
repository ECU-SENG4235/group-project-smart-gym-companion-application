const axios = require("axios");
const React = require("react");
const { useState, useEffect } = require("react");

function MyComponent() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:4000/login")
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });
    }, []); 

    return (
        <div>
            <h2>Registered Users</h2>
            {users.length > 0 ? (
                users.map(user => (
                    <div key={user.id}>
                        <strong>Email:</strong> {user.email}
                    </div>
                ))
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
}

export default MyComponent;