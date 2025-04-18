import React, { useContext } from 'react';
import Folder from './Folder';
import SidebarContext from '@/Context/SideBarContext';

const FolderTree = ({ data }) => {
    const { folderHierarchy, refreshFolders } = useContext(SidebarContext) || { folderHierarchy: [] };
    
    // Use folders from context if available, otherwise use the props data
    const folders = folderHierarchy && folderHierarchy.length > 0 
        ? folderHierarchy 
        : (data && data.children && Array.isArray(data.children) 
            ? data.children.filter(item => item.type === 'folder')
            : []);
    
    if (folders.length === 0) {
        return (
            <div className="text-gray-500 text-sm p-2">
                No folders available
                <button 
                    onClick={refreshFolders} 
                    className="ml-2 text-indigo-600 hover:text-indigo-800 text-xs"
                    title="Refresh folders"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>
        );
    }
    
    return (
        <div className="folder-tree">
            {folders.map(item => <Folder key={item.id} item={{...item, type: 'folder'}} />)}
        </div>
    );
};

export default FolderTree;
