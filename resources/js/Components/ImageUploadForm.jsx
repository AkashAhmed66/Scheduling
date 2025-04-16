import { Inertia } from '@inertiajs/inertia';
import React, { useState } from 'react';

export default function ImageUploadForm({ initialImage }) {
    const [preview, setPreview] = useState(initialImage || null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');

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
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            alert('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        Inertia.post('/user-profile-photo', formData, {
            onSuccess: () => {
                setSelectedFile(null);
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
            <h2 className="text-lg font-semibold">Upload Profile Image</h2>
            <div className="mt-4 flex flex-col items-center space-y-4">
                {preview && (
                    <img
                        src={preview}
                        alt="Profile Preview"
                        className="h-32 w-32 rounded-full object-cover"
                    />
                )}
                <label
                    htmlFor="profileImage"
                    className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white font-semibold hover:bg-blue-600 transition"
                >
                    Choose Image
                </label>
                <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Image Requirements (New Addition) */}
                <p className="text-sm text-gray-500 text-center">
                    Recommended size: **300x300px** or larger <br />
                    Max file size: **2MB** <br />
                    Allowed formats: **JPG, PNG, GIF**
                </p>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="mt-4 rounded-md bg-green-500 px-4 py-2 text-white font-semibold hover:bg-green-600 transition"
                    disabled={!!error} // Disable upload if there's an error
                >
                    Upload Image
                </button>
            </div>
        </form>
    );
}
