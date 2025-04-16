import React from 'react'

export default function Body({ children }) { 
    return (
        <div className="bg-white shadow-sm rounded-lg p-6">
          {children}
        </div>
    );
}
