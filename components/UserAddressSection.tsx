'use client';

import { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';

interface Address {
  _id: string;
  googleId: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export default function UserAddressSection() {
  const [address, setAddress] = useState<Address | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAddress();
  },[]);

  const fetchAddress = async () => {
    try {
      const response = await fetch('/api/user/address');
      const data = await response.json();
      setAddress(data.address);
      if (data.address) {
        form.setFieldsValue(data.address);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleEdit = () => {
    if (address) {
      form.setFieldsValue(address);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: Address) => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        setAddress(data.address);
        message.success('Address updated successfully!');
        setIsModalOpen(false);
        form.resetFields();
      } else {
        message.error('Failed to update address');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      message.error('Failed to update address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Address Information</h3>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEdit}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {address ? 'Edit Address' : 'Add Address'}
          </Button>
        </div>

        {address ? (
          <div className="space-y-2">
            
            <p className="text-gray-900">
              {address.city}, {address.state} - {address.pincode}
            </p>
            <p className="text-gray-900">{address.country}</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">No address added yet. Click Add Address to get started.</p>
        )}
      </div>

      <Modal
        title={address ? 'Edit Address' : 'Add Address'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            country: 'India',
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: 'Please enter city' }]}
            >
              <Input placeholder="City" />
            </Form.Item>

            <Form.Item
              label="State"
              name="state"
              rules={[{ required: true, message: 'Please enter state' }]}
            >
              <Input placeholder="State" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Pincode"
              name="pincode"
              rules={[{ required: true, message: 'Please enter pincode' }]}
            >
              <Input placeholder="Pincode" />
            </Form.Item>

            <Form.Item
              label="Country"
              name="country"
              rules={[{ required: true, message: 'Please enter country' }]}
            >
              <Input placeholder="Country" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading} className="bg-indigo-600">
              Save Address
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
