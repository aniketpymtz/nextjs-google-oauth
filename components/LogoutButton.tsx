'use client';

import { PoweroffOutlined, SyncOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUserStore } from '@/lib/store/userStore';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      // Clear user data from store
      clearUser();
      router.push('/login');
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    
     <Button
          danger
          icon={<PoweroffOutlined />}
          loading={loading && { icon: <SyncOutlined spin /> }}
          onClick={handleLogout}
        >
          Logout
        </Button>
  );
}
