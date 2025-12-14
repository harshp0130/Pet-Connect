export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_activity_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          target_id: string | null
          target_type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_sessions: {
        Row: {
          admin_id: string
          created_at: string
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean
          session_token: string
          user_agent: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          session_token: string
          user_agent?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          session_token?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      admins: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          id: string
          is_super_admin: boolean
          name: string
          password_hash: string
          permissions: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          is_super_admin?: boolean
          name: string
          password_hash: string
          permissions?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          is_super_admin?: boolean
          name?: string
          password_hash?: string
          permissions?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admins_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      banner_products: {
        Row: {
          banner_id: string | null
          created_at: string
          id: string
          product_id: string | null
        }
        Insert: {
          banner_id?: string | null
          created_at?: string
          id?: string
          product_id?: string | null
        }
        Update: {
          banner_id?: string | null
          created_at?: string
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "banner_products_banner_id_fkey"
            columns: ["banner_id"]
            isOneToOne: false
            referencedRelation: "banners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "banner_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      banners: {
        Row: {
          banner_type: string | null
          created_at: string
          created_by: string | null
          description: string | null
          discount_percentage: number | null
          display_order: number | null
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          start_date: string | null
          target_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          banner_type?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_percentage?: number | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          start_date?: string | null
          target_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          banner_type?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_percentage?: number | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          start_date?: string | null
          target_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "banners_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_featured: boolean | null
          status: Database["public"]["Enums"]["blog_status"] | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          status?: Database["public"]["Enums"]["blog_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          status?: Database["public"]["Enums"]["blog_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          callee_id: string
          caller_id: string
          created_at: string | null
          id: string
          room_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          callee_id: string
          caller_id: string
          created_at?: string | null
          id?: string
          room_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          callee_id?: string
          caller_id?: string
          created_at?: string | null
          id?: string
          room_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chat_room_id: string
          created_at: string
          file_url: string | null
          id: string
          message: string
          message_type: string | null
          read_at: string | null
          sender_id: string
        }
        Insert: {
          chat_room_id: string
          created_at?: string
          file_url?: string | null
          id?: string
          message: string
          message_type?: string | null
          read_at?: string | null
          sender_id: string
        }
        Update: {
          chat_room_id?: string
          created_at?: string
          file_url?: string | null
          id?: string
          message?: string
          message_type?: string | null
          read_at?: string | null
          sender_id?: string
        }
        Relationships: []
      }
      chat_participants: {
        Row: {
          chat_room_id: string
          id: string
          joined_at: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          chat_room_id: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          chat_room_id?: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_rooms: {
        Row: {
          created_at: string
          id: string
          pet_care_request_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          pet_care_request_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          pet_care_request_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_email: string
          applicant_name: string
          cover_letter: string | null
          created_at: string
          id: string
          job_id: string
          resume_url: string
          status: string | null
        }
        Insert: {
          applicant_email: string
          applicant_name: string
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_id: string
          resume_url: string
          status?: string | null
        }
        Update: {
          applicant_email?: string
          applicant_name?: string
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_id?: string
          resume_url?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          created_at: string
          created_by: string
          description: string
          experience_required: string | null
          id: string
          is_active: boolean | null
          job_type: string | null
          location: string
          salary_range: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          experience_required?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location: string
          salary_range?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          experience_required?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location?: string
          salary_range?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          contact_info: Json
          created_at: string
          estimated_delivery: string | null
          id: string
          payment_id: string | null
          reschedule_count: number | null
          shipping_address: Json
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          tracking_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          contact_info: Json
          created_at?: string
          estimated_delivery?: string | null
          id?: string
          payment_id?: string | null
          reschedule_count?: number | null
          shipping_address: Json
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          contact_info?: Json
          created_at?: string
          estimated_delivery?: string | null
          id?: string
          payment_id?: string | null
          reschedule_count?: number | null
          shipping_address?: Json
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_care_requests: {
        Row: {
          created_at: string
          end_date: string
          id: string
          owner_id: string
          pet_id: string
          shelter_id: string | null
          sitter_id: string | null
          special_instructions: string | null
          start_date: string
          status: Database["public"]["Enums"]["request_status"] | null
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          owner_id: string
          pet_id: string
          shelter_id?: string | null
          sitter_id?: string | null
          special_instructions?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["request_status"] | null
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          owner_id?: string
          pet_id?: string
          shelter_id?: string | null
          sitter_id?: string | null
          special_instructions?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["request_status"] | null
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_care_requests_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_care_requests_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_care_requests_shelter_id_fkey"
            columns: ["shelter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_care_requests_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_health_records: {
        Row: {
          created_at: string
          date: string
          description: string
          id: string
          next_due_date: string | null
          notes: string | null
          pet_id: string
          record_type: string
          title: string
          updated_at: string
          veterinarian: string
        }
        Insert: {
          created_at?: string
          date: string
          description: string
          id?: string
          next_due_date?: string | null
          notes?: string | null
          pet_id: string
          record_type: string
          title: string
          updated_at?: string
          veterinarian: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          id?: string
          next_due_date?: string | null
          notes?: string | null
          pet_id?: string
          record_type?: string
          title?: string
          updated_at?: string
          veterinarian?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_health_records_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_shelter_profiles: {
        Row: {
          about_shelter: string | null
          capacity: number | null
          created_at: string
          id: string
          introduction_video_url: string | null
          is_available: boolean | null
          license_number: string | null
          profile_image_url: string | null
          rating: number | null
          rejection_reason: string | null
          review_count: number | null
          shelter_name: string
          updated_at: string
          user_id: string
          verification_notes: string | null
          verification_requested_at: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          about_shelter?: string | null
          capacity?: number | null
          created_at?: string
          id?: string
          introduction_video_url?: string | null
          is_available?: boolean | null
          license_number?: string | null
          profile_image_url?: string | null
          rating?: number | null
          rejection_reason?: string | null
          review_count?: number | null
          shelter_name: string
          updated_at?: string
          user_id: string
          verification_notes?: string | null
          verification_requested_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          about_shelter?: string | null
          capacity?: number | null
          created_at?: string
          id?: string
          introduction_video_url?: string | null
          is_available?: boolean | null
          license_number?: string | null
          profile_image_url?: string | null
          rating?: number | null
          rejection_reason?: string | null
          review_count?: number | null
          shelter_name?: string
          updated_at?: string
          user_id?: string
          verification_notes?: string | null
          verification_requested_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_shelter_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_shelter_profiles_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_sitter_profiles: {
        Row: {
          about_me: string | null
          availability_schedule: Json | null
          created_at: string
          experience_years: number | null
          hourly_rate: number | null
          id: string
          introduction_video_url: string | null
          is_available: boolean | null
          pet_preferences: string[] | null
          profile_image_url: string | null
          rating: number | null
          rejection_reason: string | null
          review_count: number | null
          service_radius: number | null
          travel_to_client: boolean | null
          updated_at: string
          user_id: string
          verification_notes: string | null
          verification_requested_at: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          about_me?: string | null
          availability_schedule?: Json | null
          created_at?: string
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          introduction_video_url?: string | null
          is_available?: boolean | null
          pet_preferences?: string[] | null
          profile_image_url?: string | null
          rating?: number | null
          rejection_reason?: string | null
          review_count?: number | null
          service_radius?: number | null
          travel_to_client?: boolean | null
          updated_at?: string
          user_id: string
          verification_notes?: string | null
          verification_requested_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          about_me?: string | null
          availability_schedule?: Json | null
          created_at?: string
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          introduction_video_url?: string | null
          is_available?: boolean | null
          pet_preferences?: string[] | null
          profile_image_url?: string | null
          rating?: number | null
          rejection_reason?: string | null
          review_count?: number | null
          service_radius?: number | null
          travel_to_client?: boolean | null
          updated_at?: string
          user_id?: string
          verification_notes?: string | null
          verification_requested_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_sitter_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_sitter_profiles_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          age: number | null
          breed: string | null
          created_at: string
          description: string | null
          id: string
          medical_conditions: string | null
          name: string
          pet_images: string[]
          size: string
          special_needs: string | null
          type: string
          updated_at: string
          user_id: string
          vaccination_documents: string[] | null
          vaccination_status: boolean
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Insert: {
          age?: number | null
          breed?: string | null
          created_at?: string
          description?: string | null
          id?: string
          medical_conditions?: string | null
          name: string
          pet_images?: string[]
          size: string
          special_needs?: string | null
          type: string
          updated_at?: string
          user_id: string
          vaccination_documents?: string[] | null
          vaccination_status?: boolean
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Update: {
          age?: number | null
          breed?: string | null
          created_at?: string
          description?: string | null
          id?: string
          medical_conditions?: string | null
          name?: string
          pet_images?: string[]
          size?: string
          special_needs?: string | null
          type?: string
          updated_at?: string
          user_id?: string
          vaccination_documents?: string[] | null
          vaccination_status?: boolean
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string
          discount_amount: number | null
          discount_percentage: number | null
          discount_type: string | null
          id: string
          images: string[]
          is_active: boolean | null
          mrp: number | null
          name: string
          price: number
          rating: number | null
          review_count: number | null
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description: string
          discount_amount?: number | null
          discount_percentage?: number | null
          discount_type?: string | null
          id?: string
          images?: string[]
          is_active?: boolean | null
          mrp?: number | null
          name: string
          price: number
          rating?: number | null
          review_count?: number | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string
          discount_amount?: number | null
          discount_percentage?: number | null
          discount_type?: string | null
          id?: string
          images?: string[]
          is_active?: boolean | null
          mrp?: number | null
          name?: string
          price?: number
          rating?: number | null
          review_count?: number | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          latitude: number | null
          location_updated_at: string | null
          longitude: number | null
          phone: string | null
          pincode: string | null
          search_preferences: Json | null
          state: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          latitude?: number | null
          location_updated_at?: string | null
          longitude?: number | null
          phone?: string | null
          pincode?: string | null
          search_preferences?: Json | null
          state?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          latitude?: number | null
          location_updated_at?: string | null
          longitude?: number | null
          phone?: string | null
          pincode?: string | null
          search_preferences?: Json | null
          state?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          images: string[] | null
          pet_care_request_id: string | null
          product_id: string | null
          rating: number
          reviewee_id: string | null
          reviewer_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          images?: string[] | null
          pet_care_request_id?: string | null
          product_id?: string | null
          rating: number
          reviewee_id?: string | null
          reviewer_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          images?: string[] | null
          pet_care_request_id?: string | null
          product_id?: string | null
          rating?: number
          reviewee_id?: string | null
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_pet_care_request_id_fkey"
            columns: ["pet_care_request_id"]
            isOneToOne: false
            referencedRelation: "pet_care_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_login_logs: {
        Row: {
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          login_time: string
          logout_time: string | null
          session_duration: unknown | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          login_time?: string
          logout_time?: string | null
          session_duration?: unknown | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          login_time?: string
          logout_time?: string | null
          session_duration?: unknown | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_login_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      video_updates: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          pet_care_request_id: string
          sender_id: string
          video_url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          pet_care_request_id: string
          sender_id: string
          video_url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          pet_care_request_id?: string
          sender_id?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_updates_pet_care_request_id_fkey"
            columns: ["pet_care_request_id"]
            isOneToOne: false
            referencedRelation: "pet_care_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_updates_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_pet_shelter: {
        Args: { p_admin_id: string; p_notes?: string; p_shelter_id: string }
        Returns: boolean
      }
      approve_pet_sitter: {
        Args: { p_admin_id: string; p_notes?: string; p_sitter_id: string }
        Returns: boolean
      }
      auto_cleanup_admin_sessions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      calculate_discounted_price: {
        Args: {
          p_discount_amount: number
          p_discount_percentage: number
          p_discount_type: string
          p_mrp: number
        }
        Returns: number
      }
      calculate_distance: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      cleanup_expired_admin_sessions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_admin: {
        Args: {
          p_created_by: string
          p_email: string
          p_name: string
          p_password: string
          p_permissions: Json
        }
        Returns: string
      }
      create_admin_session: {
        Args: {
          p_admin_id: string
          p_ip_address?: unknown
          p_user_agent?: string
        }
        Returns: {
          admin_data: Json
          expires_at: string
          session_token: string
        }[]
      }
      create_banner_as_admin: {
        Args: {
          p_admin_id: string
          p_banner_type?: string
          p_description?: string
          p_discount_percentage?: number
          p_display_order?: number
          p_end_date?: string
          p_image_url?: string
          p_is_active?: boolean
          p_start_date?: string
          p_target_url?: string
          p_title: string
        }
        Returns: string
      }
      create_chat_room_for_request: {
        Args: { request_id: string }
        Returns: string
      }
      create_notification: {
        Args: {
          p_data?: Json
          p_message: string
          p_title: string
          p_type: string
          p_user_id: string
        }
        Returns: string
      }
      delete_banner_as_admin: {
        Args: { p_admin_id: string; p_banner_id: string }
        Returns: boolean
      }
      end_user_session: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      generate_room_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_banners_for_admin: {
        Args: { admin_id: string }
        Returns: {
          banner_type: string
          created_at: string
          created_by: string
          description: string
          discount_percentage: number
          display_order: number
          end_date: string
          id: string
          image_url: string
          is_active: boolean
          start_date: string
          target_url: string
          title: string
          updated_at: string
        }[]
      }
      hash_password: {
        Args: { password: string }
        Returns: string
      }
      invalidate_admin_session: {
        Args: { p_session_token: string }
        Returns: boolean
      }
      is_admin_user: {
        Args: { user_id: string }
        Returns: boolean
      }
      log_admin_activity: {
        Args: {
          p_action: string
          p_admin_id: string
          p_details?: Json
          p_ip_address?: unknown
          p_target_id?: string
          p_target_type?: string
          p_user_agent?: string
        }
        Returns: string
      }
      reject_pet_shelter: {
        Args: { p_admin_id: string; p_reason: string; p_shelter_id: string }
        Returns: boolean
      }
      reject_pet_sitter: {
        Args: { p_admin_id: string; p_reason: string; p_sitter_id: string }
        Returns: boolean
      }
      start_user_session: {
        Args: {
          p_ip_address?: unknown
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
      update_banner_as_admin: {
        Args: {
          p_admin_id: string
          p_banner_id: string
          p_banner_type?: string
          p_description?: string
          p_discount_percentage?: number
          p_display_order?: number
          p_end_date?: string
          p_image_url?: string
          p_is_active?: boolean
          p_start_date?: string
          p_target_url?: string
          p_title: string
        }
        Returns: boolean
      }
      update_banner_status_as_admin: {
        Args: { p_admin_id: string; p_banner_id: string; p_is_active: boolean }
        Returns: boolean
      }
      validate_admin_session: {
        Args: { p_session_token: string }
        Returns: {
          admin_data: Json
          session_valid: boolean
        }[]
      }
      verify_admin_password: {
        Args: { email_input: string; password_input: string }
        Returns: {
          admin_email: string
          admin_id: string
          admin_name: string
          is_super_admin: boolean
          permissions: Json
        }[]
      }
      verify_admin_password_with_session: {
        Args: {
          email_input: string
          ip_address_input?: unknown
          password_input: string
          user_agent_input?: string
        }
        Returns: {
          admin_data: Json
          error_message: string
          expires_at: string
          session_token: string
          success: boolean
        }[]
      }
    }
    Enums: {
      blog_status: "pending" | "approved" | "rejected"
      order_status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled"
      request_status: "pending" | "accepted" | "rejected" | "completed"
      user_type: "pet_owner" | "pet_sitter" | "pet_shelter"
      verification_status: "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      blog_status: ["pending", "approved", "rejected"],
      order_status: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      request_status: ["pending", "accepted", "rejected", "completed"],
      user_type: ["pet_owner", "pet_sitter", "pet_shelter"],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
