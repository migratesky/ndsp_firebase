import Link from 'next/link';
import { useRouter } from 'next/router';

export function Sidebar() {
  const router = useRouter();
  
  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/schools', label: 'Schools' },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/content', label: 'Content' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                href={item.path}
                className={`block px-4 py-2 rounded ${router.pathname === item.path ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
