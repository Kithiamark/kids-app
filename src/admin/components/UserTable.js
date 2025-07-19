import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import dayjs from 'dayjs';

const UserTable = ({ onUserSelect }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const snapshot = await getDocs(collection(db, 'users'));
                const userList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(userList);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleViewUser = (userId) => {
        setSelectedUserId(userId);
        if (onUserSelect) {
            onUserSelect(userId);
        }
    };

    if (loading) {
        return (
            <div className="user-table">
                <h2 className="table-title">User Overview</h2>
                <div className="table-loading">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="user-table">
            <h2 className="table-title">User Overview ({users.length} users)</h2>
            
            {users.length === 0 ? (
                <div className="no-users">
                    <p>No users found.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr className="table-header">
                                <th className="header">Name</th>
                                <th className="header">Age Group</th>
                                <th className="header">Lessons</th>
                                <th className="header">Quiz Avg</th>
                                <th className="header">Last Active</th>
                                <th className="header">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr 
                                    key={user.id} 
                                    className={`table-row ${selectedUserId === user.id ? 'selected' : ''}`}
                                >
                                    <td className="table-cell">{user.name || 'Unknown'}</td>
                                    <td className="table-cell">{user.ageGroup || 'N/A'}</td>
                                    <td className="table-cell">{user.lessonsCompleted || 0}</td>
                                    <td className="table-cell">{user.quizAvg || 0}%</td>
                                    <td className="table-cell">
                                        {user.lastActive 
                                            ? dayjs(user.lastActive.toDate?.() || user.lastActive).format('MMM D, YYYY')
                                            : 'Never'
                                        }
                                    </td>
                                    <td className="table-cell">
                                        <button 
                                            className="view-button"
                                            onClick={() => handleViewUser(user.id)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserTable;