import React, { useState } from 'react';
import Folder from './Folder';

const FolderTree = ({ data }) => {
    // Add a check to handle undefined data or data without children
    if (!data || !data.children || !Array.isArray(data.children)) {
        return <div className="text-gray-500 text-sm p-2">No documents available</div>;
    }
    
    return (
        <div className="wrapper">
            {data.children.map(item => <Folder key={item.id} item={item}/>)}
        </div>
    );
};

export default FolderTree;
