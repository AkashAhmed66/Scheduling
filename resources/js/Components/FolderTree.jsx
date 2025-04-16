import React, { useState } from 'react';
import Folder from './Folder';

const FolderTree = ({ data }) => {
    return (
        <div className="wrapper">
            {data.children.map(item => <Folder item={item}/>)}
        </div>
    );
};

export default FolderTree;
