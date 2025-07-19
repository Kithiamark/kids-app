import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

const Lesson = ({ user }) => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    
    const [lesson, setLesson] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userProgress, setUserProgress] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const fetchLessonData = async () => {
            try {
                setLoading(true);
                setError('');

                // Fetch lesson data from backend
                const lessonResponse = await fetch(`http://localhost:5000/api/lessons/${lessonId}`, {
                    headers: {
                        'Authorization': `Bearer ${await user.getIdToken()}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!lessonResponse.ok) {
                    throw new Error('Lesson not found');
                }

                const lessonData = await lessonResponse.json();
                setLesson(lessonData);

                // Fetch user progress for this lesson
                const progressDoc = await getDoc(doc(db, 'lessonProgress', `${user.uid}_${lessonId}`));
                
                if (progressDoc.exists()) {
                    const progressData = progressDoc.data();
                    setUserProgress(progressData);
                    setCurrentStep(progressData.currentStep || 0);
                    setProgress(progressData.progress || 0);
                    setIsCompleted(progressData.completed || false);
                } else {
                    // Initialize progress
                    const initialProgress = {
                        userId: user.uid,
                        lessonId: lessonId,
                        currentStep: 0,
                        progress: 0,
                        completed: false,
                        startedAt: new Date(),
                        lastAccessedAt: new Date()
                    };
                    setUserProgress(initialProgress);
                }

            } catch (err) {
                console.error('Error fetching lesson:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user && lessonId) {
            fetchLessonData();
        }
    }, [user, lessonId]);

    const saveProgress = async (stepIndex, completed = false) => {
        try {
            const progressData = {
                userId: user.uid,
                lessonId: lessonId,
                lessonTitle: lesson.title,
                currentStep: stepIndex,
                totalSteps: lesson.content?.length || 1,
                progress: Math.round((stepIndex / (lesson.content?.length || 1)) * 100),
                completed: completed,
                lastAccessedAt: new Date(),
                ...(completed && { completedAt: new Date() })
            };

            await setDoc(doc(db, 'lessonProgress', `${user.uid}_${lessonId}`), progressData);
            setUserProgress(progressData);
            setProgress(progressData.progress);
            setIsCompleted(completed);

        } catch (err) {
            console.error('Error saving progress:', err);
        }
    };

    const handleNext = () => {
        if (lesson?.content && currentStep < lesson.content.length - 1) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            saveProgress(nextStep);
        } else {
            // Lesson completed
            saveProgress(currentStep, true);
            setIsCompleted(true);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            const prevStep = currentStep - 1;
            setCurrentStep(prevStep);
            saveProgress(prevStep);
        }
    };

    const handleStepClick = (stepIndex) => {
        setCurrentStep(stepIndex);
        saveProgress(stepIndex);
    };

    const handleRestart = () => {
        setCurrentStep(0);
        setIsCompleted(false);
        saveProgress(0, false);
    };

    const renderContent = () => {
        if (!lesson?.content || !lesson.content[currentStep]) {
            return <div className="lesson-content">No content available</div>;
        }

        const step = lesson.content[currentStep];

        return (
            <div className="lesson-content">
                <h2>{step.title}</h2>
                
                {step.image && (
                    <div className="lesson-image">
                        <img 
                            src={step.image} 
                            alt={step.title}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                )}

                <div className="lesson-text">
                    {step.content?.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>

                {step.video && (
                    <div className="lesson-video">
                        <video controls>
                            <source src={step.video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}

                {step.interactive && (
                    <div className="lesson-interactive">
                        <h3>Interactive Activity</h3>
                        <p>{step.interactive.description}</p>
                        {step.interactive.questions?.map((question, qIndex) => (
                            <div key={qIndex} className="question-block">
                                <h4>{question.question}</h4>
                                <div className="question-options">
                                    {question.options?.map((option, oIndex) => (
                                        <button 
                                            key={oIndex}
                                            className="option-button"
                                            onClick={() => {
                                                // Handle question interaction
                                                console.log('Selected option:', option);
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return <div className="lesson-loading">Loading lesson...</div>;
    }

    if (error) {
        return (
            <div className="lesson-error">
                <h2>Error Loading Lesson</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/dashboard')}>
                    Return to Dashboard
                </button>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="lesson-not-found">
                <h2>Lesson Not Found</h2>
                <button onClick={() => navigate('/dashboard')}>
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="lesson-container">
            <div className="lesson-header">
                <button 
                    className="back-button"
                    onClick={() => navigate('/dashboard')}
                >
                    ← Back to Dashboard
                </button>
                
                <div className="lesson-info">
                    <h1>{lesson.title}</h1>
                    <p className="lesson-description">{lesson.description}</p>
                </div>

                <div className="lesson-progress">
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <span className="progress-text">
                        {progress}% Complete
                    </span>
                </div>
            </div>

            <div className="lesson-main">
                <div className="lesson-sidebar">
                    <h3>Lesson Steps</h3>
                    <div className="steps-list">
                        {lesson.content?.map((step, index) => (
                            <div 
                                key={index}
                                className={`step-item ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                                onClick={() => handleStepClick(index)}
                            >
                                <div className="step-number">{index + 1}</div>
                                <div className="step-title">{step.title}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lesson-body">
                    {renderContent()}

                    {isCompleted ? (
                        <div className="lesson-completion">
                            <h2>🎉 Lesson Completed!</h2>
                            <p>Great job! You've successfully completed this lesson.</p>
                            <div className="completion-actions">
                                <button 
                                    className="restart-button"
                                    onClick={handleRestart}
                                >
                                    Restart Lesson
                                </button>
                                <button 
                                    className="next-lesson-button"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Continue Learning
                                </button>
                                <button 
                                    className="quiz-button"
                                    onClick={() => navigate(`/quiz/${lessonId}`)}
                                >
                                    Take Quiz
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="lesson-navigation">
                            <button 
                                className="nav-button prev"
                                onClick={handlePrevious}
                                disabled={currentStep === 0}
                            >
                                Previous
                            </button>
                            
                            <span className="step-indicator">
                                Step {currentStep + 1} of {lesson.content?.length || 1}
                            </span>
                            
                            <button 
                                className="nav-button next"
                                onClick={handleNext}
                            >
                                {currentStep === (lesson.content?.length || 1) - 1 ? 'Complete' : 'Next'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Lesson;