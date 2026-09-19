export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt?: string;
  isAnonymous?: boolean;
}

export interface AuthState {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  isDemoMode: boolean;
}
