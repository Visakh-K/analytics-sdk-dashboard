// src/components/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Users, Eye, ShoppingBag, Activity } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [range, setRange] = useState('7d');
  const [summary, setSummary] = useState({ total_events: 0, page_views: 0, unique_visitors: 0, total_orders: 0 });
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard metrics from Laravel backend API
  useEffect(() => {
    setLoading(true);
    
    Promise.all([
      fetch(`/api/v1/analytics/summary?range=${range}`).then(res => res.json()),
      fetch(`/api/v1/analytics/trends?range=${range}`).then(res => res.json())
    ])
      .then(([summaryData, trendsData]) => {
        setSummary(summaryData);
        
        // Format trends data for Recharts (grouping by date)
        const formattedTrends = formatTrendsForChart(trendsData);
        setTrends(formattedTrends);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load analytics data', err);
        setLoading(false);
      });
  }, [range]);

  // Helper to transform flat trend rows into Recharts-friendly structured objects
  const formatTrendsForChart = (data) => {
    const grouped = {};
    data.forEach(item => {
      if (!grouped[item.date]) {
        grouped[item.date] = { date: item.date, page_view: 0, order_created: 0, menu_item_clicked: 0 };
      }
      grouped[item.date][item.event_name] = item.count;
    });
    return Object.values(grouped);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📊 Analytics Dashboard</h1>
          <p className="text-gray-500 text-sm">Real-time traffic, user engagement, and restaurant orders.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border">
          {['24h', '7d', '30d'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${
                range === r ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          title="Total Page Views" 
          value={summary.page_views} 
          icon={<Eye className="w-6 h-6 text-blue-600" />} 
          bgColor="bg-blue-50"
        />
        <MetricCard 
          title="Unique Visitors" 
          value={summary.unique_visitors} 
          icon={<Users className="w-6 h-6 text-indigo-600" />} 
          bgColor="bg-indigo-50"
        />
        <MetricCard 
          title="Total Orders" 
          value={summary.total_orders} 
          icon={<ShoppingBag className="w-6 h-6 text-green-600" />} 
          bgColor="bg-green-50"
        />
        <MetricCard 
          title="Total Events" 
          value={summary.total_events} 
          icon={<Activity className="w-6 h-6 text-purple-600" />} 
          bgColor="bg-purple-50"
        />
      </div>

      {/* Recharts Line Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Traffic & Event Trends Over Time</h3>
        
        {loading ? (
          <div className="h-80 flex items-center justify-center text-gray-400">Loading charts...</div>
        ) : trends.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-gray-400">No event data found for this date range. Try clicking around the restaurant menu!</div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="page_view" name="Page Views" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="menu_item_clicked" name="Menu Clicks" stroke="#9333ea" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="order_created" name="Orders Created" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component for summary cards
function MetricCard({ title, value, icon, bgColor }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{value.toLocaleString()}</h3>
      </div>
      <div className={`p-3 rounded-xl ${bgColor}`}>
        {icon}
      </div>
    </div>
  );
}