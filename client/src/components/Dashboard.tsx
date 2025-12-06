import React, {useState, useEffect} from 'react';
import {Users, UserCheck, TrendingUp, Clock, Award, Activity, AlertCircle} from 'lucide-react';
import {Card} from './ui/card';
import {Badge} from './ui/badge';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    Area,
    AreaChart
} from 'recharts';
import api from '../utils/api';

interface Provider {
    id: string;
    name: string;
    specialty: string;
    licenseState: string;
    qualityScore: number;
}

interface DashboardStats {
    totalProviders: number;
    activeProviders: number;
    avgQualityScore: number;
    validationJobs: number;
}

export function Dashboard() {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalProviders: 0,
        activeProviders: 0,
        avgQualityScore: 0,
        validationJobs: 0
    });

    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        try {
            const response = await api.get('/providers');
            const providersData = response.data.providers || [];
            setProviders(providersData);

            // Calculate stats
            const total = providersData.length;
            const active = providersData.filter((p: Provider) => p.qualityScore >= 60).length;
            const avgScore = total > 0
                ? providersData.reduce((sum: number, p: Provider) => sum + p.qualityScore, 0) / total
                : 0;

            setStats({
                totalProviders: total,
                activeProviders: active,
                avgQualityScore: Math.round(avgScore),
                validationJobs: Math.floor(total / 10) // Mock calculation
            });
        } catch (error) {
            console.error('Error fetching providers:', error);
        } finally {
            setLoading(false);
        }
    };

    // Prepare data for charts
    const getSpecialtyDistribution = () => {
        const specialtyCount: { [key: string]: number } = {};
        providers.forEach(p => {
            specialtyCount[p.specialty] = (specialtyCount[p.specialty] || 0) + 1;
        });

        return Object.entries(specialtyCount)
            .map(([name, value]) => ({name, value}))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6); // Top 6 specialties
    };

    const getQualityDistribution = () => {
        const ranges = [
            {name: 'Excellent (90-100)', min: 90, max: 100, count: 0, color: '#43A047'},
            {name: 'Good (80-89)', min: 80, max: 89, count: 0, color: '#66BB6A'},
            {name: 'Average (70-79)', min: 70, max: 79, count: 0, color: '#FFA726'},
            {name: 'Below Avg (60-69)', min: 60, max: 69, count: 0, color: '#FF9800'},
            {name: 'Poor (0-59)', min: 0, max: 59, count: 0, color: '#E53935'}
        ];

        providers.forEach(p => {
            const range = ranges.find(r => p.qualityScore >= r.min && p.qualityScore <= r.max);
            if (range) range.count++;
        });

        return ranges.filter(r => r.count > 0);
    };

    const getStateDistribution = () => {
        const stateCount: { [key: string]: number } = {};
        providers.forEach(p => {
            stateCount[p.licenseState] = (stateCount[p.licenseState] || 0) + 1;
        });

        return Object.entries(stateCount)
            .map(([state, count]) => ({state, count}))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // Top 10 states
    };

    const getTopPerformers = () => {
        return [...providers]
            .sort((a, b) => b.qualityScore - a.qualityScore)
            .slice(0, 5);
    };

    const getLowPerformers = () => {
        return [...providers]
            .filter(p => p.qualityScore < 60)
            .sort((a, b) => a.qualityScore - b.qualityScore)
            .slice(0, 5);
    };

    // Chart colors
    const COLORS = ['#1976D2', '#43A047', '#9C27B0', '#FB8C00', '#E53935', '#00ACC1', '#7CB342'];

    const statsCards = [
        {
            label: 'Total Providers',
            value: stats.totalProviders.toLocaleString(),
            icon: Users,
            color: '#1976D2',
            bgColor: '#E3F2FD',
            trend: '+12%'
        },
        {
            label: 'Active Providers',
            value: stats.activeProviders.toLocaleString(),
            icon: UserCheck,
            color: '#43A047',
            bgColor: '#E8F5E9',
            trend: '+8%'
        },
        {
            label: 'Avg Quality Score',
            value: `${stats.avgQualityScore}%`,
            icon: Award,
            color: '#9C27B0',
            bgColor: '#F3E5F5',
            trend: '+3%'
        },
        {
            label: 'Validation Jobs',
            value: stats.validationJobs.toString(),
            icon: Activity,
            color: '#FB8C00',
            bgColor: '#FFF3E0',
            trend: '+15%'
        }
    ];

    const specialtyData = getSpecialtyDistribution();
    const qualityData = getQualityDistribution();
    const stateData = getStateDistribution();
    const topPerformers = getTopPerformers();
    const lowPerformers = getLowPerformers();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1976D2]"></div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
                <p className="text-base text-[#757575]">Comprehensive insights and data visualization</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card
                            key={stat.label}
                            className="bg-white p-6 hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-xl"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-[#757575] mb-2">{stat.label}</p>
                                    <p className="text-4xl font-bold mb-1">{stat.value}</p>
                                    <div className="flex items-center gap-1 text-[#43A047] text-sm">
                                        <TrendingUp size={14}/>
                                        <span>{stat.trend} from last month</span>
                                    </div>
                                </div>
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110"
                                    style={{backgroundColor: stat.bgColor, color: stat.color}}
                                >
                                    <Icon size={28}/>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Specialty Distribution Pie Chart */}
                <Card className="bg-white p-6 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-4">Specialty Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={specialtyData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {specialtyData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                ))}
                            </Pie>
                            <Tooltip/>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {specialtyData.map((item, index) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{backgroundColor: COLORS[index % COLORS.length]}}
                                />
                                <span className="text-xs text-[#757575]">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Quality Score Distribution Bar Chart */}
                <Card className="bg-white p-6 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-4">Quality Score Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={qualityData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} fontSize={11}/>
                            <YAxis/>
                            <Tooltip/>
                            <Bar dataKey="count" fill="#1976D2" radius={[8, 8, 0, 0]}>
                                {qualityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color}/>
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* State-wise Distribution */}
                <Card className="bg-white p-6 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-4">Top States by Provider Count</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stateData} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis type="number"/>
                            <YAxis dataKey="state" type="category" width={40}/>
                            <Tooltip/>
                            <Bar dataKey="count" fill="#43A047" radius={[0, 8, 8, 0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Quality Score Trend (Mock Data) */}
                <Card className="bg-white p-6 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-4">Quality Score Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                            data={[
                                {month: 'Jan', score: 82},
                                {month: 'Feb', score: 84},
                                {month: 'Mar', score: 83},
                                {month: 'Apr', score: 86},
                                {month: 'May', score: 87},
                                {month: 'Jun', score: stats.avgQualityScore}
                            ]}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="month"/>
                            <YAxis domain={[70, 100]}/>
                            <Tooltip/>
                            <Area type="monotone" dataKey="score" stroke="#9C27B0" fill="#F3E5F5"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performers */}
                <Card className="bg-white p-6 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Award className="text-[#FFD700]" size={24}/>
                        Top Performers
                    </h3>
                    <div className="space-y-3">
                        {topPerformers.length > 0 ? (
                            topPerformers.map((provider, index) => (
                                <div
                                    key={provider.id}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F5F5F5] transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-white flex items-center justify-center font-bold text-sm">
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#212121]">{provider.name}</p>
                                            <p className="text-xs text-[#757575]">{provider.specialty}</p>
                                        </div>
                                    </div>
                                    <Badge variant="success" className="font-semibold">
                                        {provider.qualityScore}%
                                    </Badge>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-[#757575] py-4">No data available</p>
                        )}
                    </div>
                </Card>

                {/* Low Performers - Needs Attention */}
                <Card className="bg-white p-6 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <AlertCircle className="text-[#E53935]" size={24}/>
                        Needs Attention
                    </h3>
                    <div className="space-y-3">
                        {lowPerformers.length > 0 ? (
                            lowPerformers.map((provider) => (
                                <div
                                    key={provider.id}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-[#FFEBEE] transition-colors"
                                >
                                    <div>
                                        <p className="font-medium text-[#212121]">{provider.name}</p>
                                        <p className="text-xs text-[#757575]">{provider.specialty}</p>
                                    </div>
                                    <Badge variant="error" className="font-semibold">
                                        {provider.qualityScore}%
                                    </Badge>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-[#43A047] py-4">
                                <p className="font-medium">🎉 All providers performing well!</p>
                                <p className="text-xs text-[#757575] mt-1">No providers below 60% quality score</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
