import React from 'react'

function Authlayout({ children }) {
    return (
        <div className='flex items-center justify-center mt-4 h-full'>
            {children}
        </div>
    )
}

export default Authlayout
