import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Applicant, LandParcel, RegistrationType } from '../types';
import { LandRegistryService } from '../services/landRegistryService';
import Stepper from './ui/Stepper';
import Button from './ui/Button';
import Label from './ui/Label';
import Input from './ui/Input';
import Card from './ui/Card';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { AuthContext } from '../context/AuthContext';

const steps = ['Application Type', 'Applicant Details', 'Project Details', 'Document Upload', 'Review & Submit'];

const NewRegistrationForm: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const [regType, setRegType] = useState<RegistrationType>(RegistrationType.Land);
  const [applicant, setApplicant] = useState<Applicant>({
    fullName: '', address: '', phone: '', email: '', idType: 'Ghana Card', idNumber: '',
  });
  const [landDetails, setLandDetails] = useState({
    region: 'Bono East', district: 'Techiman North', town: '',
    latitude: '', longitude: '', sizeAcres: 0, landUse: 'Residential' as LandParcel['landUse'],
  });
  const [permitDetails, setPermitDetails] = useState({
    proposedStructure: '', estimatedCost: 0, architectName: '', contractorName: '',
    numFloors: 0, floorArea: 0, developmentType: 'Subdivision', siteArea: 0,
  });

  const [documents, setDocuments] = useState<File[]>([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setDocuments(prev => [...prev, ...acceptedFiles]);
    },
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    }
  });

  const removeFile = (file: File) => {
    setDocuments(prev => prev.filter(f => f !== file));
  };
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
      const checksum = (digitsOnly.split('').reduce((acc, digit) => acc + parseInt(digit), 0) % 10);
      formatted += `-${checksum}`;
    }
    return formatted;
  };

  const handleLandDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLandDetails({ ...landDetails, [e.target.name]: e.target.value });
  };

  const handlePermitDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPermitDetails({ ...permitDetails, [e.target.name]: e.target.value });
  };
  
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const mockDocs = documents.map(d => ({ name: d.name, size: d.size, type: d.type, url: '#' }));
    
    const newParcelData: Omit<LandParcel, 'id' | 'submissionDate' | 'status' | 'statusHistory'> = {
        type: regType,
        applicant,
        location: {
            region: landDetails.region,
            district: landDetails.district,
            town: landDetails.town,
            gpsCoordinates: { latitude: landDetails.latitude, longitude: landDetails.longitude }
        },
        sizeAcres: regType === RegistrationType.Land ? Number(landDetails.sizeAcres) : undefined,
        landUse: regType === RegistrationType.Land ? landDetails.landUse : undefined,
        permitDetails: regType !== RegistrationType.Land ? {
            proposedStructure: permitDetails.proposedStructure,
            estimatedCost: Number(permitDetails.estimatedCost),
            architectName: permitDetails.architectName,
            contractorName: permitDetails.contractorName,
            numFloors: regType === RegistrationType.Building ? Number(permitDetails.numFloors) : undefined,
            floorArea: regType === RegistrationType.Building ? Number(permitDetails.floorArea) : undefined,
            developmentType: regType === RegistrationType.Development ? permitDetails.developmentType : undefined,
            siteArea: regType === RegistrationType.Development ? Number(permitDetails.siteArea) : undefined,
        } : undefined,
        documents: mockDocs,
        submittedBy: user?.username,
    };

    try {
        const newParcel = await LandRegistryService.addParcel(newParcelData);
        alert(`Successfully submitted ${regType}! Your Reference ID is ${newParcel.id}`);
        navigate(`/registrations/${newParcel.id}`);
    } catch(error) {
        alert("There was an error submitting your application.");
        console.error(error);
        setIsSubmitting(false);
    }
  };

  return (
    <Card title={`New ${regType} Application`}>
      <div className="p-4 md:p-6">
        <div className="mb-10">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {currentStep === 0 && (
          <div className="space-y-4">
            <Label>Select Application Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(RegistrationType).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setRegType(type)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${regType === type ? 'border-green-600 bg-green-50 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-300'}`}
                >
                  <h4 className="font-bold text-gray-800">{type}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {type === RegistrationType.Land && "Register ownership of a land parcel."}
                    {type === RegistrationType.Development && "Apply for permission to develop a site."}
                    {type === RegistrationType.Building && "Apply for a permit to construct a building."}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 1 && (
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
        
        {currentStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><Label>Region</Label><Input value={landDetails.region} disabled /></div>
              <div><Label>District</Label><Input value={landDetails.district} disabled /></div>
              <div><Label htmlFor="town">Town/Locality</Label><Input name="town" value={landDetails.town} onChange={handleLandDetailsChange} /></div>
              <div><Label htmlFor="latitude">GPS Latitude</Label><Input name="latitude" value={landDetails.latitude} onChange={handleLandDetailsChange} /></div>
              <div><Label htmlFor="longitude">GPS Longitude</Label><Input name="longitude" value={landDetails.longitude} onChange={handleLandDetailsChange} /></div>
            </div>

            {regType === RegistrationType.Land && (
              <>
                <div><Label htmlFor="sizeAcres">Size (in Acres)</Label><Input name="sizeAcres" type="number" value={landDetails.sizeAcres} onChange={handleLandDetailsChange} /></div>
                <div>
                    <Label htmlFor="landUse">Proposed Land Use</Label>
                    <select name="landUse" value={landDetails.landUse} onChange={handleLandDetailsChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                        <option>Residential</option><option>Commercial</option><option>Agricultural</option><option>Industrial</option><option>Mixed-Use</option>
                    </select>
                </div>
              </>
            )}

            {regType === RegistrationType.Building && (
              <>
                <div className="md:col-span-2"><Label htmlFor="proposedStructure">Proposed Building Description</Label><Input name="proposedStructure" value={permitDetails.proposedStructure} onChange={handlePermitDetailsChange} placeholder="e.g. 3-Storey Office Complex" /></div>
                <div><Label htmlFor="estimatedCost">Estimated Construction Cost (GHS)</Label><Input name="estimatedCost" type="number" value={permitDetails.estimatedCost} onChange={handlePermitDetailsChange} /></div>
                <div><Label htmlFor="numFloors">Number of Floors</Label><Input name="numFloors" type="number" value={permitDetails.numFloors} onChange={handlePermitDetailsChange} /></div>
                <div><Label htmlFor="floorArea">Total Floor Area (sqm)</Label><Input name="floorArea" type="number" value={permitDetails.floorArea} onChange={handlePermitDetailsChange} /></div>
                <div><Label htmlFor="architectName">Architect Name</Label><Input name="architectName" value={permitDetails.architectName} onChange={handlePermitDetailsChange} /></div>
                <div className="md:col-span-2"><Label htmlFor="contractorName">Contractor Name</Label><Input name="contractorName" value={permitDetails.contractorName} onChange={handlePermitDetailsChange} /></div>
              </>
            )}

            {regType === RegistrationType.Development && (
              <>
                <div className="md:col-span-2"><Label htmlFor="proposedStructure">Development Description</Label><Input name="proposedStructure" value={permitDetails.proposedStructure} onChange={handlePermitDetailsChange} placeholder="e.g. Site Layout for Housing Estate" /></div>
                <div><Label htmlFor="estimatedCost">Estimated Development Cost (GHS)</Label><Input name="estimatedCost" type="number" value={permitDetails.estimatedCost} onChange={handlePermitDetailsChange} /></div>
                <div>
                    <Label htmlFor="developmentType">Development Type</Label>
                    <select name="developmentType" value={permitDetails.developmentType} onChange={handlePermitDetailsChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                        <option>Subdivision</option><option>Rezoning</option><option>Infrastructure</option><option>Landscaping</option>
                    </select>
                </div>
                <div><Label htmlFor="siteArea">Total Site Area (sqm)</Label><Input name="siteArea" type="number" value={permitDetails.siteArea} onChange={handlePermitDetailsChange} /></div>
                <div className="md:col-span-2"><Label htmlFor="contractorName">Lead Consultant/Contractor</Label><Input name="contractorName" value={permitDetails.contractorName} onChange={handlePermitDetailsChange} /></div>
              </>
            )}
          </div>
        )}

        {currentStep === 3 && (
            <div>
                <div {...getRootProps()} className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${isDragActive ? 'border-green-500 bg-green-50' : ''}`}>
                    <input {...getInputProps()} />
                    <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <p className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                                <span>Upload files</span>
                            </p>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                    </div>
                </div>
                <div className="mt-4">
                    <h4 className="font-medium text-gray-700">Uploaded Files:</h4>
                    <ul className="mt-2 space-y-2">
                        {documents.length > 0 ? documents.map((file, index) => (
                            <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                <div className="flex items-center">
                                    <FileIcon className="h-5 w-5 text-gray-500 mr-2"/>
                                    <span className="text-sm text-gray-800">{file.name}</span>
                                    <span className="text-xs text-gray-500 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                </div>
                                <button onClick={() => removeFile(file)} className="text-red-500 hover:text-red-700">
                                    <X className="h-4 w-4" />
                                </button>
                            </li>
                        )) : (<li className="text-sm text-gray-500">No files uploaded.</li>)}
                    </ul>
                </div>
            </div>
        )}
        
        {currentStep === 4 && (
            <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-medium text-gray-900">Application Type</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">{regType}</span>
                </div>
                <div><h3 className="text-lg font-medium text-gray-900 border-b pb-2">Applicant Details</h3>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <p><strong>Name:</strong> {applicant.fullName}</p><p><strong>Phone:</strong> {applicant.phone}</p>
                        <p><strong>Email:</strong> {applicant.email}</p><p><strong>ID:</strong> {applicant.idType} - {applicant.idNumber}</p>
                        <p className="col-span-2"><strong>Address:</strong> {applicant.address}</p>
                    </div>
                </div>
                <div><h3 className="text-lg font-medium text-gray-900 border-b pb-2">Project Details</h3>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <p><strong>Location:</strong> {landDetails.town}, {landDetails.district}</p>
                        <p><strong>Coordinates:</strong> {landDetails.latitude}, {landDetails.longitude}</p>
                        {regType === RegistrationType.Land ? (
                          <>
                            <p><strong>Size:</strong> {landDetails.sizeAcres} acres</p>
                            <p><strong>Use:</strong> {landDetails.landUse}</p>
                          </>
                        ) : regType === RegistrationType.Building ? (
                          <>
                            <p><strong>Structure:</strong> {permitDetails.proposedStructure}</p>
                            <p><strong>Cost:</strong> GHS {permitDetails.estimatedCost}</p>
                            <p><strong>Floors:</strong> {permitDetails.numFloors}</p>
                            <p><strong>Area:</strong> {permitDetails.floorArea} sqm</p>
                            <p><strong>Architect:</strong> {permitDetails.architectName}</p>
                            <p><strong>Contractor:</strong> {permitDetails.contractorName}</p>
                          </>
                        ) : (
                          <>
                            <p><strong>Description:</strong> {permitDetails.proposedStructure}</p>
                            <p><strong>Cost:</strong> GHS {permitDetails.estimatedCost}</p>
                            <p><strong>Type:</strong> {permitDetails.developmentType}</p>
                            <p><strong>Site Area:</strong> {permitDetails.siteArea} sqm</p>
                            <p><strong>Consultant:</strong> {permitDetails.contractorName}</p>
                          </>
                        )}
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
