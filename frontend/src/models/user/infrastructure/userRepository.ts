// models/user/infrastructure/userRepository.ts

import apiClient from "@/lib/api";
import { AuthResponse, User, UserLogin, UserRegistration } from "../domain/user";
import { single, singleWithToken } from "../adapter/userAdapter";
import axios from "axios";

export const userRepository = {

  async register(userData: UserRegistration): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth', {
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.passwordConfirmation,
        first_name: userData.firstName,
        last_name: userData.lastName,
      });
      
      return singleWithToken(response);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  async login(credentials: UserLogin): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/sign_in', {
        email: credentials.email,
        password: credentials.password
      }
    );
      
      return singleWithToken(response);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  async logout(): Promise<void> {
    try {
      await apiClient.delete('/auth/sign_out');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get('/auth/validate_token');
      return single(response.data.data);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
};