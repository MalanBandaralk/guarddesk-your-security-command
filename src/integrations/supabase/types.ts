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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      attendance_corrections: {
        Row: {
          attendance_id: string
          corrected_by: string
          created_at: string
          field: string
          id: string
          new_value: string | null
          organization_id: string
          original_value: string | null
          reason: string
        }
        Insert: {
          attendance_id: string
          corrected_by: string
          created_at?: string
          field: string
          id?: string
          new_value?: string | null
          organization_id: string
          original_value?: string | null
          reason: string
        }
        Update: {
          attendance_id?: string
          corrected_by?: string
          created_at?: string
          field?: string
          id?: string
          new_value?: string | null
          organization_id?: string
          original_value?: string | null
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_corrections_attendance_id_fkey"
            columns: ["attendance_id"]
            isOneToOne: false
            referencedRelation: "attendance_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_corrections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          approval_status: string
          approved_at: string | null
          approved_by: string | null
          clock_in_at: string | null
          clock_in_lat: number | null
          clock_in_lng: number | null
          clock_in_within_geofence: boolean | null
          clock_out_at: string | null
          clock_out_lat: number | null
          clock_out_lng: number | null
          clock_out_within_geofence: boolean | null
          created_at: string
          flags: string[]
          guard_id: string
          id: string
          organization_id: string
          post_id: string | null
          shift_id: string | null
          site_id: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          clock_in_at?: string | null
          clock_in_lat?: number | null
          clock_in_lng?: number | null
          clock_in_within_geofence?: boolean | null
          clock_out_at?: string | null
          clock_out_lat?: number | null
          clock_out_lng?: number | null
          clock_out_within_geofence?: boolean | null
          created_at?: string
          flags?: string[]
          guard_id: string
          id?: string
          organization_id: string
          post_id?: string | null
          shift_id?: string | null
          site_id: string
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          clock_in_at?: string | null
          clock_in_lat?: number | null
          clock_in_lng?: number | null
          clock_in_within_geofence?: boolean | null
          clock_out_at?: string | null
          clock_out_lat?: number | null
          clock_out_lng?: number | null
          clock_out_within_geofence?: boolean | null
          created_at?: string
          flags?: string[]
          guard_id?: string
          id?: string
          organization_id?: string
          post_id?: string | null
          shift_id?: string | null
          site_id?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_guard_id_fkey"
            columns: ["guard_id"]
            isOneToOne: false
            referencedRelation: "guards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string | null
          created_at: string
          details: Json
          entity_id: string | null
          entity_label: string | null
          entity_type: string
          id: string
          organization_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_label?: string | null
          entity_type: string
          id?: string
          organization_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_label?: string | null
          entity_type?: string
          id?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          billing_address: string | null
          billing_email: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          id: string
          industry: string | null
          name: string
          notes: string | null
          organization_id: string
          status: string
          updated_at: string
        }
        Insert: {
          billing_address?: string | null
          billing_email?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          name: string
          notes?: string | null
          organization_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          billing_address?: string | null
          billing_email?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          name?: string
          notes?: string | null
          organization_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          billing_frequency: string
          client_id: string
          created_at: string
          end_date: string | null
          id: string
          notes: string | null
          organization_id: string
          overtime_rules: Json
          reference: string | null
          required_guards: number
          service_type: string
          start_date: string
          status: string
          title: string
          updated_at: string
          value: number
        }
        Insert: {
          billing_frequency?: string
          client_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          overtime_rules?: Json
          reference?: string | null
          required_guards?: number
          service_type?: string
          start_date: string
          status?: string
          title: string
          updated_at?: string
          value?: number
        }
        Update: {
          billing_frequency?: string
          client_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          overtime_rules?: Json
          reference?: string | null
          required_guards?: number
          service_type?: string
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      document_types: {
        Row: {
          created_at: string
          has_expiry: boolean
          id: string
          name: string
          organization_id: string
          required: boolean
        }
        Insert: {
          created_at?: string
          has_expiry?: boolean
          id?: string
          name: string
          organization_id: string
          required?: boolean
        }
        Update: {
          created_at?: string
          has_expiry?: boolean
          id?: string
          name?: string
          organization_id?: string
          required?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "document_types_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      guard_documents: {
        Row: {
          created_at: string
          document_number: string | null
          document_type_id: string
          expiry_date: string | null
          file_path: string | null
          guard_id: string
          id: string
          issued_date: string | null
          notes: string | null
          organization_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_number?: string | null
          document_type_id: string
          expiry_date?: string | null
          file_path?: string | null
          guard_id: string
          id?: string
          issued_date?: string | null
          notes?: string | null
          organization_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_number?: string | null
          document_type_id?: string
          expiry_date?: string | null
          file_path?: string | null
          guard_id?: string
          id?: string
          issued_date?: string | null
          notes?: string | null
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guard_documents_document_type_id_fkey"
            columns: ["document_type_id"]
            isOneToOne: false
            referencedRelation: "document_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guard_documents_guard_id_fkey"
            columns: ["guard_id"]
            isOneToOne: false
            referencedRelation: "guards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guard_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      guards: {
        Row: {
          created_at: string
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string
          full_name: string
          hire_date: string | null
          id: string
          nic_number: string | null
          notes: string | null
          organization_id: string
          phone: string | null
          photo_url: string | null
          skills: string[]
          status: string
          supervisor_user_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id: string
          full_name: string
          hire_date?: string | null
          id?: string
          nic_number?: string | null
          notes?: string | null
          organization_id: string
          phone?: string | null
          photo_url?: string | null
          skills?: string[]
          status?: string
          supervisor_user_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string
          full_name?: string
          hire_date?: string | null
          id?: string
          nic_number?: string | null
          notes?: string | null
          organization_id?: string
          phone?: string | null
          photo_url?: string | null
          skills?: string[]
          status?: string
          supervisor_user_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guards_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          organization_id: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          organization_id: string
          read_at?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          organization_id?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          display_name: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string
          id?: string
          organization_id: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          country: string
          created_at: string
          currency_code: string
          id: string
          name: string
          status: string
          timezone: string
          updated_at: string
        }
        Insert: {
          country?: string
          created_at?: string
          currency_code?: string
          id?: string
          name: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          currency_code?: string
          id?: string
          name?: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string | null
          organization_id: string
          required_guards: number
          shift_pattern: string
          site_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          organization_id: string
          required_guards?: number
          shift_pattern?: string
          site_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string
          required_guards?: number
          shift_pattern?: string
          site_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      shift_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string
          guard_id: string
          id: string
          organization_id: string
          shift_id: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          guard_id: string
          id?: string
          organization_id: string
          shift_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          guard_id?: string
          id?: string
          organization_id?: string
          shift_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shift_assignments_guard_id_fkey"
            columns: ["guard_id"]
            isOneToOne: false
            referencedRelation: "guards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_assignments_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          created_at: string
          end_time: string
          id: string
          notes: string | null
          organization_id: string
          post_id: string | null
          required_guards: number
          shift_date: string
          shift_type: string
          site_id: string
          start_time: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          organization_id: string
          post_id?: string | null
          required_guards?: number
          shift_date: string
          shift_type?: string
          site_id: string
          start_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          organization_id?: string
          post_id?: string | null
          required_guards?: number
          shift_date?: string
          shift_type?: string
          site_id?: string
          start_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shifts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          address: string | null
          city: string | null
          client_id: string
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          emergency_contacts: Json
          geofence_radius_m: number
          id: string
          instructions: string | null
          latitude: number | null
          longitude: number | null
          name: string
          operating_hours: string | null
          organization_id: string
          required_guards: number
          status: string
          supervisor_user_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          client_id: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          emergency_contacts?: Json
          geofence_radius_m?: number
          id?: string
          instructions?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          operating_hours?: string | null
          organization_id: string
          required_guards?: number
          status?: string
          supervisor_user_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          client_id?: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          emergency_contacts?: Json
          geofence_radius_m?: number
          id?: string
          instructions?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          operating_hours?: string | null
          organization_id?: string
          required_guards?: number
          status?: string
          supervisor_user_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sites_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_demo_organization: {
        Args: { _company_name?: string }
        Returns: string
      }
      has_org_role: {
        Args: {
          _org: string
          _roles: Database["public"]["Enums"]["org_role"][]
        }
        Returns: boolean
      }
      is_org_manager: { Args: { _org: string }; Returns: boolean }
      is_org_member: { Args: { _org: string }; Returns: boolean }
    }
    Enums: {
      org_role:
        | "admin"
        | "operations"
        | "supervisor"
        | "finance"
        | "guard"
        | "client"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      org_role: [
        "admin",
        "operations",
        "supervisor",
        "finance",
        "guard",
        "client",
      ],
    },
  },
} as const
