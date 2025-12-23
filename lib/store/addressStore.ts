import { create } from 'zustand';

export interface Address {
  _id: string;
  label: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface AddressStore {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAddresses: () => Promise<void>;
  createAddress: (address: Omit<Address, '_id'>) => Promise<void>;
  updateAddress: (addressId: string, address: Omit<Address, '_id'>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  clearAddresses: () => void;
}

export const useAddressStore = create<AddressStore>((set) => ({
  addresses: [],
  isLoading: false,
  error: null,

  fetchAddresses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/user/address');
      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }
      const data = await response.json();
      set({ addresses: data.addresses || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch addresses',
        isLoading: false 
      });
    }
  },

  createAddress: async (address) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/user/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create address');
      }
      
      const data = await response.json();
      set({ addresses: data.addresses || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create address',
        isLoading: false 
      });
      throw error;
    }
  },

  updateAddress: async (addressId, address) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/user/address', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...address, addressId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update address');
      }
      
      const data = await response.json();
      set({ addresses: data.addresses || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update address',
        isLoading: false 
      });
      throw error;
    }
  },

  deleteAddress: async (addressId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/user/address?addressId=${addressId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete address');
      }
      
      const data = await response.json();
      set({ addresses: data.addresses || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete address',
        isLoading: false 
      });
      throw error;
    }
  },

  clearAddresses: () => set({ addresses: [], error: null }),
}));
