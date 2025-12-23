'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileEditor from '@/components/ProfileEditor';
import { useUserStore } from '@/lib/store/userStore';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isLoading, fetchUser, updateUser } = useUserStore();

  useEffect(() => {
    if (!user && !isLoading) {
      fetchUser().catch(() => {
        router.push('/login');
      });
    }
  }, [user, isLoading, fetchUser, router]);

  const handleSave = async (data: { name: string; bio: string; customAvatar?: string }) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      // Update local store with new data
      updateUser({
        name: data.name,
        bio: data.bio,
        customAvatar: data.customAvatar,
      });

      // Redirect back to home
      router.push('/home');
    } catch (err) {
      console.error('Save error:', err);
      throw err;
    }
  };

  const handleCancel = () => {
    router.push('/home');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Your Profile</h2>
          
          <ProfileEditor
            initialName={user.name}
            initialBio={user.bio || ''}
            initialAvatar={user.customAvatar || user.picture || ''}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </main>
    </div>
  );
}
