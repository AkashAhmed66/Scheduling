import React, { useState } from 'react';
import SidebarContext from '@/Context/SidebarContext';
import { useContext } from 'react';

export default function Folder({ item }) {
  const [isOpened, setIsOpened] = useState(false);
  const a = useContext(SidebarContext);

  const handleOnclick = () => {
    if(item.children) setIsOpened(!isOpened)
    a.update(item)
    console.log(a.state)
  }
  return (
    <div className="menu-item">
      <button
        onClick={handleOnclick}
        className="flex items-center space-x-2 text-gray-700 font-semibold py-2 px-4 w-full text-left hover:bg-gray-200 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        {/* Folder icon if item has children, file icon if it doesn't */}
        <span className="text-gray-600">
          <i className={`fas ${item.children ? 'fa-folder' : 'fa-file'} mr-2`}></i>
        </span>
        {/* Folder Name */}
        <span className="truncate">{item.name}</span>

        {/* Folder Open/Close Indicator */}
        {item.children && (
          <span className={`transform transition-all duration-300 ${isOpened ? 'rotate-45' : 'rotate-0'}`}>
            {isOpened}
          </span>
        )}
      </button>

      {/* Sub-menu for children if it exists */}
      {item.children && (
        <div
          className={`sub-menu pl-6 mt-2 transition-all duration-300 ease-in-out ${
            isOpened ? 'max-h-screen' : 'max-h-0 overflow-hidden'
          }`}
        >
          {item.children.map((subItem, index) => (
            <Folder key={index} item={subItem} />
          ))}
        </div>
      )}
    </div>
  );
}
