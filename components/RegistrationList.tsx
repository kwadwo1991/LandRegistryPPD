
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandParcel, RegistrationStatus } from '../types';
import { LandRegistryService } from '../services/landRegistryService';
import Card from './ui/Card';
import Input from './ui/Input';
import { Loader, Search, ChevronUp, ChevronDown } from 'lucide-react';

const StatusBadge = ({ status }: { status: RegistrationStatus }) => {
    const baseClasses = "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full";
    const statusClasses = {
        [RegistrationStatus.Approved]: "bg-green-100 text-green-800",
        [RegistrationStatus.Pending]: "bg-yellow-100 text-yellow-800",
        [RegistrationStatus.Queried]: "bg-orange-100 text-orange-800",
        [RegistrationStatus.Rejected]: "bg-red-100 text-red-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

// FIX: Define a type for all sortable keys to fix type error and improve maintainability.
type SortableKey = keyof LandParcel | 'applicant.fullName' | 'location.town';

const RegistrationList: React.FC = () => {
    const [parcels, setParcels] = useState<LandParcel[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    // FIX: Use the new SortableKey type for sortConfig state.
    const [sortConfig, setSortConfig] = useState<{ key: SortableKey, direction: 'ascending' | 'descending' } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await LandRegistryService.getParcels();
            setParcels(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const filteredParcels = useMemo(() => {
        return parcels.filter(parcel =>
            parcel.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            parcel.applicant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            parcel.location.town.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [parcels, searchTerm]);
    
    const sortedParcels = useMemo(() => {
        const sortableItems = [...filteredParcels];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue, bValue;
                // FIX: Update sorting logic to handle nested properties 'applicant.fullName' and 'location.town'.
                if (sortConfig.key === 'applicant.fullName') {
                    aValue = a.applicant.fullName;
                    bValue = b.applicant.fullName;
                } else if (sortConfig.key === 'location.town') {
                    aValue = a.location.town;
                    bValue = b.location.town;
                } else {
                    aValue = a[sortConfig.key as keyof LandParcel];
                    bValue = b[sortConfig.key as keyof LandParcel];
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredParcels, sortConfig]);

    // FIX: Use SortableKey for the key parameter.
    const requestSort = (key: SortableKey) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // FIX: Use SortableKey for the sortKey prop.
    const SortableHeader = ({ label, sortKey }: { label: string, sortKey: SortableKey }) => (
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort(sortKey)}>
            <div className="flex items-center">
                {label}
                {sortConfig?.key === sortKey && (sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4 ml-1"/> : <ChevronDown className="h-4 w-4 ml-1"/>)}
            </div>
        </th>
    );

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader className="animate-spin h-8 w-8 text-green-700" /></div>;
    }

    return (
        <Card>
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Land Registrations</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                        placeholder="Search by ID, Name, Town..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortableHeader label="Parcel ID" sortKey="id" />
                            <SortableHeader label="Applicant Name" sortKey="applicant.fullName" />
                            <SortableHeader label="Location" sortKey="location.town" />
                            <SortableHeader label="Size (Acres)" sortKey="sizeAcres" />
                            <SortableHeader label="Status" sortKey="status" />
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedParcels.map((parcel) => (
                            <tr key={parcel.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/registrations/${parcel.id}`)}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700">{parcel.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parcel.applicant.fullName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parcel.location.town}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parcel.sizeAcres}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={parcel.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {sortedParcels.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No records found.
                    </div>
                 )}
            </div>
        </Card>
    );
};

export default RegistrationList;