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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admissions: {
        Row: {
          application_url: string | null
          college_id: string
          course_id: string | null
          created_at: string
          deadline: string | null
          documents_required: string[] | null
          id: string
          notes: string | null
          requirements: string[] | null
          updated_at: string
        }
        Insert: {
          application_url?: string | null
          college_id: string
          course_id?: string | null
          created_at?: string
          deadline?: string | null
          documents_required?: string[] | null
          id?: string
          notes?: string | null
          requirements?: string[] | null
          updated_at?: string
        }
        Update: {
          application_url?: string | null
          college_id?: string
          course_id?: string | null
          created_at?: string
          deadline?: string | null
          documents_required?: string[] | null
          id?: string
          notes?: string | null
          requirements?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admissions_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admissions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_response_cache: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          query_hash: string
          query_text: string
          response: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          query_hash: string
          query_text: string
          response: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          query_hash?: string
          query_text?: string
          response?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          college_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          college_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          college_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_history: {
        Row: {
          created_at: string
          id: string
          message: string
          role: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          role: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          role?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      college_courses: {
        Row: {
          annual_fee: number | null
          college_id: string
          course_id: string
          created_at: string
          currency: string | null
          id: string
          intake_months: string[] | null
          seats_available: number | null
        }
        Insert: {
          annual_fee?: number | null
          college_id: string
          course_id: string
          created_at?: string
          currency?: string | null
          id?: string
          intake_months?: string[] | null
          seats_available?: number | null
        }
        Update: {
          annual_fee?: number | null
          college_id?: string
          course_id?: string
          created_at?: string
          currency?: string | null
          id?: string
          intake_months?: string[] | null
          seats_available?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "college_courses_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "college_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          acceptance_rate: number | null
          city: string | null
          country: string
          created_at: string
          description: string | null
          established_year: number | null
          id: string
          logo_url: string | null
          name: string
          state: string | null
          student_count: number | null
          type: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          acceptance_rate?: number | null
          city?: string | null
          country: string
          created_at?: string
          description?: string | null
          established_year?: number | null
          id?: string
          logo_url?: string | null
          name: string
          state?: string | null
          student_count?: number | null
          type?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          acceptance_rate?: number | null
          city?: string | null
          country?: string
          created_at?: string
          description?: string | null
          established_year?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          state?: string | null
          student_count?: number | null
          type?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string
          duration_years: number | null
          field_of_study: string | null
          id: string
          level: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_years?: number | null
          field_of_study?: string | null
          id?: string
          level?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_years?: number | null
          field_of_study?: string | null
          id?: string
          level?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          comment: string | null
          created_at: string
          feedback_type: string | null
          id: string
          message_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          feedback_type?: string | null
          id?: string
          message_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          feedback_type?: string | null
          id?: string
          message_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      fees: {
        Row: {
          amount: number
          college_id: string
          created_at: string
          currency: string | null
          description: string | null
          fee_type: string | null
          id: string
          per_period: string | null
        }
        Insert: {
          amount: number
          college_id: string
          created_at?: string
          currency?: string | null
          description?: string | null
          fee_type?: string | null
          id?: string
          per_period?: string | null
        }
        Update: {
          amount?: number
          college_id?: string
          created_at?: string
          currency?: string | null
          description?: string | null
          fee_type?: string | null
          id?: string
          per_period?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fees_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rankings: {
        Row: {
          college_id: string
          created_at: string
          id: string
          rank_position: number
          ranking_body: string
          subject_area: string | null
          year: number
        }
        Insert: {
          college_id: string
          created_at?: string
          id?: string
          rank_position: number
          ranking_body: string
          subject_area?: string | null
          year: number
        }
        Update: {
          college_id?: string
          created_at?: string
          id?: string
          rank_position?: number
          ranking_body?: string
          subject_area?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "rankings_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      continents: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          id: string
          continent_id: string | null
          name: string
          iso_code: string
          created_at: string
        }
        Insert: {
          id?: string
          continent_id?: string | null
          name: string
          iso_code: string
          created_at?: string
        }
        Update: {
          id?: string
          continent_id?: string | null
          name?: string
          iso_code?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "countries_continent_id_fkey"
            columns: ["continent_id"]
            isOneToOne: false
            referencedRelation: "continents"
            referencedColumns: ["id"]
          }
        ]
      }
      states_regions: {
        Row: {
          id: string
          country_id: string | null
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          country_id?: string | null
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          country_id?: string | null
          name?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "states_regions_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          }
        ]
      }
      user_saved_locations: {
        Row: {
          id: string
          user_id: string | null
          location_hash: string
          location_snapshot: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          location_hash: string
          location_snapshot: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          location_hash?: string
          location_snapshot?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      academic_categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
        Relationships: []
      }
      academic_interests: {
        Row: {
          id: string
          category_id: string | null
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_interests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "academic_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      user_preferences: {
        Row: {
          user_id: string
          budget_range_id: string | null
          language_preference: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          budget_range_id?: string | null
          language_preference?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          budget_range_id?: string | null
          language_preference?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_preferences_budget_range_id_fkey"
            columns: ["budget_range_id"]
            isOneToOne: false
            referencedRelation: "budget_ranges"
            referencedColumns: ["id"]
          }
        ]
      }
      user_academic_interests: {
        Row: {
          user_id: string
          interest_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          interest_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          interest_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_academic_interests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_academic_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "academic_interests"
            referencedColumns: ["id"]
          }
        ]
      }
      user_degree_levels: {
        Row: {
          user_id: string
          degree_level_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          degree_level_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          degree_level_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_degree_levels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_degree_levels_degree_level_id_fkey"
            columns: ["degree_level_id"]
            isOneToOne: false
            referencedRelation: "degree_levels"
            referencedColumns: ["id"]
          }
        ]
      }
      user_study_modes: {
        Row: {
          user_id: string
          study_mode_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          study_mode_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          study_mode_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_study_modes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_study_modes_study_mode_id_fkey"
            columns: ["study_mode_id"]
            isOneToOne: false
            referencedRelation: "study_modes"
            referencedColumns: ["id"]
          }
        ]
      }
      budget_ranges: {
        Row: {
          id: string
          label: string
          min_value: number
          max_value: number
          currency: string
          created_at: string
        }
        Insert: {
          id?: string
          label: string
          min_value: number
          max_value: number
          currency?: string
          created_at?: string
        }
        Update: {
          id?: string
          label?: string
          min_value?: number
          max_value?: number
          currency?: string
          created_at?: string
        }
        Relationships: []
      }
      degree_levels: {
        Row: {
          id: string
          label: string
          created_at: string
        }
        Insert: {
          id?: string
          label: string
          created_at?: string
        }
        Update: {
          id?: string
          label?: string
          created_at?: string
        }
        Relationships: []
      }
      study_modes: {
        Row: {
          id: string
          label: string
          value: string
          created_at: string
        }
        Insert: {
          id?: string
          label: string
          value: string
          created_at?: string
        }
        Update: {
          id?: string
          label?: string
          value?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
