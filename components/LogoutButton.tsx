'use client';

import { PoweroffOutlined, SyncOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
   const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
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
