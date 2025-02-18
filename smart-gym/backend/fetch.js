import axios from "axios";
import React, { useState, useEffect } from "react";

function MyComponent() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/api/data")
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
