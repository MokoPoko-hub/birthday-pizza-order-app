import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iiemudraxqqumycldqgr.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpZW11ZHJheHFxdW15Y2xkcWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMzMyMjQsImV4cCI6MjA1NzcwOTIyNH0.N84unYW4PMIH3yKH6wqXAOxMM4oDR_RHHute4gMRLj8';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  readonly orders = signal<any[]>([]);

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    this.fetchOrders();
    this.subscribeToOrders();
  }

  async fetchOrders() {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .order('created_at');
    if (data) this.orders.set(data);
  }

  async addOrder(order: any) {
    await this.supabase.from('orders').insert([order]);
  }

  async updateOrder(id: string, updates: Partial<any>) {
    await this.supabase.from('orders').update(updates).eq('id', id);
  }

  async removeOrder(orderId: string, activeUserName: string) {
    // Fetch the order to check the user_name
    const { data: order, error: fetchError } = await this.supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError) {
      console.error('Error fetching order:', fetchError);
      return;
    }

    // Check if the user is "Wojtek" or the order belongs to the active user
    if (activeUserName === 'Wojtek' || order.user_name === activeUserName) {
      const { error: deleteError } = await this.supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (deleteError) {
        console.error('Error deleting order:', deleteError);
      } else {
        console.log('Order deleted successfully');
        this.fetchOrders(); // Refresh the orders list
      }
    } else {
      console.log('You do not have permission to delete this order.');
    }
  }

  subscribeToOrders() {
    this.supabase
      .channel('realtime-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          this.fetchOrders(); // Refresh orders on update
        }
      )
      .subscribe();
  }
}
