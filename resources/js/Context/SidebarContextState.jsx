import { useState, useEffect } from "react";
import SidebarContext from "./SideBarContext";
import axios from "axios";

export default function SidebarContextState (props) {
    const [state, setState] = useState(null);
    const [folderHierarchy, setFolderHierarchy] = useState([]);
    
    // Load the folder hierarchy initially
    useEffect(() => {
        loadAllFolders();
    }, []);
    
    const loadAllFolders = async () => {
        try {
            const response = await axios.get('/api/audit-docs/folders');
            if (response.data && response.data.children) {
                setFolderHierarchy(response.data.children);
            }
        } catch (error) {
            console.error("Error loading folders:", error);
        }
    };
    
    const update = (folder) => {
        // Only update state if it's a folder item
        if (folder && folder.type === 'folder') {
            setState(folder);
            
            // If we need to refresh the folder hierarchy, we can do that here
            // This ensures the sidebar always has the latest data
            if (folder.refreshHierarchy) {
                loadAllFolders();
            }
        }
    };
    
    // Set selected folder from external source (main content area)
    const setSelectedFolder = (folderId) => {
        if (folderId) {
            // Search for the folder in our hierarchy
            const findFolder = (folders, id) => {
                for (let folder of folders) {
                    if (folder.id === id) {
                        return folder;
                    }
                    if (folder.children && folder.children.length > 0) {
                        const found = findFolder(folder.children, id);
                        if (found) return found;
                    }
                }
                return null;
            };
            
            const folder = findFolder(folderHierarchy, folderId);
            if (folder) {
                setState({ ...folder, type: 'folder' });
            } else {
                // If not found in our hierarchy, we might need to fetch it
                loadFolder(folderId);
            }
        }
    };
    
    // Load a specific folder by ID
    const loadFolder = async (folderId) => {
        try {
            const response = await axios.get(`/api/audit-docs/folders/${folderId}`);
            if (response.data && response.data.folder) {
                setState({ ...response.data.folder, type: 'folder' });
            }
        } catch (error) {
            console.error("Error loading folder:", error);
        }
    };
    
    return (
        <SidebarContext.Provider value={{
            state,
            update,
            folderHierarchy,
            setSelectedFolder,
            refreshFolders: loadAllFolders
        }}>
            {props.children}
        </SidebarContext.Provider>
    );
}