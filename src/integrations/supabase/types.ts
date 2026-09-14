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
      daily_reports: {
        Row: {
          attendance_summary: Json
          created_at: string
          id: string
          incident_summary: Json
          organization_id: string
          patrol_summary: Json
          prepared_by: string | null
          report_date: string
          shift_id: string | null
          site_id: string
          status: string
          submitted_at: string | null
          summary: string
          updated_at: string
        }
        Insert: {
          attendance_summary?: Json
          created_at?: string
          id?: string
          incident_summary?: Json
          organization_id: string
          patrol_summary?: Json
          prepared_by?: string | null
          report_date: string
          shift_id?: string | null
          site_id: string
          status?: string
          submitted_at?: string | null
          summary?: string
          updated_at?: string
        }
        Update: {
          attendance_summary?: Json
          created_at?: string
          id?: string
          incident_summary?: Json
          organization_id?: string
          patrol_summary?: Json
          prepared_by?: string | null
          report_date?: string
          shift_id?: string | null
          site_id?: string
          status?: string
          submitted_at?: string | null
          summary?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_reports_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_reports_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
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
      equipment: {
        Row: {
          asset_code: string
          category: string
          created_at: string
          id: string
          name: string
          notes: string | null
          organization_id: string
          purchase_date: string | null
          serial_number: string | null
          status: string
          updated_at: string
        }
        Insert: {
          asset_code: string
          category: string
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          organization_id: string
          purchase_date?: string | null
          serial_number?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          asset_code?: string
          category?: string
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string
          purchase_date?: string | null
          serial_number?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          contract_id: string | null
          created_at: string
          created_by: string | null
          description: string
          expense_date: string
          id: string
          organization_id: string
          receipt_path: string | null
          site_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          contract_id?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          expense_date: string
          id?: string
          organization_id: string
          receipt_path?: string | null
          site_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          contract_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          expense_date?: string
          id?: string
          organization_id?: string
          receipt_path?: string | null
          site_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
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
      incidents: {
        Row: {
          category: string
          created_at: string
          description: string
          guard_id: string | null
          id: string
          latitude: number | null
          longitude: number | null
          occurred_at: string
          organization_id: string
          photo_paths: string[]
          post_id: string | null
          reference: string
          reported_by: string | null
          resolution: string | null
          resolved_at: string | null
          severity: string
          shift_id: string | null
          site_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          guard_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          occurred_at: string
          organization_id: string
          photo_paths?: string[]
          post_id?: string | null
          reference: string
          reported_by?: string | null
          resolution?: string | null
          resolved_at?: string | null
          severity?: string
          shift_id?: string | null
          site_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          guard_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          occurred_at?: string
          organization_id?: string
          photo_paths?: string[]
          post_id?: string | null
          reference?: string
          reported_by?: string | null
          resolution?: string | null
          resolved_at?: string | null
          severity?: string
          shift_id?: string | null
          site_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incidents_guard_id_fkey"
            columns: ["guard_id"]
            isOneToOne: false
            referencedRelation: "guards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          invoice_id: string
          organization_id: string
          quantity: number
          source_id: string | null
          source_type: string | null
          unit_rate: number
        }
        Insert: {
          amount?: number
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          organization_id: string
          quantity?: number
          source_id?: string | null
          source_type?: string | null
          unit_rate?: number
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          organization_id?: string
          quantity?: number
          source_id?: string | null
          source_type?: string | null
          unit_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: string
          contract_id: string | null
          created_at: string
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          organization_id: string
          service_period_end: string | null
          service_period_start: string | null
          status: string
          subtotal: number
          tax_amount: number
          total: number
          updated_at: string
        }
        Insert: {
          client_id: string
          contract_id?: string | null
          created_at?: string
          due_date: string
          id?: string
          invoice_number: string
          issue_date: string
          notes?: string | null
          organization_id: string
          service_period_end?: string | null
          service_period_start?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          contract_id?: string | null
          created_at?: string
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          organization_id?: string
          service_period_end?: string | null
          service_period_start?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          created_at: string
          end_date: string
          guard_id: string
          id: string
          leave_type_id: string
          organization_id: string
          reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          guard_id: string
          id?: string
          leave_type_id: string
          organization_id: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          guard_id?: string
          id?: string
          leave_type_id?: string
          organization_id?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_guard_id_fkey"
            columns: ["guard_id"]
            isOneToOne: false
            referencedRelation: "guards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_types: {
        Row: {
          active: boolean
          annual_allowance_days: number | null
          created_at: string
          id: string
          name: string
          organization_id: string
          paid: boolean
        }
        Insert: {
          active?: boolean
          annual_allowance_days?: number | null
          created_at?: string
          id?: string
          name: string
          organization_id: string
          paid?: boolean
        }
        Update: {
          active?: boolean
          annual_allowance_days?: number | null
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          paid?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "leave_types_organization_id_fkey"
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
          created_by: string | null
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
          created_by?: string | null
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
          created_by?: string | null
          currency_code?: string
          id?: string
          name?: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      patrol_checkpoints: {
        Row: {
          created_at: string
          geofence_radius_m: number
          id: string
          instructions: string | null
          latitude: number | null
          longitude: number | null
          name: string
          organization_id: string
          route_id: string
          sequence_number: number
          verification_method: string
        }
        Insert: {
          created_at?: string
          geofence_radius_m?: number
          id?: string
          instructions?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          organization_id: string
          route_id: string
          sequence_number: number
          verification_method?: string
        }
        Update: {
          created_at?: string
          geofence_radius_m?: number
          id?: string
          instructions?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          organization_id?: string
          route_id?: string
          sequence_number?: number
          verification_method?: string
        }
        Relationships: [
          {
            foreignKeyName: "patrol_checkpoints_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patrol_checkpoints_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "patrol_routes"
            referencedColumns: ["id"]
          },
        ]
      }
      patrol_routes: {
        Row: {
          active: boolean
          created_at: string
          expected_duration_minutes: number
          frequency_minutes: number
          id: string
          name: string
          organization_id: string
          site_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          expected_duration_minutes?: number
          frequency_minutes?: number
          id?: string
          name: string
          organization_id: string
          site_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          expected_duration_minutes?: number
          frequency_minutes?: number
          id?: string
          name?: string
          organization_id?: string
          site_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patrol_routes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patrol_routes_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      patrol_runs: {
        Row: {
          completed_at: string | null
          created_at: string
          flags: string[]
          guard_id: string
          id: string
          organization_id: string
          route_id: string
          shift_id: string | null
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          flags?: string[]
          guard_id: string
          id?: string
          organization_id: string
          route_id: string
          shift_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          flags?: string[]
          guard_id?: string
          id?: string
          organization_id?: string
          route_id?: string
          shift_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patrol_runs_guard_id_fkey"
            columns: ["guard_id"]
            isOneToOne: false
            referencedRelation: "guards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patrol_runs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patrol_runs_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "patrol_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patrol_runs_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      patrol_scans: {
        Row: {
          checkpoint_id: string
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          note: string | null
          organization_id: string
          patrol_run_id: string
          photo_path: string | null
          scanned_at: string
          status: string
          within_geofence: boolean | null
        }
        Insert: {
          checkpoint_id: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          note?: string | null
          organization_id: string
          patrol_run_id: string
          photo_path?: string | null
          scanned_at?: string
          status?: string
          within_geofence?: boolean | null
        }
        Update: {
          checkpoint_id?: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          note?: string | null
          organization_id?: string
          patrol_run_id?: string
          photo_path?: string | null
          scanned_at?: string
          status?: string
          within_geofence?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "patrol_scans_checkpoint_id_fkey"
            columns: ["checkpoint_id"]
            isOneToOne: false
            referencedRelation: "patrol_checkpoints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patrol_scans_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patrol_scans_patrol_run_id_fkey"
            columns: ["patrol_run_id"]
            isOneToOne: false
            referencedRelation: "patrol_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      pay_rules: {
        Row: {
          active: boolean
          calculation_method: string
          conditions: Json
          created_at: string
          id: string
          name: string
          organization_id: string
          rate: number
          rule_type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          calculation_method: string
          conditions?: Json
          created_at?: string
          id?: string
          name: string
          organization_id: string
          rate?: number
          rule_type: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          calculation_method?: string
          conditions?: Json
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          rate?: number
          rule_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pay_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string | null
          method: string | null
          notes: string | null
          organization_id: string
          payment_date: string
          reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id?: string | null
          method?: string | null
          notes?: string | null
          organization_id: string
          payment_date: string
          reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string | null
          method?: string | null
          notes?: string | null
          organization_id?: string
          payment_date?: string
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_periods: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          end_date: string
          id: string
          name: string
          organization_id: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          end_date: string
          id?: string
          name: string
          organization_id: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          organization_id?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_periods_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_records: {
        Row: {
          calculation_details: Json
          created_at: string
          deductions: number
          gross_pay: number
          guard_id: string
          id: string
          net_pay: number
          normal_hours: number
          organization_id: string
          overtime_hours: number
          payroll_period_id: string
          status: string
          updated_at: string
        }
        Insert: {
          calculation_details?: Json
          created_at?: string
          deductions?: number
          gross_pay?: number
          guard_id: string
          id?: string
          net_pay?: number
          normal_hours?: number
          organization_id: string
          overtime_hours?: number
          payroll_period_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          calculation_details?: Json
          created_at?: string
          deductions?: number
          gross_pay?: number
          guard_id?: string
          id?: string
          net_pay?: number
          normal_hours?: number
          organization_id?: string
          overtime_hours?: number
          payroll_period_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_records_guard_id_fkey"
            columns: ["guard_id"]
            isOneToOne: false
            referencedRelation: "guards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_records_payroll_period_id_fkey"
            columns: ["payroll_period_id"]
            isOneToOne: false
            referencedRelation: "payroll_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      post_orders: {
        Row: {
          active: boolean
          content: string
          created_at: string
          created_by: string | null
          effective_from: string
          id: string
          organization_id: string
          post_id: string | null
          site_id: string
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          active?: boolean
          content: string
          created_at?: string
          created_by?: string | null
          effective_from?: string
          id?: string
          organization_id: string
          post_id?: string | null
          site_id: string
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          active?: boolean
          content?: string
          created_at?: string
          created_by?: string | null
          effective_from?: string
          id?: string
          organization_id?: string
          post_id?: string | null
          site_id?: string
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "post_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_orders_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_orders_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
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
      subscription_plans: {
        Row: {
          active: boolean
          code: string
          created_at: string
          currency_code: string
          features: Json
          id: string
          limits: Json
          monthly_price: number
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          currency_code?: string
          features?: Json
          id?: string
          limits?: Json
          monthly_price: number
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          currency_code?: string
          features?: Json
          id?: string
          limits?: Json
          monthly_price?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          organization_id: string
          plan_id: string
          status: string
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          organization_id: string
          plan_id: string
          status?: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          organization_id?: string
          plan_id?: string
          status?: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
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
