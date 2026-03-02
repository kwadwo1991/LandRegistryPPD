import React, { useState, useEffect } from 'react';
import { LandParcel, RegistrationStatus, RegistrationType } from '../../types';
import { LandRegistryService } from '../../services/landRegistryService';
import Card from '../ui/Card';
import { FileCheck2, FileClock, FileQuestion, Loader, Building2, Construction, Map } from 'lucide-react';

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

const AdminDashboard: React.FC = () => {
    const [parcels, setParcels] = useState<LandParcel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await LandRegistryService.getParcels();
            setParcels(data);
            setLoading(false);
        };
        fetchData();
    }, []);

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

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader className="animate-spin h-8 w-8 text-green-700" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Applications" 
                    value={stats.total} 
                    icon={<FileCheck2 className="h-6 w-6 text-white"/>} 
                    colorClass="bg-blue-500" 
                />
                <StatCard 
                    title="Land Registrations" 
                    value={stats.land} 
                    icon={<Map className="h-6 w-6 text-white"/>} 
                    colorClass="bg-indigo-500" 
                />
                <StatCard 
                    title="Development Permits" 
                    value={stats.development} 
                    icon={<Construction className="h-6 w-6 text-white"/>} 
                    colorClass="bg-purple-500" 
                />
                <StatCard 
                    title="Building Permits" 
                    value={stats.building} 
                    icon={<Building2 className="h-6 w-6 text-white"/>} 
                    colorClass="bg-emerald-500" 
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Pending Review" value={stats.pending} icon={<FileClock className="h-6 w-6 text-white"/>} colorClass="bg-yellow-500" />
                <StatCard title="Queried" value={stats.queried} icon={<FileQuestion className="h-6 w-6 text-white"/>} colorClass="bg-orange-500" />
                <StatCard title="Approved" value={stats.approved} icon={<FileCheck2 className="h-6 w-6 text-white"/>} colorClass="bg-green-500" />
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin Insights</h3>
                <p className="text-gray-600">
                    This dashboard provides a high-level overview of all registrations across the district. 
                    Use the tabs above to manage users or create new administrative accounts.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;
