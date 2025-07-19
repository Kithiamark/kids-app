import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import dayjs from 'dayjs';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const ProgressTracker = ({ userId }) => {
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(0);
    const [totalLessons, setTotalLessons] = useState(0);

    useEffect(() => {
        const fetchProgressData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Query for user's lesson progress
                const q = query(
                    collection(db, 'lessonProgress'),
                    where('userId', '==', userId)
                );
                
                const snapshot = await getDocs(q);
                const results = [];
                
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const date = dayjs(data.completedAt?.toDate?.() || data.completedAt).format('MMM-DD');
                    results.push({
                        lessonTitle: data.lessonTitle || `Lesson ${date}`,
                        percentComplete: Math.round((data.completedSteps / data.totalSteps) * 100) || 0,
                        date: date
                    });
                });

                setProgressData(results);
                
                // Calculate current lesson progress
                const completedLessons = results.filter(item => item.percentComplete === 100).length;
                setCurrentLesson(completedLessons);
                setTotalLessons(results.length);

            } catch (err) {
                console.error('Failed to fetch progress data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchProgressData();
        }
    }, [userId]);

    if (loading) return <div className="progress-loading">Loading progress...</div>;
    if (error) return <div className="progress-error">Error: {error}</div>;

    return (
        <div className="progress-tracker">
            <h2 className="progress-title">
                Progress: {currentLesson}/{totalLessons} Lessons Completed
            </h2>
            
            {progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="lessonTitle" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis 
                            domain={[0, 100]}
                            label={{ value: 'Progress %', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                            formatter={(value) => [`${value}%`, 'Progress']}
                            labelFormatter={(label) => `Lesson: ${label}`}
                        />
                        <Bar dataKey="percentComplete" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="no-progress">
                    <p>No progress data available yet.</p>
                    <p>Start your first lesson to see your progress!</p>
                </div>
            )}
        </div>
    );
};

export default ProgressTracker;