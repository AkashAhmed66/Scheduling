import React from 'react'

export default function Body({ children }) {
    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-4 min-h-screen">
            {children}
        </div>
    );
}
