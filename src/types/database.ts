export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      store_config: {
        Row: {
          id: string
          name: string
          phone: string
          whatsapp: string | null
          address: string
          email: string | null
          booking_email: string | null
          quote_email: string | null
          google_maps_url: string | null
          opening_hours: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          whatsapp?: string | null
          address: string
          email?: string | null
          booking_email?: string | null
          quote_email?: string | null
          google_maps_url?: string | null
          opening_hours?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          whatsapp?: string | null
          address?: string
          email?: string | null
          booking_email?: string | null
          quote_email?: string | null
          google_maps_url?: string | null
          opening_hours?: Json
          created_at?: string
          updated_at?: string
        }
      }
      service: {
        Row: {
          id: string
          icon: string
          title: string
          description: string
          featured: boolean
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          icon: string
          title: string
          description: string
          featured?: boolean
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          icon?: string
          title?: string
          description?: string
          featured?: boolean
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      booking: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string
          plate: string | null
          service_type: string
          preferred_date: string
          preferred_time: string
          notes: string | null
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          source: 'web' | 'admin' | 'whatsapp' | 'phone'
          managed_at: string | null
          managed_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone: string
          plate?: string | null
          service_type: string
          preferred_date: string
          preferred_time: string
          notes?: string | null
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          source?: 'web' | 'admin' | 'whatsapp' | 'phone'
          managed_at?: string | null
          managed_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string
          plate?: string | null
          service_type?: string
          preferred_date?: string
          preferred_time?: string
          notes?: string | null
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          source?: 'web' | 'admin' | 'whatsapp' | 'phone'
          managed_at?: string | null
          managed_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quote_request: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string
          tyre_width: number | null
          tyre_aspect_ratio: number | null
          rim_diameter: number | null
          vehicle_make: string | null
          vehicle_model: string | null
          message: string | null
          status: 'pending' | 'managed' | 'cancelled'
          source: 'web' | 'admin' | 'whatsapp' | 'phone'
          managed_at: string | null
          managed_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone: string
          tyre_width?: number | null
          tyre_aspect_ratio?: number | null
          rim_diameter?: number | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          message?: string | null
          status?: 'pending' | 'managed' | 'cancelled'
          source?: 'web' | 'admin' | 'whatsapp' | 'phone'
          managed_at?: string | null
          managed_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string
          tyre_width?: number | null
          tyre_aspect_ratio?: number | null
          rim_diameter?: number | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          message?: string | null
          status?: 'pending' | 'managed' | 'cancelled'
          source?: 'web' | 'admin' | 'whatsapp' | 'phone'
          managed_at?: string | null
          managed_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      availability_block: {
        Row: {
          id: string
          date: string
          time: string | null
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          time?: string | null
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          time?: string | null
          reason?: string | null
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// ─── Tipos helper ────────────────────────────────────────
export type StoreConfig = Database['public']['Tables']['store_config']['Row']
export type Service = Database['public']['Tables']['service']['Row']
export type Booking = Database['public']['Tables']['booking']['Row']
export type BookingInsert = Database['public']['Tables']['booking']['Insert']
export type QuoteRequest = Database['public']['Tables']['quote_request']['Row']
export type QuoteRequestInsert = Database['public']['Tables']['quote_request']['Insert']
export type AvailabilityBlock = Database['public']['Tables']['availability_block']['Row']

export type BookingStatus = Booking['status']
export type BookingSource = Booking['source']
export type QuoteStatus = QuoteRequest['status']