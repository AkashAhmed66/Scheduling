import React, { useState, useEffect } from 'react';
import SidebarContext from '../Context/SidebarContext.jsx';
import { useContext } from 'react';

export default function Folder({ item, level = 0 }) {
  const [isOpened, setIsOpened] = useState(false);
  const sidebarContext = useContext(SidebarContext);
  const update = sidebarContext ? sidebarContext.update : () => {};
  const selectedFolder = sidebarContext ? sidebarContext.state : null;

  // Skip rendering if the item is not a folder
  if (item.type === 'document') {
    return null;
  }

  // Check if this folder is currently selected
  const isSelected = selectedFolder && selectedFolder.id === item.id;

  // Auto-expand if this item is in the path of the selected folder
  useEffect(() => {
    if (selectedFolder && item.children) {
      // Check if this folder contains the selected folder
      const containsSelected = (children, targetId) => {
        if (!children) return false;
        
        for (const child of children) {
          if (child.id === targetId) return true;
          if (child.children && containsSelected(child.children, targetId)) return true;
        }
        return false;
      };
      
      if (containsSelected(item.children, selectedFolder.id)) {
        setIsOpened(true);
      }
    }
  }, [selectedFolder, item.children]);

  const handleOnclick = () => {
    if (item.children) {
      setIsOpened(!isOpened);
    }
    update(item);
  };

  return (
    <div className="menu-item">
      <button
        onClick={handleOnclick}
        className={`flex items-center space-x-2 text-gray-700 font-semibold py-2 px-4 w-full text-left 
                  ${isSelected ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'} 
                  rounded-md transition duration-300 ease-in-out`}
      >
        {/* Folder icon with open/closed state */}
        <span className={`text-${isSelected ? 'indigo' : 'gray'}-600`}>
          {item.type === 'folder' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d={isOpened 
                  ? "M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 19c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" 
                  : "M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 19c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"} 
              />
            </svg>
          )}
        </span>
        {/* Folder Name */}
        <span className="truncate">{item.name}</span>

        {/* Folder Open/Close Indicator */}
        {item.children && item.children.length > 0 && (
          <span className="ml-auto">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 transition-transform ${isOpened ? 'transform rotate-90' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </button>

      {/* Sub-menu for children if it exists */}
      {item.children && item.children.length > 0 && (
        <div
          className={`sub-menu pl-6 mt-1 transition-all duration-300 ease-in-out ${
            isOpened ? 'max-h-screen' : 'max-h-0 overflow-hidden'
          }`}
        >
          {item.children
            .filter(subItem => subItem.type === 'folder')
            .map((subItem, index) => (
              <Folder 
                key={subItem.id || index} 
                item={{...subItem, type: 'folder'}} 
                level={level + 1} 
              />
            ))}
        </div>
      )}
    </div>
  );
}
