import React from 'react';
import {Users, UserCheck, TrendingUp, Clock} from 'lucide-react';
import {Card} from './ui/card';
import {Badge} from './ui/badge';

export function Dashboard() {
    const stats = [
        {label: 'Total Providers', value: '1,248', icon: Users, color: '#1976D2', bgColor: '#E3F2FD'},
        {label: 'Active Providers', value: '1,089', icon: UserCheck, color: '#43A047', bgColor: '#E8F5E9'},
        {label: 'Avg Quality Score', value: '87%', icon: TrendingUp, color: '#9C27B0', bgColor: '#F3E5F5'},
        {label: 'Validation Jobs', value: '24', icon: Clock, color: '#FB8C00', bgColor: '#FFF3E0'}
    ];

    const qualityDistribution = [
        {label: 'High (80-100%)', count: 856, percentage: 68.6, color: '#43A047'},
        {label: 'Medium (60-79%)', count: 245, percentage: 19.6, color: '#FB8C00'},
        {label: 'Low (40-59%)', count: 98, percentage: 7.9, color: '#FF9800'},
        {label: 'Very Low (0-39%)', count: 49, percentage: 3.9, color: '#E53935'}
    ];

    const topSpecialties = [
        {name: 'Cardiology', count: 234},
        {name: 'Internal Medicine', count: 198},
        {name: 'Pediatrics', count: 156},
        {name: 'Orthopedics', count: 142},
        {name: 'Dermatology', count: 128}
    ];

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-base text-[#757575]">Overview of provider data and validation metrics</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card
                            key={stat.label}
                            className="bg-white p-6 hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-xl"
                            style={{animationDelay: `${index * 100}ms`}}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-[#757575] mb-2">{stat.label}</p>
                                    <p className="text-4xl font-bold mb-1">{stat.value}</p>
                                    <div className="flex items-center gap-1 text-[#43A047] text-sm">
                                        <TrendingUp size={14}/>
                                        <span>+12% from last month</span>
                                    </div>
                                </div>
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-12"
                                    style={{backgroundColor: stat.bgColor, color: stat.color}}
                                >
                                    <Icon size={28}/>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quality Distribution Chart */}
                <Card className="bg-white p-6 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-6">Quality Score Distribution</h3>
                    <div className="space-y-6">
                        {qualityDistribution.map((item, index) => (
                            <div key={item.label} style={{animationDelay: `${index * 100}ms`}}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-[#757575]">{item.label}</span>
                                    <span className="text-sm font-medium">{item.count} providers</span>
                                </div>
                                <div className="h-10 bg-[#F5F5F5] rounded-lg overflow-hidden relative group">
                                    <div
                                        className="h-full flex items-center px-4 text-white font-medium transition-all duration-1000 ease-out hover:opacity-90"
                                        style={{
                                            width: `${item.percentage}%`,
                                            backgroundColor: item.color,
                                            minWidth: item.percentage > 10 ? 'auto' : '60px'
                                        }}
                                    >
                                        <span className="relative z-10">{item.percentage}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Top Specialties */}
                <Card className="bg-white p-6 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-6">Top Specialties</h3>
                    <div className="space-y-4">
                        {topSpecialties.map((specialty, index) => (
                            <div
                                key={specialty.name}
                                className="flex items-center justify-between py-3 border-b border-[#F5F5F5] last:border-0 hover:bg-[#F5F5F5] px-2 -mx-2 rounded-lg transition-all duration-200"
                                style={{animationDelay: `${index * 100}ms`}}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1976D2] to-[#0d47a1] text-white flex items-center justify-center flex-shrink-0 shadow-md hover:scale-110 transition-transform font-semibold">
                                        #{index + 1}
                                    </div>
                                    <span className="text-base font-medium text-[#212121]">{specialty.name}</span>
                                </div>
                                <Badge variant="default"
                                       className="hover:scale-110 transition-transform">{specialty.count}</Badge>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
