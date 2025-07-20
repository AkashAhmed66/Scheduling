import React from 'react';
import BasicLayout from '../Layouts/BasicLayout/BasicLayout';
import UploadModelCreate from '@/Components/UploadModelCreate';
import { Head } from '@inertiajs/react';

export default function UploadModelCreatePage({ auth }) {
    return (
        <BasicLayout>
            <Head title="Upload Excel File" />
            <div className="w-full">
                <UploadModelCreate />
            </div>
        </BasicLayout>
    );
}
