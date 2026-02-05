import type { Todo, TodoStatus } from "~/types";
import type { DbTodo } from "~/types/database";

/**
 * Composable pour gérer les opérations CRUD sur les todos avec Supabase
 */
export const useTodos = () => {
  const supabase = useSupabase();
  const { user } = useAuth();

  // État réactif des todos
  const todos = useState<Todo[]>("todos-list", () => []);
  const isLoading = useState<boolean>("todos-is-loading", () => false);
  const error = useState<string | null>("todos-error", () => null);

  /**
   * Convertit une todo de la base de données vers le format de l'application
   */
  function mapDbTodoToTodo(dbTodo: DbTodo): Todo {
    return {
      id: dbTodo.id,
      title: dbTodo.title,
      description: dbTodo.description,
      status: dbTodo.status as TodoStatus,
      createdAt: new Date(dbTodo.created_at),
      userId: dbTodo.user_id,
    };
  }

  /**
   * Récupère toutes les todos de l'utilisateur connecté
   */
  async function fetchTodos() {
    if (!user.value) {
      error.value = "Utilisateur non connecté";
      return { success: false, error: error.value };
    }

    error.value = null;
    isLoading.value = true;

    try {
      const { data, error: fetchError } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.value.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      todos.value = (data || []).map((item) => mapDbTodoToTodo(item as DbTodo));
      return { success: true, data: todos.value };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération des todos";
      error.value = message;
      return { success: false, error: message };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Crée une nouvelle todo
   * @param title - Titre de la todo
   * @param description - Description optionnelle
   * @param status - Statut initial (par défaut: en_cours)
   */
  async function createTodo(
    title: string,
    description: string | null = null,
    status: TodoStatus = "en_cours",
  ) {
    if (!user.value) {
      error.value = "Utilisateur non connecté";
      return { success: false, error: error.value };
    }

    error.value = null;

    try {
      const { data, error: insertError } = await supabase
        .from("todos")
        .insert({
          title,
          description,
          status,
          user_id: user.value.id,
        } as never)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      if (data) {
        const todo = mapDbTodoToTodo(data as DbTodo);
        todos.value = [todo, ...todos.value];
        return { success: true, data: todo };
      }

      return { success: false, error: "Aucune donnée retournée" };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la création de la todo";
      error.value = message;
      return { success: false, error: message };
    }
  }

  /**
   * Met à jour une todo existante
   * @param id - ID de la todo à modifier
   * @param updates - Champs à mettre à jour
   */
  async function updateTodo(
    id: number,
    updates: {
      title?: string;
      description?: string | null;
      status?: TodoStatus;
    },
  ) {
    if (!user.value) {
      error.value = "Utilisateur non connecté";
      return { success: false, error: error.value };
    }

    error.value = null;

    try {
      const updateData: Record<string, unknown> = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined)
        updateData.description = updates.description;
      if (updates.status !== undefined) updateData.status = updates.status;

      const { data, error: updateError } = await supabase
        .from("todos")
        .update(updateData as never)
        .eq("id", id)
        .eq("user_id", user.value.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      if (data) {
        const updatedTodo = mapDbTodoToTodo(data as DbTodo);
        const index = todos.value.findIndex((t) => t.id === id);
        if (index !== -1) {
          todos.value[index] = updatedTodo;
          // Force la réactivité
          todos.value = [...todos.value];
        }
        return { success: true, data: updatedTodo };
      }

      return { success: false, error: "Aucune donnée retournée" };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la mise à jour de la todo";
      error.value = message;
      return { success: false, error: message };
    }
  }

  /**
   * Supprime une todo
   * @param id - ID de la todo à supprimer
   */
  async function deleteTodo(id: number) {
    if (!user.value) {
      error.value = "Utilisateur non connecté";
      return { success: false, error: error.value };
    }

    error.value = null;

    try {
      const { error: deleteError } = await supabase
        .from("todos")
        .delete()
        .eq("id", id)
        .eq("user_id", user.value.id);

      if (deleteError) {
        throw deleteError;
      }

      todos.value = todos.value.filter((t) => t.id !== id);
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression de la todo";
      error.value = message;
      return { success: false, error: message };
    }
  }

  /**
   * Bascule le statut d'une todo
   * @param id - ID de la todo
   */
  async function toggleTodoStatus(id: number) {
    const todo = todos.value.find((t) => t.id === id);
    if (!todo) {
      error.value = "Todo non trouvée";
      return { success: false, error: error.value };
    }

    const newStatus: TodoStatus =
      todo.status === "en_cours" ? "termine" : "en_cours";
    return updateTodo(id, { status: newStatus });
  }

  /**
   * Réinitialise l'état des todos (utile lors de la déconnexion)
   */
  function clearTodos() {
    todos.value = [];
    error.value = null;
  }

  return {
    // État
    todos,
    isLoading: readonly(isLoading),
    error: readonly(error),
    // Méthodes
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoStatus,
    clearTodos,
  };
};
