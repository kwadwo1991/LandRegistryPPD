import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LandParcel, RegistrationStatus, UserRole, RegistrationType } from '../types';
import { LandRegistryService } from '../services/landRegistryService';
import Card from './ui/Card';
import { Loader, User, MapPin, Scale, FileText, ArrowLeft, PlusCircle } from 'lucide-react';
import Button from './ui/Button';
import { AuthContext } from '../context/AuthContext';

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
        <dd className="mt-1 text-sm text-gray-900">{value || 'N/A'}</dd>
    </div>
);

const RegistrationDetails: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams<{ id: string }>();
    const [parcel, setParcel] = useState<LandParcel | null>(null);
    const [newStatus, setNewStatus] = useState<RegistrationStatus>(RegistrationStatus.Pending);
    const [notes, setNotes] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateStatus = async () => {
        if (id && notes) {
            setIsUpdating(true);
            const updatedParcel = await LandRegistryService.updateParcelStatus(id, newStatus, notes);
            if (updatedParcel) {
                setParcel(updatedParcel);
                setNotes('');
            }
            setIsUpdating(false);
        }
    };
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
                        <div className="flex items-center space-x-2">
                          <h2 className="text-2xl font-bold text-gray-800">Reference ID: {parcel.id}</h2>
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${parcel.type === RegistrationType.Land ? 'bg-blue-100 text-blue-800' : parcel.type === RegistrationType.Development ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'}`}>
                            {parcel.type}
                          </span>
                        </div>
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
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center"><MapPin className="mr-2 h-5 w-5 text-green-700"/>{parcel.type === RegistrationType.Land ? 'Land Parcel Details' : 'Project Details'}</h3>
                        <dl className="space-y-3">
                            <DetailItem icon={<></>} label="Location" value={`${parcel.location.town}, ${parcel.location.district}, ${parcel.location.region}`} />
                            <DetailItem icon={<></>} label="GPS Coordinates" value={`${parcel.location.gpsCoordinates.latitude}, ${parcel.location.gpsCoordinates.longitude}`} />
                            {parcel.type === RegistrationType.Land ? (
                              <>
                                <DetailItem icon={<Scale className="inline h-4 w-4"/>} label="Size" value={`${parcel.sizeAcres} acres`} />
                                <DetailItem icon={<></>} label="Land Use" value={parcel.landUse} />
                              </>
                            ) : parcel.type === RegistrationType.Building ? (
                              <>
                                <DetailItem icon={<></>} label="Proposed Structure" value={parcel.permitDetails?.proposedStructure} />
                                <DetailItem icon={<></>} label="Estimated Cost" value={`GHS ${parcel.permitDetails?.estimatedCost?.toLocaleString()}`} />
                                <DetailItem icon={<></>} label="Floors" value={parcel.permitDetails?.numFloors} />
                                <DetailItem icon={<></>} label="Floor Area" value={`${parcel.permitDetails?.floorArea} sqm`} />
                                {parcel.permitDetails?.architectName && <DetailItem icon={<></>} label="Architect" value={parcel.permitDetails.architectName} />}
                                {parcel.permitDetails?.contractorName && <DetailItem icon={<></>} label="Contractor" value={parcel.permitDetails.contractorName} />}
                              </>
                            ) : (
                              <>
                                <DetailItem icon={<></>} label="Development Description" value={parcel.permitDetails?.proposedStructure} />
                                <DetailItem icon={<></>} label="Estimated Cost" value={`GHS ${parcel.permitDetails?.estimatedCost?.toLocaleString()}`} />
                                <DetailItem icon={<></>} label="Development Type" value={parcel.permitDetails?.developmentType} />
                                <DetailItem icon={<></>} label="Site Area" value={`${parcel.permitDetails?.siteArea} sqm`} />
                                {parcel.permitDetails?.contractorName && <DetailItem icon={<></>} label="Lead Consultant" value={parcel.permitDetails.contractorName} />}
                              </>
                            )}
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

            {user && (user.role === UserRole.Admin || user.role === UserRole.Head) && (
                <Card title="Update Status">
                    <div className="p-4">
                        <div className="flex items-center space-x-4">
                            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as RegistrationStatus)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                                {Object.values(RegistrationStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes..." className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"></textarea>
                            <Button onClick={handleUpdateStatus} disabled={isUpdating}>
                                <PlusCircle className="h-5 w-5 mr-2"/> {isUpdating ? 'Updating...' : 'Add Status'}
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

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
