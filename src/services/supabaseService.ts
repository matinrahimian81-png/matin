import { supabase } from '../lib/supabase';
import { ProductData } from '../types';

export const supabaseService = {
  // Authentication
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  },

  async signUpWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async sendOtp(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  },

  async verifyOtp(email: string, token: string, type: 'email' | 'signup' | 'recovery' | 'invite' | 'reauthentication' = 'email') {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type
    });
    if (error) throw error;
    return data;
  },

  async reauthenticate() {
    const { data, error } = await supabase.auth.reauthenticate();
    if (error) throw error;
    return data;
  },

  async resend(email: string, type: 'signup' | 'recovery' | 'invite' | 'reauthentication' | 'email_change') {
    const { data, error } = await supabase.auth.resend({
      type,
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange(callback: (event: any, session: any) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  },

  // Products
  async getProducts(): Promise<ProductData[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.warn('Error fetching from Supabase, falling back to local data:', error);
      return []; // You can return local data here if you want
    }
    return data || [];
  },

  // Wishlist Sync (example)
  async syncWishlist(userId: string, productIds: number[]) {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, wishlist: productIds });
    
    if (error) throw error;
  }
};
