import React, { useEffect, useState } from "react";
import { db } from '../utils/firebase';
import {
    addDoc,
    collection,
    doc,
    updateDoc
} from 'firebase/firestore';

const ageGroups = ['toddlers', '4-9', '10-12', 'teens'];

const LessonForm = ({ selectedLesson, onSave }) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [ageGroup, setAgeGroup] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedLesson) {
            setTitle(selectedLesson.title || '');
            setText(selectedLesson.text || '');
            setAgeGroup(selectedLesson.ageGroup || '');
            setImage(selectedLesson.image || '');
        } else {
            // Reset form when no lesson is selected
            setTitle('');
            setText('');
            setAgeGroup('');
            setImage('');
        }
    }, [selectedLesson]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title || !text || !ageGroup) {
            alert('Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            const lessonData = {
                title,
                text,
                ageGroup,
                image,
                updatedAt: new Date(),
            };

            if (selectedLesson) {
                // Update existing lesson
                const lessonRef = doc(db, 'lessons', selectedLesson.id);
                await updateDoc(lessonRef, lessonData);
                alert('Lesson updated successfully!');
            } else {
                // Create new lesson
                lessonData.createdAt = new Date();
                await addDoc(collection(db, 'lessons'), lessonData);
                alert('Lesson created successfully!');
            }

            // Reset form
            setTitle('');
            setText('');
            setAgeGroup('');
            setImage('');
            
            if (onSave) onSave();
        } catch (err) {
            console.error('Error saving lesson:', err);
            alert('Error saving lesson. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="lesson-form" onSubmit={handleSubmit}>
            <h2>{selectedLesson ? 'Edit' : 'Add New'} Lesson</h2>
            
            <div className="form-group">
                <label>Title *</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    required 
                    placeholder="Enter lesson title"
                />
            </div>

            <div className="form-group">
                <label>Lesson Text *</label>
                <textarea 
                    value={text} 
                    onChange={(e) => setText(e.target.value)}
                    required 
                    placeholder="Enter lesson content"
                    rows="4"
                />
            </div>

            <div className="form-group">
                <label>Age Group *</label>
                <select 
                    value={ageGroup} 
                    onChange={(e) => setAgeGroup(e.target.value)}
                    required
                >
                    <option value="">Select age group</option>
                    {ageGroups.map((age) => (
                        <option key={age} value={age}>
                            {age}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Image URL</label>
                <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Enter image URL (optional)"
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (selectedLesson ? 'Update' : 'Create')} Lesson
            </button>
        </form>
    );
};

export default LessonForm;