import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LandParcel, RegistrationStatus, UserRole, RegistrationType, Permission } from '../types';
import { LandRegistryService } from '../services/landRegistryService';
import Card from './ui/Card';
import { Loader, User, MapPin, Scale, FileText, ArrowLeft, PlusCircle, Edit, Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import Button from './ui/Button';
import { AuthContext } from '../context/AuthContext';
import { hasPermission } from '../App';
import ExportButtons from './ui/ExportButtons';
import Input from './ui/Input';
import Label from './ui/Label';

const StatusBadge = ({ status, type }: { status: RegistrationStatus, type: RegistrationType }) => {
    const baseClasses = "px-3 py-1.5 inline-flex text-sm leading-5 font-semibold rounded-full";
    const statusClasses = {
        [RegistrationStatus.Approved]: "bg-green-100 text-green-800",
        [RegistrationStatus.Pending]: "bg-yellow-100 text-yellow-800",
        [RegistrationStatus.Queried]: "bg-orange-100 text-orange-800",
        [RegistrationStatus.Rejected]: "bg-red-100 text-red-800",
    };

    const label = status === RegistrationStatus.Approved && type === RegistrationType.Land 
        ? 'Registered' 
        : status;

    return <span className={`${baseClasses} ${statusClasses[status]}`}>{label}</span>;
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
    const [technicalDate, setTechnicalDate] = useState('');
    const [spatialDate, setSpatialDate] = useState('');
    const [deadlineWarning, setDeadlineWarning] = useState<string | null>(null);

    const today = new Date('2026-03-03T23:54:46-08:00');
    const approvalDeadline = parcel?.dueDate ? new Date(parcel.dueDate) : (() => {
        const d = new Date(parcel?.submissionDate || today);
        d.setDate(d.getDate() + 30);
        return d;
    })();
    
    const isOverdue = today > approvalDeadline && parcel?.status !== RegistrationStatus.Approved;
    const daysRemaining = Math.ceil((approvalDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const handleCalculateSpatialDate = (techDate: string) => {
        setTechnicalDate(techDate);
        setDeadlineWarning(null);
        if (techDate) {
            const date = new Date(techDate);
            // Estimate 7 days after
            date.setDate(date.getDate() + 7);
            const spatialStr = date.toISOString().split('T')[0];
            setSpatialDate(spatialStr);

            if (new Date(spatialStr) > approvalDeadline) {
                setDeadlineWarning(`Warning: The estimated Spatial Planning Committee date (${new Date(spatialStr).toLocaleDateString()}) exceeds the 30-day approval deadline (${approvalDeadline.toLocaleDateString()}).`);
            }
        }
    };

    const handleScheduleMeetings = async () => {
        if (id && technicalDate && spatialDate && user) {
            setIsUpdating(true);
            const updatedParcel = await LandRegistryService.scheduleMeetings(
                id,
                technicalDate,
                spatialDate,
                user.username || user.role,
                user.email || 'admin@techimannorth.gov.gh'
            );
            if (updatedParcel) {
                setParcel(updatedParcel);
                setTechnicalDate('');
                setSpatialDate('');
            }
            setIsUpdating(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (id && notes && user) {
            setIsUpdating(true);
            const updatedParcel = await LandRegistryService.updateParcelStatus(
                id, 
                newStatus, 
                notes, 
                user.username || user.role,
                user.email || 'admin@techimannorth.gov.gh'
            );
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
            <div className="flex justify-between items-center">
                <Link to="/registrations" className="flex items-center text-sm font-medium text-green-700 hover:text-green-900">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to List
                </Link>
                <div className="flex items-center space-x-3">
                    <ExportButtons data={[parcel]} filename={`registration_${parcel.id}`} />
                    {hasPermission(user, Permission.EditRegistration) && (
                        <Link to={`/admin/edit-registration/${parcel.id}`}>
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" /> Edit Application
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
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
                        {parcel.type !== RegistrationType.Land && (
                            <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isOverdue ? 'bg-red-100 text-red-800' : daysRemaining <= 5 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                                {isOverdue ? (
                                    <><AlertTriangle className="h-3 w-3 mr-1" /> Overdue for Approval</>
                                ) : parcel.status === RegistrationStatus.Approved ? (
                                    <><CheckCircle className="h-3 w-3 mr-1" /> Approved within Deadline</>
                                ) : (
                                    <><Clock className="h-3 w-3 mr-1" /> {daysRemaining} days remaining for approval</>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <StatusBadge status={parcel.status} type={parcel.type} />
                        {parcel.type !== RegistrationType.Land && <p className="text-xs text-gray-500 mt-1">Deadline: {approvalDeadline.toLocaleDateString()}</p>}
                    </div>
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
                {(parcel.technicalSubcommitteeDate || parcel.spatialPlanningCommitteeDate) && (
                    <div className="p-4 bg-green-50 border-t border-green-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Technical Subcommittee Meeting</p>
                                <p className="text-sm font-medium text-gray-900">{parcel.technicalSubcommitteeDate ? new Date(parcel.technicalSubcommitteeDate).toLocaleDateString() : 'Not Scheduled'}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Clock className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Spatial Planning Committee Approval (Est.)</p>
                                <p className="text-sm font-medium text-gray-900">{parcel.spatialPlanningCommitteeDate ? new Date(parcel.spatialPlanningCommitteeDate).toLocaleDateString() : 'Not Scheduled'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {user && (user.role === UserRole.Admin || user.role === UserRole.Head) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Update Status">
                        <div className="p-4 space-y-4">
                            <div>
                                <Label>New Status</Label>
                                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as RegistrationStatus)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                                    {Object.values(RegistrationStatus).filter(() => {
                                        // If it's Land, maybe "Approved" is not the right term if user says "Approvals are only for Building/Development"
                                        // But usually they still need some final state. 
                                        // Let's keep the statuses but maybe rename the button or something if needed.
                                        // The user said "Approvals are only for Building or Development Permits"
                                        return true;
                                    }).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label>Notes</Label>
                                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes..." className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm h-24"></textarea>
                            </div>
                            <Button onClick={handleUpdateStatus} disabled={isUpdating} className="w-full">
                                <PlusCircle className="h-5 w-5 mr-2"/> {isUpdating ? 'Updating...' : parcel.type === RegistrationType.Land ? 'Update Registration Status' : 'Update Application Status'}
                            </Button>
                        </div>
                    </Card>

                    {parcel.type !== RegistrationType.Land && (
                        <Card title="Schedule Committee Meetings">
                            <div className="p-4 space-y-4">
                                {deadlineWarning && (
                                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-md flex items-start space-x-2">
                                        <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                        <p className="text-sm text-orange-700">{deadlineWarning}</p>
                                    </div>
                                )}
                                <div>
                                    <Label>Technical Subcommittee Date</Label>
                                    <Input 
                                        type="date" 
                                        value={technicalDate} 
                                        onChange={(e) => handleCalculateSpatialDate(e.target.value)}
                                        className="mt-1"
                                    />
                                    <p className="text-xs text-gray-500 mt-1 italic">Setting this will automatically estimate the Spatial Planning Committee date (7 days later).</p>
                                </div>
                                <div>
                                    <Label>Spatial Planning Committee Date (Estimated)</Label>
                                    <Input 
                                        type="date" 
                                        value={spatialDate} 
                                        onChange={(e) => {
                                            setSpatialDate(e.target.value);
                                            if (new Date(e.target.value) > approvalDeadline) {
                                                setDeadlineWarning(`Warning: This date exceeds the 30-day approval deadline (${approvalDeadline.toLocaleDateString()}).`);
                                            } else {
                                                setDeadlineWarning(null);
                                            }
                                        }}
                                        className="mt-1"
                                    />
                                </div>
                                <Button onClick={handleScheduleMeetings} disabled={isUpdating || !technicalDate || !spatialDate} variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                                    <Calendar className="h-5 w-5 mr-2"/> {isUpdating ? 'Scheduling...' : 'Set Meeting Dates'}
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
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

            <Card title="Audit Trail">
                <div className="p-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {parcel.auditLogs.map((log) => (
                                    <tr key={log.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.action}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="text-sm text-gray-900">{log.userId}</div>
                                            <div className="text-xs text-gray-500">{log.userEmail}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{log.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default RegistrationDetails;
