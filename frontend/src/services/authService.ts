import { AxiosResponse } from 'axios';
import api from '../api/axios';

export interface SignupPayload {
  userName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword?: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  username: string;
  role: string;
  token: string;
  message?: string;
}

export interface SignupResponse {
  message: string;
}

export interface VerifyEmailResponse {
  success: boolean;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// User registration
export const registerUser = (userData: SignupPayload): Promise<AxiosResponse<SignupResponse>> => {
  return api.post('/user/signup', userData);
};

// User login
export const loginUser = (credentials: LoginPayload): Promise<AxiosResponse<LoginResponse>> => {
  return api.post('/user/login', credentials);
};

// Email verification (Forgot Password flow)
export const verifyEmail = (email: string): Promise<AxiosResponse<VerifyEmailResponse>> => {
  return api.post('/user/verifyEmail', { email });
};

// Reset password
export const resetPassword = (
  email: string,
  newPassword: string
): Promise<AxiosResponse<ResetPasswordResponse>> => {
  return api.post('/user/resetPassword', { email, newPassword });
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};
