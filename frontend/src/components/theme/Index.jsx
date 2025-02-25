import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const data = [
        { date: '01 Feb', value: 100 },
        { date: '08 Feb', value: 200 },
        { date: '15 Feb', value: 150 },
        { date: '22 Feb', value: 300 },
        { date: '01 Mar', value: 250 },
        { date: '08 Mar', value: 350 },
        { date: '15 Mar', value: 300 },
    ];

    const topProducts = [
        { name: 'Maneki Neko Poster', sold: 1249, change: '+15.2%' },
        { name: 'Echoes Necklace', sold: 1145, change: '+13.9%' },
        { name: 'Spiky Ring', sold: 1073, change: '+9.5%' },
        { name: 'Pastel Petals Poster', sold: 1027, change: '+2.3%' },
        { name: 'I Limone', sold: 982, change: '-0.7%' },
        { name: 'Ringed Earring', sold: 1201, change: '-1.1%' },
    ];

    return (
        <>
        <div className="dashboard-container">
            <div className="overview-section">
                <div className="overview-card">
                    <h2>Total Profit</h2>
                    <h3>$82,373.21</h3>
                    <p>+3.4% from last month</p>
                </div>
                <div className="overview-card">
                    <h2>Total Orders</h2>
                    <h3>7,234</h3>
                    <p>-2.8% from last month</p>
                </div>
                <div className="overview-card">
                    <h2>Impressions</h2>
                    <h3>3.1M</h3>
                    <p>+4.6% from last month</p>
                </div>
            </div>

            <div className="chart-section">
                <h2>Overview</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="sales-section">
                <div className="sales-target">
                    <h2>Sales Target</h2>
                    <div className="progress-circle">75%</div>
                    <p>1.3K / 1.8K Units</p>
                    <p>Made this month</p>
                </div>
                <div className="top-products">
                    <h2>Top Products</h2>
                    <ul>
                        {topProducts.map((product, index) => (
                            <li key={index}>
                                <span>{product.name}</span>
                                <span>Sold: {product.sold}</span>
                                <span>{product.change}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="countries-section">
                <h2>Top Countries</h2>
                {/* World map and country data would be implemented here */}
                <p>Map and data to be added</p>
            </div>

            <div className="revenue-section">
                <h2>Channel Revenue</h2>
                {/* Revenue data would be implemented here */}
                 <p>Revenue data to be added</p>
            </div>
        </div>
        </>
    );
};

export default Dashboard;