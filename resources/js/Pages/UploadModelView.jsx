import React from 'react';
import BasicLayout from '../Layouts/BasicLayout/BasicLayout';
import UploadModelView from '@/Components/UploadModelView';
import { Head } from '@inertiajs/react';

export default function UploadModelViewPage({ auth, uploadModel, riskRatings, overallRatings, uploadModelQuestions }) {
    return (
        <BasicLayout>
            <Head title="Upload Model Details" />
            <div className="w-full">
                <UploadModelView 
                    uploadModel={uploadModel}
                    riskRatings={riskRatings}
                    overallRatings={overallRatings}
                    uploadModelQuestions={uploadModelQuestions}
                />
            </div>
        </BasicLayout>
    );
}
