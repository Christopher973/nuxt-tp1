import type { User } from "~/types";

/**
 * Composable pour gérer l'authentification avec Supabase
 * Fournit les méthodes d'inscription, connexion, déconnexion et gestion de session
 */
export const useAuth = () => {
  const supabase = useSupabase();

  // État réactif de l'authentification
  const user = useState<User | null>("auth-user", () => null);
  const isAuthenticated = useState<boolean>(
    "auth-is-authenticated",
    () => false,
  );
  const isLoading = useState<boolean>("auth-is-loading", () => true);
  const error = useState<string | null>("auth-error", () => null);

  /**
   * Inscription d'un nouvel utilisateur
   * @param email - Adresse email
   * @param password - Mot de passe
   * @param fullName - Nom complet de l'utilisateur
   */
  async function signUp(email: string, password: string, fullName: string) {
    error.value = null;
    isLoading.value = true;

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        user.value = {
          id: data.user.id,
          email: data.user.email || "",
          fullName: data.user.user_metadata?.full_name || fullName,
          createdAt: new Date(data.user.created_at),
        };
        isAuthenticated.value = true;
      }

      return { success: true, data };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de l'inscription";
      error.value = message;
      return { success: false, error: message };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Connexion d'un utilisateur existant
   * @param email - Adresse email
   * @param password - Mot de passe
   */
  async function signIn(email: string, password: string) {
    error.value = null;
    isLoading.value = true;

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        throw signInError;
      }

      if (data.user) {
        user.value = {
          id: data.user.id,
          email: data.user.email || "",
          fullName: data.user.user_metadata?.full_name || "Utilisateur",
          createdAt: new Date(data.user.created_at),
        };
        isAuthenticated.value = true;
      }

      return { success: true, data };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de la connexion";
      error.value = message;
      return { success: false, error: message };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Déconnexion de l'utilisateur
   */
  async function signOut() {
    error.value = null;
    isLoading.value = true;

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }

      user.value = null;
      isAuthenticated.value = false;

      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de la déconnexion";
      error.value = message;
      return { success: false, error: message };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Récupère la session courante et initialise l'état
   */
  async function getSession() {
    isLoading.value = true;

    try {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (data.session?.user) {
        user.value = {
          id: data.session.user.id,
          email: data.session.user.email || "",
          fullName: data.session.user.user_metadata?.full_name || "Utilisateur",
          createdAt: new Date(data.session.user.created_at),
        };
        isAuthenticated.value = true;
      } else {
        user.value = null;
        isAuthenticated.value = false;
      }

      return { success: true, session: data.session };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération de la session";
      error.value = message;
      user.value = null;
      isAuthenticated.value = false;
      return { success: false, error: message };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Écoute les changements d'état d'authentification
   */
  function onAuthStateChange(
    callback: (isAuth: boolean, currentUser: User | null) => void,
  ) {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const currentUser: User = {
          id: session.user.id,
          email: session.user.email || "",
          fullName: session.user.user_metadata?.full_name || "Utilisateur",
          createdAt: new Date(session.user.created_at),
        };
        user.value = currentUser;
        isAuthenticated.value = true;
        callback(true, currentUser);
      } else {
        user.value = null;
        isAuthenticated.value = false;
        callback(false, null);
      }
    });
  }

  return {
    // État
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    error: readonly(error),
    // Méthodes
    signUp,
    signIn,
    signOut,
    getSession,
    onAuthStateChange,
  };
};
