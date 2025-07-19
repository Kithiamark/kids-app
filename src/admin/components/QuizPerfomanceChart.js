import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import dayjs from 'dayjs';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    ResponsiveContainer, 
    CartesianGrid,
    Tooltip
} from 'recharts';

const QuizPerformanceChart = ({ userId }) => {
    const [quizData, setQuizData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchQuizPerformance = async () => {
            if (!userId) {
                setQuizData([]);
                return;
            }

            try {
                setLoading(true);
                const q = query(
                    collection(db, 'quizResults'),
                    where('userId', '==', userId)
                );
                const snapshot = await getDocs(q);

                const results = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const date = dayjs(data.takenAt.toDate?.() || data.takenAt).format('MMM DD');
                    const percent = Math.round((data.score / data.total) * 100);

                    results.push({
                        quizTitle: data.quizTitle || date,
                        scorePercent: percent,
                        score: data.score,
                        total: data.total,
                        date: date
                    });
                });

                // Sort by date (most recent first)
                results.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
                setQuizData(results.slice(0, 10)); // Show last 10 quiz results
            } catch (error) {
                console.error('Error fetching quiz performance:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizPerformance();
    }, [userId]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="quiz-tooltip">
                    <p className="tooltip-title">{label}</p>
                    <p className="tooltip-score">
                        Score: {data.score}/{data.total} ({data.scorePercent}%)
                    </p>
                    <p className="tooltip-date">Date: {data.date}</p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="quiz-chart">
                <h2 className="quiz-title">Quiz Performance</h2>
                <div className="chart-loading">Loading quiz data...</div>
            </div>
        );
    }

    return (
        <div className="quiz-chart">
            <h2 className="quiz-title">Quiz Performance</h2>
            {quizData.length === 0 ? (
                <div className="no-data">
                    <p>No quiz data available{userId ? ' for selected user' : ''}.</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={quizData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="quizTitle" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                            dataKey="scorePercent" 
                            fill="#8884d8" 
                            barSize={40} 
                            radius={[4, 4, 0, 0]} 
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default QuizPerformanceChart;