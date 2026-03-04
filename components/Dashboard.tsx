import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { LandParcel, RegistrationStatus, RegistrationType } from '../types';
import { LandRegistryService } from '../services/landRegistryService';
import Card from './ui/Card';
import { FileCheck2, FileClock, FileQuestion, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, colorClass }: { title: string; value: number | string; icon: React.ReactNode; colorClass: string; }) => (
    <Card>
        <div className="flex items-center">
            <div className={`p-3 rounded-full ${colorClass}`}>
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    </Card>
);

const Dashboard: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [parcels, setParcels] = useState<LandParcel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            let data = await LandRegistryService.getParcels();
            if (user && user.role !== 'Admin' && user.role !== 'Head') {
                data = data.filter(p => p.submittedBy === user.username);
            }
            setParcels(data);
            setLoading(false);
        };
        fetchData();
    }, [user]);

    const stats = {
        total: parcels.length,
        approved: parcels.filter(p => p.status === RegistrationStatus.Approved).length,
        pending: parcels.filter(p => p.status === RegistrationStatus.Pending).length,
        queried: parcels.filter(p => p.status === RegistrationStatus.Queried).length,
        rejected: parcels.filter(p => p.status === RegistrationStatus.Rejected).length,
        land: parcels.filter(p => p.type === RegistrationType.Land).length,
        development: parcels.filter(p => p.type === RegistrationType.Development).length,
        building: parcels.filter(p => p.type === RegistrationType.Building).length,
    };

    const chartData = [
        { name: 'Land', count: stats.land },
        { name: 'Development', count: stats.development },
        { name: 'Building', count: stats.building },
    ];

    const statusData = [
        { name: 'Approved', value: stats.approved, color: '#10b981' },
        { name: 'Pending', value: stats.pending, color: '#f59e0b' },
        { name: 'Queried', value: stats.queried, color: '#f97316' },
        { name: 'Rejected', value: stats.rejected, color: '#ef4444' },
    ];

    const trendData = [
        { month: 'Jan', applications: 12 },
        { month: 'Feb', applications: 19 },
        { month: 'Mar', applications: 15 },
        { month: 'Apr', applications: 22 },
        { month: 'May', applications: 30 },
        { month: 'Jun', applications: stats.total },
    ];

    const userActivityData = Array.from(new Set(parcels.map(p => p.submittedBy || 'Anonymous'))).map(user => ({
        name: user,
        count: parcels.filter(p => (p.submittedBy || 'Anonymous') === user).length
    })).slice(0, 5);
    
    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader className="animate-spin h-8 w-8 text-green-700" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                {user && <p className="text-lg text-gray-600">Welcome, <span className="font-semibold">{user.username}</span> ({user.role})</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Applications" value={stats.total} icon={<FileCheck2 className="h-6 w-6 text-white"/>} colorClass="bg-blue-500" />
                <StatCard title="Land Registrations" value={stats.land} icon={<FileCheck2 className="h-6 w-6 text-white"/>} colorClass="bg-indigo-500" />
                <StatCard title="Development Permits" value={stats.development} icon={<FileCheck2 className="h-6 w-6 text-white"/>} colorClass="bg-purple-500" />
                <StatCard title="Building Permits" value={stats.building} icon={<FileCheck2 className="h-6 w-6 text-white"/>} colorClass="bg-emerald-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Pending Review" value={stats.pending} icon={<FileClock className="h-6 w-6 text-white"/>} colorClass="bg-yellow-500" />
                <StatCard title="Queried" value={stats.queried} icon={<FileQuestion className="h-6 w-6 text-white"/>} colorClass="bg-orange-500" />
                <StatCard title="Approved / Registered" value={stats.approved} icon={<FileCheck2 className="h-6 w-6 text-white"/>} colorClass="bg-green-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Application Trends (Last 6 Months)">
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="applications" stroke="#15803d" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card title="Status Distribution">
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Application Type Breakdown" className="lg:col-span-2">
                     <div style={{ width: '100%', height: 300, minHeight: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" name="Total Applications" fill="#15803d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card title="User Submission Activity">
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={userActivityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <Card title="Recent Activities">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {parcels.slice(0, 5).map(p => (
                                <tr key={p.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700">
                                        <Link to={`/registrations/${p.id}`}>{p.id}</Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.applicant.fullName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(p.submissionDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${p.status === RegistrationStatus.Approved ? 'bg-green-100 text-green-800' : p.status === RegistrationStatus.Queried ? 'bg-orange-100 text-orange-800' : p.status === RegistrationStatus.Rejected ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {p.status === RegistrationStatus.Approved && p.type === RegistrationType.Land ? 'Registered' : p.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
