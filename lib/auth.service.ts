/* eslint-disable @typescript-eslint/no-explicit-any */
import { account } from '@/lib/appwrite.config';
import { ID } from 'appwrite';

export interface SignUpData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  async signUp({ username, email, password }: SignUpData) {
    try {
      const user = await account.create(
        ID.unique(),
        email,
        password,
        username
      );
      
      await this.login({ email, password });
      
      return { user, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { 
        user: null, 
        error: error.message || 'Failed to create account' 
      };
    }
  }

  async login({ email, password }: LoginData) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      return { session, error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        session: null, 
        error: error.message || 'Invalid email or password' 
      };
    }
  }

  async logout() {
    try {
      await account.deleteSession('current');
      return { error: null };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { error: error.message || 'Failed to logout' };
    }
  }

  async getCurrentUser() {
    try {
      const user = await account.get();
      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  async isAuthenticated() {
    try {
      await account.get();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();