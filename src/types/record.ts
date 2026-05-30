export interface UserRegistrationPayload {
  name: string;
  mobile: string;
  email: string;
  address: string;
}

export interface RegistrationResponse {
  success: boolean;
  id: string;
}

export interface UserRecord {
  id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  createdAt: string;
}
