import React, { useState, useEffect } from "react";
import { db } from '../utils/firebase';
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
} from 'firebase/firestore';

const LessonList = ({ onEdit, refreshTrigger }) => {
    const [lessons, setLessons] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    const fetchLessons = async () => {
        try {
            setLoading(true);
            const snapshot = await getDocs(collection(db, 'lessons'));
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setLessons(data);
        } catch (error) {
            console.error('Error fetching lessons:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this lesson?');
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, 'lessons', id));
            alert('Lesson deleted successfully!');
            fetchLessons(); // Refresh the list
        } catch (error) {
            console.error('Error deleting lesson:', error);
            alert('Error deleting lesson. Please try again.');
        }
    };

    useEffect(() => {
        fetchLessons();
    }, [refreshTrigger]);

    const filteredLessons = filter === 'All' 
        ? lessons 
        : lessons.filter(lesson => lesson.ageGroup === filter);

    if (loading) {
        return <div className="lesson-list-loading">Loading lessons...</div>;
    }

    return (
        <div className="lesson-list">
            <div className="lesson-header">
                <h2>All Lessons ({filteredLessons.length})</h2>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="All">All age groups</option>
                    <option value="toddlers">Toddlers</option>
                    <option value="4-9">4-9 years</option>
                    <option value="10-12">10-12 years</option>
                    <option value="teens">Teens</option>
                </select>
            </div>

            <div className="lesson-grid">
                {filteredLessons.length === 0 ? (
                    <div className="no-lessons">
                        <p>No lessons found for the selected age group.</p>
                    </div>
                ) : (
                    filteredLessons.map((lesson) => (
                        <div key={lesson.id} className="lesson-card">
                            <div className="lesson-card-header">
                                <h3>{lesson.title}</h3>
                                <span className="age-badge">{lesson.ageGroup}</span>
                            </div>
                            
                            {lesson.image && (
                                <img 
                                    src={lesson.image} 
                                    alt={lesson.title} 
                                    className="lesson-thumbnail"
                                />
                            )}
                            
                            <p className="lesson-preview">
                                {lesson.text.slice(0, 100)}
                                {lesson.text.length > 100 ? '...' : ''}
                            </p>
                            
                            <div className="lesson-buttons">
                                <button 
                                    onClick={() => onEdit(lesson)}
                                    className="edit-button"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(lesson.id)}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LessonList;