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
          place_id: string;
          created_at: string;
          company_name: string;
          category: string | null;
          phone_gmb: string | null;
          phone_whatsapp: string | null;
          address: string | null;
          niche: string;
          status: LeadStatus;
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
          place_id: string;
          created_at?: string;
          company_name: string;
          category?: string | null;
          phone_gmb?: string | null;
          phone_whatsapp?: string | null;
          address?: string | null;
          niche: string;
          status?: LeadStatus;
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
          place_id?: string;
          created_at?: string;
          company_name?: string;
          category?: string | null;
          phone_gmb?: string | null;
          phone_whatsapp?: string | null;
          address?: string | null;
          niche?: string;
          status?: LeadStatus;
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
          active: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          slug: string;
          active?: boolean;
          sort_order?: number;
        };
        Update: {
          id?: string;
          slug?: string;
          active?: boolean;
          sort_order?: number;
        };
      };
      prospecting_runs: {
        Row: {
          id: string;
          started_at: string | null;
          finished_at: string | null;
          niche_slug: string;
          city_name: string | null;
          total_processed: number;
          total_new: number;
          total_errors: number;
          duration_seconds: number | null;
          run_status: RunStatus;
        };
        Insert: {
          id?: string;
          started_at?: string | null;
          finished_at?: string | null;
          niche_slug: string;
          city_name?: string | null;
          total_processed?: number;
          total_new?: number;
          total_errors?: number;
          duration_seconds?: number | null;
          run_status?: RunStatus;
        };
        Update: {
          id?: string;
          started_at?: string | null;
          finished_at?: string | null;
          niche_slug?: string;
          city_name?: string | null;
          total_processed?: number;
          total_new?: number;
          total_errors?: number;
          duration_seconds?: number | null;
          run_status?: RunStatus;
        };
      };
      dispatch_runs: {
        Row: {
          id: string;
          started_at: string | null;
          finished_at: string | null;
          total_sent: number;
          total_skipped: number;
          total_errors: number;
          duration_seconds: number | null;
          niches_processed: string[];
        };
        Insert: {
          id?: string;
          started_at?: string | null;
          finished_at?: string | null;
          total_sent?: number;
          total_skipped?: number;
          total_errors?: number;
          duration_seconds?: number | null;
          niches_processed?: string[];
        };
        Update: {
          id?: string;
          started_at?: string | null;
          finished_at?: string | null;
          total_sent?: number;
          total_skipped?: number;
          total_errors?: number;
          duration_seconds?: number | null;
          niches_processed?: string[];
        };
      };
      cities: {
        Row: {
          id: string;
          name: string;
          active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          active?: boolean;
        };
      };
      settings: {
        Row: {
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: string;
          updated_at?: string;
        };
        Update: {
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
export type City = Database["public"]["Tables"]["cities"]["Row"];
export type Setting = Database["public"]["Tables"]["settings"]["Row"];
