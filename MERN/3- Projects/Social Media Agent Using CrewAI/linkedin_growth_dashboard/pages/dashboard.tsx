use client;

import { useEffect, useState } from 'react';

function Dashboard() {
    const [metrics, setMetrics] = useState([]);

    useEffect(() => {
        const fetchMetrics = async () => {
            const res = await fetch('/api/get-metrics');
            const data = await res.json();
            setMetrics(data);
        };
        fetchMetrics();
    }, []);

    return (
        <div>
            <h1>LinkedIn Growth Metrics</h1>
            <table>
                <thead>
                    <tr>
                        <th>Views</th>
                        <th>Likes</th>
                        <th>Comments</th>
                        <th>Followers Gained</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {metrics.map((metric, index) => (
                        <tr key={index}>
                            <td>{metric.views}</td>
                            <td>{metric.likes}</td>
                            <td>{metric.comments}</td>
                            <td>{metric.followersGained}</td>
                            <td>{new Date(metric.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;
