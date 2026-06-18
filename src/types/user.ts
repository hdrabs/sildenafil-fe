export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  jti: string;
}

export interface UserState {
  user: User | null;
  isLoading: boolean;
  hasHydrated: boolean;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export interface UserMeResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  jti: string;
  gender?: string;
  mobile_phone?: string;
  home_phone?: string;
  date_of_birth?: string;
  email_verified?: boolean;
  otp_verified?: boolean;
  phone_contact_allowed?: boolean;
  drugs_names_included?: boolean;
}

export interface UpdateProfileRequest {
  user: {
    first_name: string;
    last_name: string;
    email?: string;
    date_of_birth?: string;
    gender?: string;
    mobile_phone?: string;
    home_phone?: string;
    phone_contact_allowed?: boolean;
    drugs_names_included?: boolean;
  };
}

export interface PatientInfoRequest {
  user: {
    first_name: string;
    last_name: string;
    gender: string;
    date_of_birth: string;
    mobile_phone?: string;
    home_phone?: string;
    phone_contact_allowed?: boolean;
    drugs_names_included?: boolean;
    otp_verified?: boolean;
  };
}
