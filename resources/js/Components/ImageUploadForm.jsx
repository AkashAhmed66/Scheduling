import { Inertia } from '@inertiajs/inertia';
import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function ImageUploadForm({ initialImage }) {
    const { image_url } = usePage().props;
    const [preview, setPreview] = useState(initialImage || image_url || null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            // Validate file size (2MB max)
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                setError('File size should be less than 2MB.');
                return;
            }

            // Validate file type (only images)
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setError('Only JPG, PNG, or GIF images are allowed.');
                return;
            }

            setError(''); // Clear any previous errors
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            setSelectedFile(file);
            setUploadSuccess(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            alert('Please select an image to upload.');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', selectedFile);

        Inertia.post('/user-profile-photo', formData, {
            onSuccess: () => {
                setSelectedFile(null);
                setIsUploading(false);
                setUploadSuccess(true);
                
                // Reset success message after 3 seconds
                setTimeout(() => {
                    setUploadSuccess(false);
                }, 3000);
            },
            onError: () => {
                setIsUploading(false);
                setError('Failed to upload image. Please try again.');
            }
        });
    };

    return (
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 p-4 sm:p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Profile Photo
                </h2>
                <p className="mt-1 text-indigo-100">Personalize your account with a profile photo</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-full md:w-1/3 flex justify-center">
                        <div className="relative group">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Profile Preview"
                                    className="h-36 w-36 rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="h-36 w-36 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                            
                            <label
                                htmlFor="profileImage"
                                className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer shadow-md transition-all duration-200 transform hover:scale-110"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </label>
                            <input
                                id="profileImage"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    
                    <div className="w-full md:w-2/3">
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Image Requirements</h3>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    <li className="flex items-center">
                                        <svg className="h-3 w-3 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Recommended size: 300×300 pixels or larger
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-3 w-3 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Maximum file size: 2MB
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-3 w-3 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Allowed formats: JPG, PNG, GIF
                                    </li>
                                </ul>
                            </div>
                            
                            {error && (
                                <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm flex items-start">
                                    <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}
                            
                            {uploadSuccess && (
                                <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm flex items-start">
                                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Profile photo successfully updated!</span>
                                </div>
                            )}
                            
                            <button
                                type="submit"
                                disabled={!selectedFile || isUploading || !!error}
                                className={`w-full rounded-lg px-4 py-2.5 font-medium text-white shadow-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                    !selectedFile || isUploading || !!error 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                            >
                                {isUploading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading...
                                    </span>
                                ) : selectedFile ? "Save Profile Photo" : "Select an Image to Upload"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
