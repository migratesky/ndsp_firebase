'use client';

import { useEffect } from 'react';

export default function TestRoute() {
  useEffect(() => {
    console.log('Root test route hydrated on client side');
    console.log('Form element exists:', !!document.querySelector('form'));
  }, []);

  return (
    <div className="p-4">
      <h1>Root Test Route</h1>
      <p>This tests basic routing without authentication</p>
      <button 
        onClick={() => console.log('Button clicked')}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test Button
      </button>
    </div>
  );
}
