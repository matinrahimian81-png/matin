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

  async verifyOtp(email: string, token: string, type: any = 'email') {
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

  async resend(email: string, type: any) {
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
      .select('*')
      .order('id', { ascending: false });
    
    if (error) {
      console.error('Supabase fetch error:', error);
      throw error;
    }
    return data || [];
  },

  async addProduct(product: Omit<ProductData, 'id'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProduct(id: number, product: Partial<ProductData>) {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProduct(id: number) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async uploadProductImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Wishlist Sync (example)
  async syncWishlist(userId: string, productIds: number[]) {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, wishlist: productIds });
    
    if (error) throw error;
  }
};
