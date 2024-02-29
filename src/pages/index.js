// pages/index.js or another Next.js page
import React from 'react';
import App from '../app/app.client'; // Adjust the import path as needed

export default function HomePage() {
    // This page component can be considered a "Server Component" if it doesn't use client-specific hooks
    return (
        <div>
            <App /> {/* Using the Client Component */}
        </div>
    );
}
