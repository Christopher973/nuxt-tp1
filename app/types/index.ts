/**
 * Type représentant un utilisateur authentifié
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
}

/**
 * Type représentant le statut d'une todo
 */
export type TodoStatus = "en_cours" | "termine";

/**
 * Type représentant une todo
 */
export interface Todo {
  id: number;
  title: string;
  description: string | null;
  status: TodoStatus;
  createdAt: Date;
  userId: string;
}

/**
 * Type pour les erreurs de formulaire
 */
export interface FormErrors {
  [key: string]: string | undefined;
}

/**
 * Type pour l'état d'authentification
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
