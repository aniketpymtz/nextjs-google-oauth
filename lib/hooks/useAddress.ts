import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

interface Address {
  _id: string;
  label: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface AddressResponse {
  addresses: Address[];
}

interface CreateAddressData {
  label: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface UpdateAddressData extends CreateAddressData {
  addressId: string;
}

// Fetch all addresses
export function useAddresses() {
  return useQuery<Address[]>({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await fetch('/api/user/address');
      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }
      const data: AddressResponse = await response.json();
      return data.addresses || [];
    },
  });
}

// Create a new address
export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation<Address[], Error, CreateAddressData>({
    mutationFn: async (addressData) => {
      const response = await fetch('/api/user/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error('Failed to create address');
      }

      const data: AddressResponse = await response.json();
      return data.addresses;
    },
    onSuccess: (addresses) => {
      queryClient.setQueryData(['addresses'], addresses);
      message.success('Address added successfully!');
    },
    onError: () => {
      message.error('Failed to add address');
    },
  });
}

// Update an existing address
export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation<Address[], Error, UpdateAddressData>({
    mutationFn: async (addressData) => {
      const response = await fetch('/api/user/address', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error('Failed to update address');
      }

      const data: AddressResponse = await response.json();
      return data.addresses;
    },
    onSuccess: (addresses) => {
      queryClient.setQueryData(['addresses'], addresses);
      message.success('Address updated successfully!');
    },
    onError: () => {
      message.error('Failed to update address');
    },
  });
}

// Delete an address
export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation<Address[], Error, string>({
    mutationFn: async (addressId) => {
      const response = await fetch(`/api/user/address?addressId=${addressId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      const data: AddressResponse = await response.json();
      return data.addresses;
    },
    onSuccess: (addresses) => {
      queryClient.setQueryData(['addresses'], addresses);
      message.success('Address deleted successfully!');
    },
    onError: () => {
      message.error('Failed to delete address');
    },
  });
}
