import React from 'react';
import { Loader } from 'lucide-react';

const GhanaCoatOfArms: React.FC = () => (
    <svg width="100" height="100" viewBox="0 0 200 200" className="mx-auto" xmlns="http://www.w3.org/2000/svg">
        <g>
            <rect width="200" height="200" fill="#f0f0f0" visibility="hidden"/>
            <path d="M100 20 L160 50 L160 110 Q100 180, 40 110 L40 50 Z" fill="#ffffff" stroke="#000000" strokeWidth="3"/>
            <rect x="45" y="55" width="110" height="50" fill="#2d6a4f"/>
            <line x1="100" y1="55" x2="100" y2="105" stroke="#ffd700" strokeWidth="3"/>
            <line x1="45" y1="80" x2="160" y2="80" stroke="#ffd700" strokeWidth="3"/>
            <path d="M60 60 L70 75 L80 60 Z" fill="#d4a373"/> 
            <path d="M120 60 L140 75 L120 90 L130 75 Z" fill="#8c5a3b"/> 
            <path d="M55 85 h 30 v 15 h -30 z" fill="#e9c46a"/>
            <path d="M115 85 h 30 v 15 h -30 z" fill="#f4a261"/>
            <path d="M90 20 L110 20 L100 5 L90 20 Z" fill="#ce1126"/>
            <path d="M95 12 L105 12 L100 2 L95 12" fill="#000000"/>
            <text x="100" y="145" fontFamily="Arial" fontSize="18" textAnchor="middle" fill="#000000" fontWeight="bold">FREEDOM</text>
            <text x="100" y="165" fontFamily="Arial" fontSize="18" textAnchor="middle" fill="#000000" fontWeight="bold">AND JUSTICE</text>
        </g>
    </svg>
);

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col justify-center items-center z-50">
        <GhanaCoatOfArms />
        <h1 className="text-3xl font-bold text-gray-800 mt-6">Techiman North District</h1>
        <p className="text-lg text-gray-600">Land Registry Portal</p>
        <Loader className="animate-spin h-8 w-8 text-green-700 mt-8" />
    </div>
  );
};

export default SplashScreen;
