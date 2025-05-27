'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      console.log('Not authenticated, redirecting');
      router.push('/login');
      return;
    }
    
    console.log('Test page hydrated on client side');
    console.log('Session status:', status);
  }, [status, router]);

  if (status !== 'authenticated') {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1>Client-side Test</h1>
      <p>If you see this, client-side rendering is working</p>
      <button 
        onClick={() => console.log('Button clicked')}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test Button
      </button>
    </div>
  );
}
