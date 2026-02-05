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
          avatarUrl: data.user.user_metadata?.avatar_url || null,
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
          avatarUrl: data.user.user_metadata?.avatar_url || null,
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
          avatarUrl: data.session.user.user_metadata?.avatar_url || null,
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
          avatarUrl: session.user.user_metadata?.avatar_url || null,
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

  /**
   * Met à jour le profil de l'utilisateur (nom et email)
   * @param fullName - Nouveau nom complet
   * @param email - Nouvel email
   */
  async function updateProfile(fullName: string, email: string) {
    error.value = null;

    try {
      // Mise à jour des métadonnées utilisateur
      const { data, error: updateError } = await supabase.auth.updateUser({
        email,
        data: {
          full_name: fullName,
        },
      });

      if (updateError) {
        throw updateError;
      }

      if (data.user) {
        user.value = {
          id: data.user.id,
          email: data.user.email || "",
          fullName: data.user.user_metadata?.full_name || fullName,
          avatarUrl: data.user.user_metadata?.avatar_url || null,
          createdAt: new Date(data.user.created_at),
        };
      }

      return { success: true, data };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la mise à jour du profil";
      error.value = message;
      return { success: false, error: message };
    }
  }

  /**
   * Change le mot de passe de l'utilisateur
   * @param newPassword - Nouveau mot de passe
   */
  async function updatePassword(newPassword: string) {
    error.value = null;

    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      return { success: true, data };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors du changement de mot de passe";
      error.value = message;
      return { success: false, error: message };
    }
  }

  /**
   * Upload un avatar pour l'utilisateur
   * @param file - Fichier image à uploader
   */
  async function uploadAvatar(file: File) {
    error.value = null;

    if (!user.value) {
      return { success: false, error: "Utilisateur non connecté" };
    }

    try {
      const userId = user.value.id;
      const fileExt = file.name.split(".").pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Supprimer l'ancien avatar s'il existe
      await supabase.storage.from("avatars").remove([filePath]);

      // Upload du nouveau fichier
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const avatarUrl = urlData.publicUrl;

      // Mettre à jour les métadonnées utilisateur avec l'URL de l'avatar
      const { data, error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: avatarUrl,
        },
      });

      if (updateError) {
        throw updateError;
      }

      if (data.user) {
        user.value = {
          id: data.user.id,
          email: data.user.email || "",
          fullName: data.user.user_metadata?.full_name || "Utilisateur",
          avatarUrl: avatarUrl,
          createdAt: new Date(data.user.created_at),
        };
      }

      return { success: true, avatarUrl };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'upload de l'avatar";
      error.value = message;
      return { success: false, error: message };
    }
  }

  /**
   * Supprime l'avatar de l'utilisateur
   */
  async function removeAvatar() {
    error.value = null;

    if (!user.value) {
      return { success: false, error: "Utilisateur non connecté" };
    }

    try {
      const userId = user.value.id;

      // Lister et supprimer tous les fichiers dans le dossier de l'utilisateur
      const { data: files } = await supabase.storage
        .from("avatars")
        .list(userId);

      if (files && files.length > 0) {
        const filesToRemove = files.map((file) => `${userId}/${file.name}`);
        await supabase.storage.from("avatars").remove(filesToRemove);
      }

      // Mettre à jour les métadonnées utilisateur pour supprimer l'URL de l'avatar
      const { data, error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: null,
        },
      });

      if (updateError) {
        throw updateError;
      }

      if (data.user) {
        user.value = {
          id: data.user.id,
          email: data.user.email || "",
          fullName: data.user.user_metadata?.full_name || "Utilisateur",
          avatarUrl: null,
          createdAt: new Date(data.user.created_at),
        };
      }

      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression de l'avatar";
      error.value = message;
      return { success: false, error: message };
    }
  }

  return {
    // État
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    error: readonly(error),
    // Méthodes d'authentification
    signUp,
    signIn,
    signOut,
    getSession,
    onAuthStateChange,
    // Méthodes de gestion du profil
    updateProfile,
    updatePassword,
    uploadAvatar,
    removeAvatar,
  };
};
