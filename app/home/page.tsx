import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import UserAddressSection from '@/components/UserAddressSection';
import Image from 'next/image';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { Button } from 'antd';
import PaymentButton from '@/components/TestBuyButton';

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch full user data from MongoDB
  await connectDB();
  const user = await User.findOne({ googleId: session.id }).lean();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className='flex items-center gap-2'>
             <div className='hidden md:block'>
             <PaymentButton />
             </div>    
             <Button type="primary">
                <Link
                  href="/profile/edit"
                >
                  Edit Profile
                </Link>
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-6 mb-8">
            {(user.customAvatar || user.picture) && (
              <Image
                src={user.customAvatar || user.picture || ''}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover"
                width={96}
                height={96}
              />
            )}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800">
                Welcome back, {user.name}! 👋
              </h2>
              <p className="text-gray-600 mt-1">{user.email}</p>
              {user.bio && (
                <p className="text-gray-700 mt-3 italic">&ldquo;{user.bio}&rdquo;</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Profile</h3>
              <p className="text-blue-600">Your account is active and secured.</p>
              <div className='block md:hidden'>
             <PaymentButton />
             </div>    
            </div>

            <div className="bg-linear-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Status</h3>
              <p className="text-green-600">Successfully authenticated via Google OAuth.</p>
            </div>

            <div className="bg-linear-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Security</h3>
              <p className="text-purple-600">Your session is encrypted and protected.</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">User Information</h3>
            <dl className="grid md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.googleId}</dd>
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
              <div>
                <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Login</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(user.lastLogin).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          <UserAddressSection />
        </div>
      </main>
    </div>
  );
}
