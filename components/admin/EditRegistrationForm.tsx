import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LandParcel, RegistrationType } from '../../types';
import { LandRegistryService } from '../../services/landRegistryService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Label from '../ui/Label';
import Input from '../ui/Input';
import { Loader, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const EditRegistrationForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [parcel, setParcel] = useState<LandParcel | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleApplicantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!parcel) return;
        setParcel({
            ...parcel,
            applicant: { ...parcel.applicant, [e.target.name]: e.target.value }
        });
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!parcel) return;
        setParcel({
            ...parcel,
            location: { ...parcel.location, [e.target.name]: e.target.value }
        });
    };

    const handleGpsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!parcel) return;
        setParcel({
            ...parcel,
            location: {
                ...parcel.location,
                gpsCoordinates: { ...parcel.location.gpsCoordinates, [e.target.name]: e.target.value }
            }
        });
    };

    const handleParcelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!parcel) return;
        setParcel({
            ...parcel,
            [e.target.name]: e.target.value
        });
    };

    const handlePermitDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!parcel) return;
        setParcel({
            ...parcel,
            permitDetails: { ...parcel.permitDetails, [e.target.name]: e.target.value }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!parcel || !id || !user) return;
        setIsSubmitting(true);
        try {
            await LandRegistryService.updateParcel(id, parcel, user.username || user.role);
            alert('Application updated successfully!');
            navigate(`/registrations/${id}`);
        } catch (error) {
            console.error(error);
            alert('Failed to update application.');
        }
        setIsSubmitting(false);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader className="animate-spin h-8 w-8 text-green-700" /></div>;
    }

    if (!parcel) {
        return <Card title="Error"><p>Registration record not found.</p></Card>;
    }

    return (
        <div className="space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-green-700 hover:text-green-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </button>
            <Card title={`Edit Application: ${parcel.id}`}>
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Applicant Details */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Applicant Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><Label htmlFor="fullName">Full Name</Label><Input name="fullName" value={parcel.applicant.fullName} onChange={handleApplicantChange} /></div>
                                <div><Label htmlFor="phone">Phone Number</Label><Input name="phone" type="tel" value={parcel.applicant.phone} onChange={handleApplicantChange} /></div>
                                <div><Label htmlFor="email">Email Address</Label><Input name="email" type="email" value={parcel.applicant.email} onChange={handleApplicantChange} /></div>
                                <div><Label htmlFor="address">Address</Label><Input name="address" value={parcel.applicant.address} onChange={handleApplicantChange} /></div>
                                <div>
                                    <Label htmlFor="idType">ID Type</Label>
                                    <select name="idType" value={parcel.applicant.idType} onChange={handleApplicantChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                                        <option>Ghana Card</option><option>Passport</option><option>Drivers License</option>
                                    </select>
                                </div>
                                <div><Label htmlFor="idNumber">ID Number</Label><Input name="idNumber" value={parcel.applicant.idNumber} onChange={handleApplicantChange} /></div>
                            </div>
                        </div>

                        {/* Location Details */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Location Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><Label>Region</Label><Input name="region" value={parcel.location.region} onChange={handleLocationChange} /></div>
                                <div><Label>District</Label><Input name="district" value={parcel.location.district} onChange={handleLocationChange} /></div>
                                <div><Label htmlFor="town">Town/Locality</Label><Input name="town" value={parcel.location.town} onChange={handleLocationChange} /></div>
                                <div><Label htmlFor="latitude">GPS Latitude</Label><Input name="latitude" value={parcel.location.gpsCoordinates.latitude} onChange={handleGpsChange} /></div>
                                <div><Label htmlFor="longitude">GPS Longitude</Label><Input name="longitude" value={parcel.location.gpsCoordinates.longitude} onChange={handleGpsChange} /></div>
                            </div>
                        </div>

                        {/* Project Details */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Project Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {parcel.type === RegistrationType.Land && (
                                    <>
                                        <div><Label htmlFor="sizeAcres">Size (in Acres)</Label><Input name="sizeAcres" type="number" value={parcel.sizeAcres || ''} onChange={handleParcelChange} /></div>
                                        <div>
                                            <Label htmlFor="landUse">Proposed Land Use</Label>
                                            <select name="landUse" value={parcel.landUse || ''} onChange={handleParcelChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                                                <option>Residential</option><option>Commercial</option><option>Agricultural</option><option>Industrial</option><option>Mixed-Use</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {parcel.type === RegistrationType.Building && (
                                    <>
                                        <div className="md:col-span-2"><Label htmlFor="proposedStructure">Proposed Building Description</Label><Input name="proposedStructure" value={parcel.permitDetails?.proposedStructure || ''} onChange={handlePermitDetailsChange} /></div>
                                        <div><Label htmlFor="estimatedCost">Estimated Construction Cost (GHS)</Label><Input name="estimatedCost" type="number" value={parcel.permitDetails?.estimatedCost || ''} onChange={handlePermitDetailsChange} /></div>
                                        <div><Label htmlFor="numFloors">Number of Floors</Label><Input name="numFloors" type="number" value={parcel.permitDetails?.numFloors || ''} onChange={handlePermitDetailsChange} /></div>
                                        <div><Label htmlFor="floorArea">Total Floor Area (sqm)</Label><Input name="floorArea" type="number" value={parcel.permitDetails?.floorArea || ''} onChange={handlePermitDetailsChange} /></div>
                                        <div><Label htmlFor="architectName">Architect Name</Label><Input name="architectName" value={parcel.permitDetails?.architectName || ''} onChange={handlePermitDetailsChange} /></div>
                                        <div className="md:col-span-2"><Label htmlFor="contractorName">Contractor Name</Label><Input name="contractorName" value={parcel.permitDetails?.contractorName || ''} onChange={handlePermitDetailsChange} /></div>
                                    </>
                                )}

                                {parcel.type === RegistrationType.Development && (
                                    <>
                                        <div className="md:col-span-2"><Label htmlFor="proposedStructure">Development Description</Label><Input name="proposedStructure" value={parcel.permitDetails?.proposedStructure || ''} onChange={handlePermitDetailsChange} /></div>
                                        <div><Label htmlFor="estimatedCost">Estimated Development Cost (GHS)</Label><Input name="estimatedCost" type="number" value={parcel.permitDetails?.estimatedCost || ''} onChange={handlePermitDetailsChange} /></div>
                                        <div>
                                            <Label htmlFor="developmentType">Development Type</Label>
                                            <select name="developmentType" value={parcel.permitDetails?.developmentType || ''} onChange={handlePermitDetailsChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                                                <option>Subdivision</option><option>Rezoning</option><option>Infrastructure</option><option>Landscaping</option>
                                            </select>
                                        </div>
                                        <div><Label htmlFor="siteArea">Total Site Area (sqm)</Label><Input name="siteArea" type="number" value={parcel.permitDetails?.siteArea || ''} onChange={handlePermitDetailsChange} /></div>
                                        <div className="md:col-span-2"><Label htmlFor="contractorName">Lead Consultant/Contractor</Label><Input name="contractorName" value={parcel.permitDetails?.contractorName || ''} onChange={handlePermitDetailsChange} /></div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default EditRegistrationForm;
