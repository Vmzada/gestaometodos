export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          subscription_status: "inactive" | "active" | "cancelled";
          mp_subscription_id: string | null;
          subscription_expires_at: string | null;
          trial_started_at: string | null;
          renewal_reminder_sent_for: string | null;
          last_payment_at: string | null;
          full_name: string | null;
          phone: string | null;
          meta_semanal: number | null;
          meta_mensal: number | null;
          banca_inicial: number | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          subscription_status?: "inactive" | "active" | "cancelled";
          mp_subscription_id?: string | null;
          subscription_expires_at?: string | null;
          trial_started_at?: string | null;
          renewal_reminder_sent_for?: string | null;
          last_payment_at?: string | null;
          full_name?: string | null;
          phone?: string | null;
          meta_semanal?: number | null;
          meta_mensal?: number | null;
          banca_inicial?: number | null;
        };
        Update: {
          subscription_status?: "inactive" | "active" | "cancelled";
          mp_subscription_id?: string | null;
          subscription_expires_at?: string | null;
          trial_started_at?: string | null;
          renewal_reminder_sent_for?: string | null;
          last_payment_at?: string | null;
          full_name?: string | null;
          meta_semanal?: number | null;
          meta_mensal?: number | null;
          banca_inicial?: number | null;
          phone?: string | null;
        };
        Relationships: [];
      };
      entries: {
        Row: {
          id: string;
          user_id: string;
          entry_date: string;
          casa_aposta: string;
          cliente_nome: string;
          cliente_parte: number;
          deposito: number;
          saque: number;
          cpa: number;
          lucro: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          entry_date: string;
          casa_aposta: string;
          cliente_nome: string;
          cliente_parte: number;
          deposito: number;
          saque: number;
          cpa?: number;
          lucro: number;
        };
        Update: {
          entry_date?: string;
          casa_aposta?: string;
          cliente_nome?: string;
          cliente_parte?: number;
          deposito?: number;
          saque?: number;
          cpa?: number;
          lucro?: number;
        };
        Relationships: [];
      };
      delay_entries: {
        Row: {
          id: string;
          user_id: string;
          entry_date: string;
          casa_aposta: string;
          odd: number;
          valor: number;
          cliente_nome: string | null;
          cliente_parte: number;
          lucro: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          entry_date: string;
          casa_aposta: string;
          odd: number;
          valor: number;
          cliente_nome?: string | null;
          cliente_parte?: number;
          lucro: number;
        };
        Update: {
          entry_date?: string;
          casa_aposta?: string;
          odd?: number;
          valor?: number;
          cliente_nome?: string | null;
          cliente_parte?: number;
          lucro?: number;
        };
        Relationships: [];
      };
      gastos: {
        Row: {
          id: string;
          user_id: string;
          gasto_date: string;
          categoria: string;
          descricao: string | null;
          valor: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          gasto_date: string;
          categoria: string;
          descricao?: string | null;
          valor: number;
        };
        Update: {
          gasto_date?: string;
          categoria?: string;
          descricao?: string | null;
          valor?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Entry = Database["public"]["Tables"]["entries"]["Row"];
export type DelayEntry = Database["public"]["Tables"]["delay_entries"]["Row"];
export type Gasto = Database["public"]["Tables"]["gastos"]["Row"];
