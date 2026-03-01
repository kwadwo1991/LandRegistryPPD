import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
                <StatCard title="Approved" value={stats.approved} icon={<FileCheck2 className="h-6 w-6 text-white"/>} colorClass="bg-green-500" />
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
                <Card title="Recent Activities">
                    <ul className="divide-y divide-gray-200">
                        {parcels.slice(0, 5).map(p => (
                            <li key={p.id} className="py-3">
                                <p className="text-sm font-medium text-gray-800">
                                    <Link to={`/registrations/${p.id}`} className="hover:text-green-700">
                                      <span className="font-bold">[{p.type.split(' ')[0]}]</span> {p.id}
                                    </Link>
                                </p>
                                <p className="text-xs text-gray-500">
                                    By {p.applicant.fullName} on {new Date(p.submissionDate).toLocaleDateString()}
                                </p>
                                <p className="text-xs mt-1"><span className={`px-2 py-0.5 rounded-full text-[10px] ${p.status === RegistrationStatus.Approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.status}</span></p>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
