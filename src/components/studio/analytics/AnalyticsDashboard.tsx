"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

// =============================================================================
// TYPES
// =============================================================================

interface AnalyticsData {
  pageViews: TimeSeriesData[];
  visitors: TimeSeriesData[];
  topPages: TopItem[];
  topGalleries: TopItem[];
  devices: PieData[];
  browsers: PieData[];
  countries: TopItem[];
  referrers: TopItem[];
}

interface TimeSeriesData {
  date: string;
  value: number;
}

interface TopItem {
  name: string;
  value: number;
  change?: number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: string;
}

// =============================================================================
// MOCK DATA (Replace with real API calls)
// =============================================================================

const generateMockData = (): AnalyticsData => {
  const days = 30;
  const pageViews: TimeSeriesData[] = [];
  const visitors: TimeSeriesData[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    pageViews.push({
      date: date.toISOString().split("T")[0],
      value: Math.floor(Math.random() * 500) + 100,
    });
    visitors.push({
      date: date.toISOString().split("T")[0],
      value: Math.floor(Math.random() * 200) + 50,
    });
  }

  return {
    pageViews,
    visitors,
    topPages: [
      { name: "/", value: 1234, change: 12 },
      { name: "/work", value: 856, change: -5 },
      { name: "/about", value: 432, change: 8 },
      { name: "/contact", value: 321, change: 15 },
      { name: "/work/project-1", value: 287, change: 22 },
    ],
    topGalleries: [
      { name: "Brand Evolution", value: 543, change: 18 },
      { name: "Motion Design", value: 421, change: 7 },
      { name: "Photography", value: 389, change: -3 },
      { name: "UI/UX Work", value: 256, change: 12 },
    ],
    devices: [
      { name: "Desktop", value: 58, color: "#3B82F6" },
      { name: "Mobile", value: 35, color: "#10B981" },
      { name: "Tablet", value: 7, color: "#F59E0B" },
    ],
    browsers: [
      { name: "Chrome", value: 62, color: "#4285F4" },
      { name: "Safari", value: 22, color: "#000000" },
      { name: "Firefox", value: 10, color: "#FF7139" },
      { name: "Edge", value: 6, color: "#0078D7" },
    ],
    countries: [
      { name: "United States", value: 2341 },
      { name: "United Kingdom", value: 1234 },
      { name: "Germany", value: 876 },
      { name: "France", value: 654 },
      { name: "Canada", value: 543 },
    ],
    referrers: [
      { name: "Direct", value: 1543 },
      { name: "Google", value: 1234 },
      { name: "Instagram", value: 654 },
      { name: "Twitter", value: 432 },
      { name: "LinkedIn", value: 321 },
    ],
  };
};

// =============================================================================
// COMPONENTS
// =============================================================================

function MetricCard({ title, value, change, icon, color = "blue" }: MetricCardProps) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        {change !== undefined && (
          <span
            className={`text-sm font-medium ${
              change >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {change >= 0 ? "+" : ""}
            {change}%
          </span>
        )}
      </div>
      <p className="text-3xl font-semibold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </motion.div>
  );
}

function SimpleLineChart({ data, color = "#3B82F6" }: { data: TimeSeriesData[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((d.value - min) / range) * 80 - 10;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-48" preserveAspectRatio="none">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="100"
          y2={y}
          stroke="#E5E7EB"
          strokeWidth="0.2"
        />
      ))}

      {/* Area fill */}
      <polygon points={areaPoints} fill={`${color}15`} />

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dots on hover would go here */}
    </svg>
  );
}

function SimplePieChart({ data }: { data: PieData[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" className="w-32 h-32">
        {data.map((segment, i) => {
          const angle = (segment.value / total) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;

          const x1 = 50 + 40 * Math.cos((Math.PI * startAngle) / 180);
          const y1 = 50 + 40 * Math.sin((Math.PI * startAngle) / 180);
          const x2 = 50 + 40 * Math.cos((Math.PI * currentAngle) / 180);
          const y2 = 50 + 40 * Math.sin((Math.PI * currentAngle) / 180);

          const largeArc = angle > 180 ? 1 : 0;

          return (
            <path
              key={i}
              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={segment.color}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          );
        })}
        <circle cx="50" cy="50" r="25" fill="white" />
      </svg>

      <div className="flex flex-col gap-2">
        {data.map((segment, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-sm text-gray-600">{segment.name}</span>
            <span className="text-sm font-medium text-gray-900 ml-auto">
              {segment.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopItemsList({ items, showChange = false }: { items: TopItem[]; showChange?: boolean }) {
  const max = Math.max(...items.map((i) => i.value));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-sm text-gray-500 w-6">{i + 1}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {item.value.toLocaleString()}
                </span>
                {showChange && item.change !== undefined && (
                  <span
                    className={`text-xs ${
                      item.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.change >= 0 ? "+" : ""}
                    {item.change}%
                  </span>
                )}
              </div>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

type TimeRange = "7d" | "30d" | "90d" | "12m";

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const data = useMemo(() => generateMockData(), []);

  const totalPageViews = data.pageViews.reduce((sum, d) => sum + d.value, 0);
  const totalVisitors = data.visitors.reduce((sum, d) => sum + d.value, 0);
  const avgTimeOnSite = "2m 34s";
  const bounceRate = "42%";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your site performance and visitor engagement
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(["7d", "30d", "90d", "12m"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                timeRange === range
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Page Views"
          value={totalPageViews.toLocaleString()}
          change={12}
          color="blue"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
        <MetricCard
          title="Unique Visitors"
          value={totalVisitors.toLocaleString()}
          change={8}
          color="green"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <MetricCard
          title="Avg. Time on Site"
          value={avgTimeOnSite}
          change={-3}
          color="purple"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <MetricCard
          title="Bounce Rate"
          value={bounceRate}
          change={-5}
          color="orange"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Views</h3>
          <SimpleLineChart data={data.pageViews} color="#3B82F6" />
        </motion.div>

        {/* Visitors Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Unique Visitors
          </h3>
          <SimpleLineChart data={data.visitors} color="#10B981" />
        </motion.div>
      </div>

      {/* Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Devices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Devices</h3>
          <SimplePieChart data={data.devices} />
        </motion.div>

        {/* Browsers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Browsers</h3>
          <SimplePieChart data={data.browsers} />
        </motion.div>

        {/* Top Countries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Countries
          </h3>
          <TopItemsList items={data.countries} />
        </motion.div>
      </div>

      {/* Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <TopItemsList items={data.topPages} showChange />
        </motion.div>

        {/* Top Referrers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Referrers
          </h3>
          <TopItemsList items={data.referrers} />
        </motion.div>
      </div>

      {/* Top Galleries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Galleries
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.topGalleries.map((gallery, i) => (
            <div
              key={i}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <p className="font-medium text-gray-900">{gallery.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-semibold text-gray-900">
                  {gallery.value}
                </span>
                <span className="text-sm text-gray-500">views</span>
                {gallery.change !== undefined && (
                  <span
                    className={`text-xs ml-auto ${
                      gallery.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {gallery.change >= 0 ? "+" : ""}
                    {gallery.change}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
