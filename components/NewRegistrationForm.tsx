
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Applicant, LandParcel } from '../types';
import { LandRegistryService } from '../services/landRegistryService';
import Stepper from './ui/Stepper';
import Button from './ui/Button';
import Label from './ui/Label';
import Input from './ui/Input';
import Card from './ui/Card';
import { UploadCloud, CheckCircle } from 'lucide-react';

const steps = ['Applicant Details', 'Land Parcel Details', 'Document Upload', 'Review & Submit'];

const NewRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const [applicant, setApplicant] = useState<Applicant>({
    fullName: '', address: '', phone: '', email: '', idType: 'Ghana Card', idNumber: '',
  });
  const [landDetails, setLandDetails] = useState({
    region: 'Bono East', district: 'Techiman North', town: '',
    latitude: '', longitude: '', sizeAcres: 0, landUse: 'Residential' as LandParcel['landUse'],
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplicantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'idNumber' && applicant.idType === 'Ghana Card') {
      const formattedValue = formatGhanaCard(value);
      setApplicant({ ...applicant, idNumber: formattedValue });
    } else {
      setApplicant({ ...applicant, [name]: value });
    }
  };

  const formatGhanaCard = (value: string) => {
    const digitsOnly = value.replace(/[^\d]/g, '').substring(0, 9);
    let formatted = 'GHA-';
    if (digitsOnly.length > 0) {
      formatted += digitsOnly.substring(0, 9);
    }
    if (digitsOnly.length === 9) {
      // This is a simplified checksum. A real implementation would be more complex.
      const checksum = (digitsOnly.split('').reduce((acc, digit) => acc + parseInt(digit), 0) % 10);
      formatted += `-${checksum}`;
    }
    return formatted;
  };

  const handleLandDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLandDetails({ ...landDetails, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setDocuments(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const mockDocs = documents.map(d => ({ name: d.name, size: d.size, type: d.type, url: '#' }));
    
    const newParcelData: Omit<LandParcel, 'id' | 'submissionDate' | 'status' | 'statusHistory'> = {
        applicant,
        location: {
            region: landDetails.region,
            district: landDetails.district,
            town: landDetails.town,
            gpsCoordinates: { latitude: landDetails.latitude, longitude: landDetails.longitude }
        },
        sizeAcres: Number(landDetails.sizeAcres),
        landUse: landDetails.landUse,
        documents: mockDocs,
    };

    try {
        const newParcel = await LandRegistryService.addParcel(newParcelData);
        alert(`Successfully submitted application! Your Parcel ID is ${newParcel.id}`);
        navigate(`/registrations/${newParcel.id}`);
    } catch(error) {
        alert("There was an error submitting your application.");
        console.error(error);
        setIsSubmitting(false);
    }
  };

  return (
    <Card title="New Land Registration Application">
      <div className="p-4 md:p-6">
        <div className="mb-10">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {currentStep === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label htmlFor="fullName">Full Name</Label><Input name="fullName" value={applicant.fullName} onChange={handleApplicantChange} /></div>
            <div><Label htmlFor="phone">Phone Number</Label><Input name="phone" type="tel" value={applicant.phone} onChange={handleApplicantChange} /></div>
            <div><Label htmlFor="email">Email Address</Label><Input name="email" type="email" value={applicant.email} onChange={handleApplicantChange} /></div>
            <div><Label htmlFor="address">Residential/Postal Address</Label><Input name="address" value={applicant.address} onChange={handleApplicantChange} /></div>
            <div>
                <Label htmlFor="idType">ID Type</Label>
                <select name="idType" value={applicant.idType} onChange={handleApplicantChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                    <option>Ghana Card</option><option>Passport</option><option>Drivers License</option>
                </select>
            </div>
            <div><Label htmlFor="idNumber">ID Number</Label><Input name="idNumber" value={applicant.idNumber} onChange={handleApplicantChange} /></div>
          </div>
        )}
        
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label>Region</Label><Input value={landDetails.region} disabled /></div>
            <div><Label>District</Label><Input value={landDetails.district} disabled /></div>
            <div><Label htmlFor="town">Town/Locality</Label><Input name="town" value={landDetails.town} onChange={handleLandDetailsChange} /></div>
            <div><Label htmlFor="sizeAcres">Size (in Acres)</Label><Input name="sizeAcres" type="number" value={landDetails.sizeAcres} onChange={handleLandDetailsChange} /></div>
            <div><Label htmlFor="latitude">GPS Latitude</Label><Input name="latitude" value={landDetails.latitude} onChange={handleLandDetailsChange} /></div>
            <div><Label htmlFor="longitude">GPS Longitude</Label><Input name="longitude" value={landDetails.longitude} onChange={handleLandDetailsChange} /></div>
            <div className="md:col-span-2">
                <Label htmlFor="landUse">Proposed Land Use</Label>
                <select name="landUse" value={landDetails.landUse} onChange={handleLandDetailsChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                    <option>Residential</option><option>Commercial</option><option>Agricultural</option><option>Industrial</option><option>Mixed-Use</option>
                </select>
            </div>
          </div>
        )}

        {currentStep === 2 && (
            <div>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                <span>Upload files</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                    </div>
                </div>
                <div className="mt-4">
                    <h4 className="font-medium text-gray-700">Uploaded Files:</h4>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                        {documents.length > 0 ? documents.map((file, index) => (
                            <li key={index} className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2"/>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                        )) : (<li>No files uploaded.</li>)}
                    </ul>
                </div>
            </div>
        )}
        
        {currentStep === 3 && (
            <div className="space-y-6">
                <div><h3 className="text-lg font-medium text-gray-900 border-b pb-2">Applicant Details</h3>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <p><strong>Name:</strong> {applicant.fullName}</p><p><strong>Phone:</strong> {applicant.phone}</p>
                        <p><strong>Email:</strong> {applicant.email}</p><p><strong>ID:</strong> {applicant.idType} - {applicant.idNumber}</p>
                        <p className="col-span-2"><strong>Address:</strong> {applicant.address}</p>
                    </div>
                </div>
                <div><h3 className="text-lg font-medium text-gray-900 border-b pb-2">Land Details</h3>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <p><strong>Location:</strong> {landDetails.town}, {landDetails.district}</p><p><strong>Size:</strong> {landDetails.sizeAcres} acres</p>
                        <p><strong>Coordinates:</strong> {landDetails.latitude}, {landDetails.longitude}</p><p><strong>Use:</strong> {landDetails.landUse}</p>
                    </div>
                </div>
                 <div><h3 className="text-lg font-medium text-gray-900 border-b pb-2">Documents</h3>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                        {documents.length > 0 ? documents.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        )) : (<li>No documents attached.</li>)}
                    </ul>
                </div>
            </div>
        )}


        <div className="mt-10 flex justify-between">
          <Button variant="secondary" onClick={prevStep} disabled={currentStep === 0}>
            Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default NewRegistrationForm;
