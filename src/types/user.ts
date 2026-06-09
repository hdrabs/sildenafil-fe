export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  token: string;
}

export interface UserState {
  // User data
  user: User | null;
  isLoading: boolean;
  hasHydrated: boolean;

  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}
