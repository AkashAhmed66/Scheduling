import React from 'react';
import BasicLayout from '../Layouts/BasicLayout/BasicLayout';
import UploadModelsList from '@/Components/UploadModelsList';
import { Head } from '@inertiajs/react';

export default function UploadModelsListPage({ auth, uploadModelsByType, totalTypes }) {
    return (
        <BasicLayout>
            <Head title="Upload Models" />
            <div className="w-full">
                <UploadModelsList 
                    uploadModelsByType={uploadModelsByType}
                    totalTypes={totalTypes}
                />
            </div>
        </BasicLayout>
    );
}
