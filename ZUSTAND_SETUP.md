# Zustand State Management Setup

## Overview
Your app now uses **Zustand** for all global state management. TanStack Query has been completely removed in favor of a unified Zustand-based approach.

## Stores

### 1. **User Store** (`lib/store/userStore.ts`)
- Centralized state management for user data
- Methods:
  - `fetchUser()` - Fetches user data from `/api/profile`
  - `setUser(user)` - Manually set user data
  - `updateUser(partial)` - Update specific user fields
  - `clearUser()` - Clear user data on logout

### 2. **Address Store** (`lib/store/addressStore.ts`)
- Manages all user addresses
- Methods:
  - `fetchAddresses()` - Fetches all addresses
  - `createAddress(address)` - Creates a new address
  - `updateAddress(id, address)` - Updates an address
  - `deleteAddress(id)` - Deletes an address
  - `clearAddresses()` - Clear all addresses

## Key Updates

### User Management
- **Login Flow** - Fetches user data after OAuth success
- **Home Page** - Changed to client component, uses store
- **Profile Edit** - Uses store for data and updates
- **Logout** - Clears all stores on logout

### Address Management  
- **UserAddressSection** - Migrated from React Query to Zustand store
- **API** - CRUD operations via `/api/user/address`

### Removed Dependencies
- ❌ TanStack Query (`@tanstack/react-query`)
- ❌ TanStack Query DevTools
- ❌ QueryProvider component
- ❌ Hook files (`useAddress.ts`, `useApi.ts`)

## Benefits

✅ **Unified State** - Single state management solution
✅ **Better Performance** - Data fetched once, cached in memory
✅ **Faster Navigation** - No server calls between pages
✅ **Simpler Code** - No prop drilling, consistent API
✅ **Smaller Bundle** - Removed 2 large dependencies

## Usage Examples

### User Store
```tsx
import { useUserStore } from '@/lib/store/userStore';

function MyComponent() {
  const { user, isLoading, fetchUser, updateUser } = useUserStore();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;
  
  return (
    <div>
      <h1>Welcome {user.name}!</h1>
      <button onClick={() => updateUser({ name: 'New Name' })}>
        Update Name
      </button>
    </div>
  );
}
```

### Address Store
```tsx
import { useAddressStore } from '@/lib/store/addressStore';

function AddressComponent() {
  const { addresses, isLoading, fetchAddresses, createAddress } = useAddressStore();
  
  useEffect(() => {
    fetchAddresses();
  }, []);
  
  const handleAdd = async () => {
    await createAddress({
      label: 'Home',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    });
  };
  
  return (
    <div>
      {addresses.map(addr => <div key={addr._id}>{addr.city}</div>)}
    </div>
  );
}
```

## Migration Notes

- All pages that need user data should now be **client components** (`'use client'`)
- Use `useUserStore()` hook instead of passing user props
- Call `fetchUser()` in `useEffect` if user data is not loaded
- On logout, call `clearUser()` to reset state
