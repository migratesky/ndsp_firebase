import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

type School = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
};

export default function SchoolsListPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchools() {
      try {
        const response = await fetch('/api/schools');
        if (response.ok) {
          const data = await response.json();
          setSchools(data);
        } else {
          console.error('Failed to fetch schools');
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSchools();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schools</h1>
        <Link href="/admin/schools/add">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Add School
          </button>
        </Link>
      </div>

      {loading ? (
        <p>Loading schools...</p>
      ) : schools.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No schools found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Address</th>
                <th className="py-2 px-4 border-b text-left">City</th>
                <th className="py-2 px-4 border-b text-left">State</th>
                <th className="py-2 px-4 border-b text-left">Phone</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school) => (
                <tr key={school.id}>
                  <td className="py-2 px-4 border-b">{school.name}</td>
                  <td className="py-2 px-4 border-b">{school.address}</td>
                  <td className="py-2 px-4 border-b">{school.city}</td>
                  <td className="py-2 px-4 border-b">{school.state}</td>
                  <td className="py-2 px-4 border-b">{school.phone}</td>
                  <td className="py-2 px-4 border-b">{school.email}</td>
                  <td className="py-2 px-4 border-b">
                    <button key={`edit-${school.id}`} className="text-blue-600 hover:text-blue-800 mr-2">
                      Edit
                    </button>
                    <button key={`delete-${school.id}`} className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
