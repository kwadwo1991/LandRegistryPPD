
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LandParcel, RegistrationStatus } from '../types';
import { LandRegistryService } from '../services/landRegistryService';
import Card from './ui/Card';
import { Loader, User, MapPin, Scale, FileText, ArrowLeft } from 'lucide-react';

const StatusBadge = ({ status }: { status: RegistrationStatus }) => {
    const baseClasses = "px-3 py-1.5 inline-flex text-sm leading-5 font-semibold rounded-full";
    const statusClasses = {
        [RegistrationStatus.Approved]: "bg-green-100 text-green-800",
        [RegistrationStatus.Pending]: "bg-yellow-100 text-yellow-800",
        [RegistrationStatus.Queried]: "bg-orange-100 text-orange-800",
        [RegistrationStatus.Rejected]: "bg-red-100 text-red-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number | undefined }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500 flex items-center">
            {icon} <span className="ml-2">{label}</span>
        </dt>
        <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
);

const RegistrationDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [parcel, setParcel] = useState<LandParcel | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                setLoading(true);
                const data = await LandRegistryService.getParcelById(id);
                setParcel(data || null);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader className="animate-spin h-8 w-8 text-green-700" /></div>;
    }

    if (!parcel) {
        return <Card title="Error"><p>Registration record not found.</p></Card>;
    }

    return (
        <div className="space-y-6">
            <Link to="/registrations" className="flex items-center text-sm font-medium text-green-700 hover:text-green-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
            </Link>
            <Card>
                <div className="p-4 border-b flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Parcel ID: {parcel.id}</h2>
                        <p className="text-sm text-gray-500">Submitted on {new Date(parcel.submissionDate).toLocaleString()}</p>
                    </div>
                    <StatusBadge status={parcel.status} />
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center"><User className="mr-2 h-5 w-5 text-green-700"/>Applicant Information</h3>
                        <dl className="space-y-3">
                            <DetailItem icon={<></>} label="Full Name" value={parcel.applicant.fullName} />
                            <DetailItem icon={<></>} label="Contact" value={`${parcel.applicant.phone} / ${parcel.applicant.email}`} />
                            <DetailItem icon={<></>} label="Address" value={parcel.applicant.address} />
                            <DetailItem icon={<></>} label="ID" value={`${parcel.applicant.idType}: ${parcel.applicant.idNumber}`} />
                        </dl>
                    </div>

                     <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center"><MapPin className="mr-2 h-5 w-5 text-green-700"/>Land Parcel Details</h3>
                        <dl className="space-y-3">
                            <DetailItem icon={<></>} label="Location" value={`${parcel.location.town}, ${parcel.location.district}, ${parcel.location.region}`} />
                            <DetailItem icon={<></>} label="GPS Coordinates" value={`${parcel.location.gpsCoordinates.latitude}, ${parcel.location.gpsCoordinates.longitude}`} />
                            <DetailItem icon={<Scale className="inline h-4 w-4"/>} label="Size" value={`${parcel.sizeAcres} acres`} />
                            <DetailItem icon={<></>} label="Land Use" value={parcel.landUse} />
                        </dl>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center"><FileText className="mr-2 h-5 w-5 text-green-700"/>Uploaded Documents</h3>
                        <ul>
                            {parcel.documents.map((doc, index) => (
                                <li key={index} className="text-sm text-green-700 hover:underline">
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Card>

            <Card title="Status History">
                <div className="relative p-4">
                  <div className="absolute left-4 top-4 bottom-4 w-px bg-gray-200"></div>
                  {parcel.statusHistory.map((history, index) => (
                    <div key={index} className="mb-6 ml-8">
                      <div className="absolute -left-0.5 mt-1.5 h-2 w-2 rounded-full bg-green-700"></div>
                      <time className="mb-1 text-sm font-normal leading-none text-gray-400">{new Date(history.date).toLocaleDateString()}</time>
                      <h3 className="text-lg font-semibold text-gray-900">{history.status}</h3>
                      <p className="text-base font-normal text-gray-500">{history.notes}</p>
                    </div>
                  ))}
                </div>
            </Card>
        </div>
    );
};

export default RegistrationDetails;
