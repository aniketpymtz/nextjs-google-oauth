'use client';

import { useState } from 'react';
import { Form, Input, Button, Avatar, Upload, message } from 'antd';
import { UserOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload/interface';

interface ProfileEditorProps {
  initialName: string;
  initialBio: string;
  initialAvatar: string;
  onSave: (data: { name: string; bio: string; customAvatar?: string }) => Promise<void>;
  onCancel: () => void;
}

export default function ProfileEditor({
  initialName,
  initialBio,
  initialAvatar,
  onSave,
  onCancel,
}: ProfileEditorProps) {
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(initialAvatar);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return false;
    }
    return true;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      setAvatar(data.url);
      message.success('Avatar uploaded successfully!');
      onSuccess(data);
    } catch (error) {
      console.error('Upload error:', error);
      message.error(error instanceof Error ? error.message : 'Failed to upload image');
      onError(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (values: { name: string; bio: string }) => {
    setIsSaving(true);

    try {
      await onSave({
        name: values.name,
        bio: values.bio || '',
        customAvatar: avatar !== initialAvatar ? avatar : undefined,
      });
      message.success('Profile updated successfully!');
    } catch (error) {
      console.error('Save error:', error);
      message.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ name: initialName, bio: initialBio }}
      onFinish={handleSubmit}
      className="space-y-6"
    >
      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-4 mb-6">
        <Avatar
          size={120}
          src={avatar}
          icon={<UserOutlined />}
          className="border-4 border-indigo-200"
        />
        
        <Upload
          customRequest={handleUpload}
          beforeUpload={beforeUpload}
          showUploadList={false}
          accept="image/*"
        >
          <Button
            icon={isUploading ? <LoadingOutlined /> : <UploadOutlined />}
            loading={isUploading}
            type="primary"
          >
            {isUploading ? 'Uploading...' : 'Change Avatar'}
          </Button>
        </Upload>
        <p className="text-xs text-gray-500">JPG, PNG, WebP or GIF (Max 5MB)</p>
      </div>

      {/* Name Field */}
      <Form.Item
        label="Display Name"
        name="name"
        rules={[
          { required: true, message: 'Please enter your name!' },
          { max: 100, message: 'Name cannot exceed 100 characters!' },
        ]}
      >
        <Input placeholder="Your name" size="large" />
      </Form.Item>

      {/* Bio Field */}
      <Form.Item
        label="Bio"
        name="bio"
        rules={[{ max: 500, message: 'Bio cannot exceed 500 characters!' }]}
      >
        <Input.TextArea
          placeholder="Tell us about yourself..."
          rows={4}
          showCount
          maxLength={500}
          size="large"
        />
      </Form.Item>

      {/* Action Buttons */}
      <Form.Item className="mb-0">
        <div className="flex gap-3 justify-end">
          <Button onClick={onCancel} disabled={isSaving} size="large">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSaving}
            disabled={isUploading}
            size="large"
          >
            Save Changes
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
