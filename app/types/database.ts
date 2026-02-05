/**
 * Types générés pour la base de données Supabase
 * Ces types correspondent à la structure de la table todos
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: number;
          created_at: string;
          title: string;
          description: string | null;
          status: "en_cours" | "termine";
          user_id: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          title: string;
          description?: string | null;
          status?: "en_cours" | "termine";
          user_id: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          title?: string;
          description?: string | null;
          status?: "en_cours" | "termine";
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

/**
 * Type pour une todo provenant de la base de données
 */
export type DbTodo = Database["public"]["Tables"]["todos"]["Row"];

/**
 * Type pour l'insertion d'une todo
 */
export type DbTodoInsert = Database["public"]["Tables"]["todos"]["Insert"];

/**
 * Type pour la mise à jour d'une todo
 */
export type DbTodoUpdate = Database["public"]["Tables"]["todos"]["Update"];
