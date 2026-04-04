export type LeadStatus =
  | "new"
  | "contacted"
  | "follow_up"
  | "won"
  | "lost"
  | "skipped";

export type RunStatus = "running" | "completed" | "failed";

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          created_at: string;
          company_name: string;
          phone: string | null;
          phone_whatsapp: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          niche_slug: string;
          status: LeadStatus;
          contacted_at: string | null;
          rating: number | null;
          review_count: number | null;
          website: string | null;
          gmb_link: string | null;
          business_description: string | null;
          business_summary: string | null;
          positive_points: string | null;
          negative_points: string | null;
          general_perception: string | null;
          ai_opportunity: string | null;
          personalized_message: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          company_name: string;
          phone?: string | null;
          phone_whatsapp?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          niche_slug: string;
          status?: LeadStatus;
          contacted_at?: string | null;
          rating?: number | null;
          review_count?: number | null;
          website?: string | null;
          gmb_link?: string | null;
          business_description?: string | null;
          business_summary?: string | null;
          positive_points?: string | null;
          negative_points?: string | null;
          general_perception?: string | null;
          ai_opportunity?: string | null;
          personalized_message?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          company_name?: string;
          phone?: string | null;
          phone_whatsapp?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          niche_slug?: string;
          status?: LeadStatus;
          contacted_at?: string | null;
          rating?: number | null;
          review_count?: number | null;
          website?: string | null;
          gmb_link?: string | null;
          business_description?: string | null;
          business_summary?: string | null;
          positive_points?: string | null;
          negative_points?: string | null;
          general_perception?: string | null;
          ai_opportunity?: string | null;
          personalized_message?: string | null;
        };
      };
      niches: {
        Row: {
          id: string;
          slug: string;
          name: string;
          active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      prospecting_runs: {
        Row: {
          id: string;
          created_at: string;
          started_at: string | null;
          finished_at: string | null;
          niche_slug: string;
          city_name: string | null;
          total_processed: number;
          total_new: number;
          total_errors: number;
          duration_seconds: number | null;
          run_status: RunStatus;
          error_message: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          started_at?: string | null;
          finished_at?: string | null;
          niche_slug: string;
          city_name?: string | null;
          total_processed?: number;
          total_new?: number;
          total_errors?: number;
          duration_seconds?: number | null;
          run_status?: RunStatus;
          error_message?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          started_at?: string | null;
          finished_at?: string | null;
          niche_slug?: string;
          city_name?: string | null;
          total_processed?: number;
          total_new?: number;
          total_errors?: number;
          duration_seconds?: number | null;
          run_status?: RunStatus;
          error_message?: string | null;
        };
      };
      dispatch_runs: {
        Row: {
          id: string;
          created_at: string;
          started_at: string | null;
          finished_at: string | null;
          total_sent: number;
          total_skipped: number;
          total_errors: number;
          duration_seconds: number | null;
          run_status: RunStatus;
          niches_processed: string[];
        };
        Insert: {
          id?: string;
          created_at?: string;
          started_at?: string | null;
          finished_at?: string | null;
          total_sent?: number;
          total_skipped?: number;
          total_errors?: number;
          duration_seconds?: number | null;
          run_status?: RunStatus;
          niches_processed?: string[];
        };
        Update: {
          id?: string;
          created_at?: string;
          started_at?: string | null;
          finished_at?: string | null;
          total_sent?: number;
          total_skipped?: number;
          total_errors?: number;
          duration_seconds?: number | null;
          run_status?: RunStatus;
          niches_processed?: string[];
        };
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          updated_at?: string;
        };
      };
    };
  };
};

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type Niche = Database["public"]["Tables"]["niches"]["Row"];
export type ProspectingRun = Database["public"]["Tables"]["prospecting_runs"]["Row"];
export type DispatchRun = Database["public"]["Tables"]["dispatch_runs"]["Row"];
export type Setting = Database["public"]["Tables"]["settings"]["Row"];
