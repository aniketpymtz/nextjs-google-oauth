import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import Image from 'next/image';

export default async function HomePage() {
  const user = await getSession();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-6 mb-8">
            {user.picture && (
              <Image
                src={user.picture}
                alt={user.name}
                className="w-20 h-20 rounded-full border-4 border-indigo-500"
                width={80}
                height={80}
                />
            )}
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Welcome back, {user.name}! 👋
              </h2>
              <p className="text-gray-600 mt-1">{user.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Profile</h3>
              <p className="text-blue-600">Your account is active and secured.</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Status</h3>
              <p className="text-green-600">Successfully authenticated via Google OAuth.</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Security</h3>
              <p className="text-purple-600">Your session is encrypted and protected.</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">User Information</h3>
            <dl className="grid md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Auth Method</dt>
                <dd className="mt-1 text-sm text-gray-900">Google OAuth 2.0</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}
