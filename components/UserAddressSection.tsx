'use client';

import { useState } from 'react';
import { Modal, Form, Input, Button, Card, Tag, Select, Skeleton } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from '@/lib/hooks/useAddress';

interface Address {
  _id: string;
  label: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

const ADDRESS_LABELS = ['Work', 'Home', 'Friend', 'Other'];

export default function UserAddressSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form] = Form.useForm();

  // TanStack Query hooks
  const { data: addresses = [], isLoading: fetchingAddresses } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const loading = createAddress.isPending || updateAddress.isPending;

  const handleAdd = () => {
    setEditingAddress(null);
    form.resetFields();
    form.setFieldsValue({ country: 'India', label: 'Home' });
    setIsModalOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    form.setFieldsValue(address);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: Omit<Address, '_id'>) => {
    if (editingAddress) {
      updateAddress.mutate(
        { ...values, addressId: editingAddress._id },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            form.resetFields();
            setEditingAddress(null);
          },
        }
      );
    } else {
      createAddress.mutate(values, {
        onSuccess: () => {
          setIsModalOpen(false);
          form.resetFields();
        },
      });
    }
  };

  const handleDelete = (addressId: string) => {
    deleteAddress.mutate(addressId);
  };

  const getTagColor = (label: string) => {
    switch (label) {
      case 'Work':
        return 'blue';
      case 'Home':
        return 'green';
      case 'Friend':
        return 'purple';
      default:
        return 'default';
    }
  };

  return (
    <>
      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Addresses</h3>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Add Address
          </Button>
        </div>

        {fetchingAddresses ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-sm p-2">
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            ))}
          </div>
        ) : addresses && addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {addresses.map((address) => (
              <Card
                key={address._id}
                className="shadow-sm hover:shadow-md transition-shadow p-2"

              >
                <div className="flex justify-between items-start mb-3">
                  <Tag color={getTagColor(address.label)} className="text-sm">
                    {address.label}
                  </Tag>
                  <div className="flex gap-2">
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      size="small"
                      onClick={() => handleEdit(address)}
                    />
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={() => handleDelete(address._id)}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-900 font-medium">
                    {address.city}, {address.state}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {address.pincode}, {address.country}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No addresses added yet. Click Add Address to get started.</p>
        )}
      </div>

      <Modal
        title={editingAddress ? 'Edit Address' : 'Add Address'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingAddress(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            country: 'India',
            label: 'Home',
          }}
        >
          <Form.Item
            label="Label"
            name="label"
            rules={[{ required: true, message: 'Please select a label' }]}
          >
            <Select placeholder="Select label">
              {ADDRESS_LABELS.map((label) => (
                <Select.Option key={label} value={label}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

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
            <Button
              onClick={() => {
                setIsModalOpen(false);
                setEditingAddress(null);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} className="bg-indigo-600">
              {editingAddress ? 'Update' : 'Add'} Address
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
