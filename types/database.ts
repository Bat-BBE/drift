// Hand-written to match supabase/migrations/0001_init.sql.
// Once the project is live, replace this with the generated version:
//   npx supabase gen types typescript --project-id <id> > types/database.ts

export interface Database {
  public: {
    Tables: {
      anonymous_users: {
        Row: {
          id: string;
          created_at: string;
          last_seen_at: string;
          trust_score: number;
          is_blocked: boolean;
          preferred_language: string;
        };
        Insert: Partial<Database["public"]["Tables"]["anonymous_users"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["anonymous_users"]["Row"]>;
      };
      match_queue: {
        Row: {
          user_id: string;
          interest_tags: string[];
          preferred_language: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["match_queue"]["Row"]> & { user_id: string };
        Update: Partial<Database["public"]["Tables"]["match_queue"]["Row"]>;
      };
      match_sessions: {
        Row: {
          id: string;
          user_a_id: string;
          user_b_id: string;
          started_at: string;
          ended_at: string | null;
          end_reason: "left" | "reported" | "disconnected" | null;
          shared_interest_tags: string[];
        };
        Insert: Partial<Database["public"]["Tables"]["match_sessions"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["match_sessions"]["Row"]>;
      };
      messages: {
        Row: {
          id: string;
          session_id: string;
          sender_id: string;
          content: string;
          sent_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["messages"]["Row"]> & {
          session_id: string;
          sender_id: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Row"]>;
      };
      reports: {
        Row: {
          id: string;
          session_id: string;
          reporter_id: string;
          reported_id: string;
          reason: string;
          status: "pending" | "reviewed" | "actioned";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reports"]["Row"]> & {
          session_id: string;
          reporter_id: string;
          reported_id: string;
          reason: string;
        };
        Update: Partial<Database["public"]["Tables"]["reports"]["Row"]>;
      };
      block_relations: {
        Row: { blocker_id: string; blocked_id: string; created_at: string };
        Insert: { blocker_id: string; blocked_id: string };
        Update: never;
      };
      ratings: {
        Row: {
          id: string;
          session_id: string;
          rater_id: string;
          rated_id: string;
          value: "up" | "down";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["ratings"]["Row"]> & {
          session_id: string;
          rater_id: string;
          rated_id: string;
          value: "up" | "down";
        };
        Update: never;
      };
      friend_links: {
        Row: { id: string; user_a_id: string; user_b_id: string; created_at: string };
        Insert: { user_a_id: string; user_b_id: string };
        Update: never;
      };
    };
  };
}
