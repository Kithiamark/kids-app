import React, { useState } from "react";
import LessonList from "./LessonList";
import LessonForm from "./LessonForm";

const LessonManager = () => {
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [refreshToggle, setRefreshToggle] = useState(false);

    const handleEdit = (lesson) => {
        setSelectedLesson(lesson);
    };

    const handleSave = () => {
        setSelectedLesson(null);
        setRefreshToggle(!refreshToggle); // Trigger refresh
    };

    const handleCancelEdit = () => {
        setSelectedLesson(null);
    };

    return (
        <div className="lesson-manager">
            <h1>Lesson Management</h1>
            
            <div className="lesson-manager-content">
                <div className="lesson-form-section">
                    <LessonForm 
                        selectedLesson={selectedLesson} 
                        onSave={handleSave} 
                    />
                    {selectedLesson && (
                        <button 
                            onClick={handleCancelEdit}
                            className="cancel-button"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
                
                <div className="lesson-list-section">
                    <LessonList 
                        onEdit={handleEdit} 
                        refreshTrigger={refreshToggle}
                    />
                </div>
            </div>
        </div>
    );
};

export default LessonManager;