import React, { useState, useEffect } from "react";
import { db } from '../utils/firebase';
import { collection, getDocs, query, where } from "firebase/firestore";
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from "recharts";
import dayjs from "dayjs";

const UserProgressChart = ({ userId }) => {
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProgress = async () => {
            if (!userId) {
                setProgressData([]);
                return;
            }

            try {
                setLoading(true);
                const q = query(
                    collection(db, 'userProgress'),
                    where('userId', '==', userId)
                );
                const snapshot = await getDocs(q);

                const groupedByDate = {};
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const date = dayjs(data.completedAt.toDate?.() || data.completedAt).format('YYYY-MM-DD');

                    if (!groupedByDate[date]) groupedByDate[date] = 0;
                    groupedByDate[date]++;
                });

                const chartData = Object.entries(groupedByDate)
                    .map(([date, count]) => ({
                        date: dayjs(date).format('MMM DD'),
                        lessonsCompleted: count,
                        rawDate: date
                    }))
                    .sort((a, b) => dayjs(a.rawDate).valueOf() - dayjs(b.rawDate).valueOf())
                    .slice(-30); // Show last 30 days

                setProgressData(chartData);
            } catch (error) {
                console.error('Error fetching progress data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [userId]);

    if (loading) {
        return (
            <div className="progress-chart">
                <h2 className="progress-title">Lesson Progress</h2>
                <div className="chart-loading">Loading progress data...</div>
            </div>
        );
    }

    return (
        <div className="progress-chart">
            <h2 className="progress-title">Lesson Progress</h2>
            {progressData.length === 0 ? (
                <div className="no-data">
                    <p>No progress data available{userId ? ' for selected user' : ''}.</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Line 
                            type="monotone" 
                            dataKey="lessonsCompleted" 
                            stroke="#8884d8" 
                            strokeWidth={3} 
                            dot={{ r: 5 }} 
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default UserProgressChart;