'use client';
import { useState } from 'react';
import Script from 'next/script';
import { Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';

interface CheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  orderId: string;
  name: string;
  prefill?: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
  handler: (response: { paymentId: string }) => void;
}

declare global {
  interface Window {
    initCheckout?: (options: CheckoutOptions) => void;
  }
}

export default function PaymentButton() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePayment = () => {
    if (isLoaded && window.initCheckout) {
      window.initCheckout({
        key: 'test_key',
        amount: 50000,
        currency: 'INR',
        orderId: 'order_' + Date.now(),
        name: 'Next.js Store',
        prefill: {
      name: 'John Doe',
      email: 'john@example.com',
      contact: '917045050604',
    },
    notes: {
      address: '123 Main Street',
      merchant_order_id: '12345',
    },
    theme: {
      color: '#1e40af',
    },
        handler: (res) => alert(res.paymentId)
      });
    }
  };

  return (
    <>
      <Script
        src="https://payment-widget-public.vercel.app/checkout-widget.umd.js"
        onLoad={() => setIsLoaded(true)}
      />
      <Button icon={<ShoppingOutlined />} type="primary" color="purple" onClick={handlePayment}>
        Buy Now
      </Button>
    </>
  );
}