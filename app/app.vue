<script setup lang="ts">
import type { Todo, User } from "~/types";
import type { LoginInput, RegisterInput, TodoInput } from "~/utils/validation";

/**
 * Composant principal de l'application Todo
 * Gère l'état global de l'authentification et des todos
 */

// État d'authentification (simulé pour le front-end)
const isAuthenticated = ref(false);
const currentUser = ref<User | null>(null);
const authView = ref<"login" | "register">("login");

// État des todos
const todos = ref<Todo[]>([]);
const isLoadingTodos = ref(false);

// État du formulaire todo
const showTodoForm = ref(false);
const editingTodo = ref<Todo | null>(null);

// État de la modal de suppression
const showDeleteModal = ref(false);
const todoToDelete = ref<Todo | null>(null);

/**
 * Gestion de l'inscription (simulation front-end)
 */
function handleRegister(data: RegisterInput) {
  console.log("Inscription:", data);
  // TODO: Implémenter l'appel à Supabase Auth
  // Simulation d'une inscription réussie
  currentUser.value = {
    id: "user-1",
    email: data.email,
    fullName: data.fullName,
    createdAt: new Date(),
  };
  isAuthenticated.value = true;
}

/**
 * Gestion de la connexion (simulation front-end)
 */
function handleLogin(data: LoginInput) {
  console.log("Connexion:", data);
  // TODO: Implémenter l'appel à Supabase Auth
  // Simulation d'une connexion réussie
  currentUser.value = {
    id: "user-1",
    email: data.email,
    fullName: "Utilisateur Test",
    createdAt: new Date(),
  };
  isAuthenticated.value = true;
}

/**
 * Gestion de la déconnexion
 */
function handleLogout() {
  console.log("Déconnexion");
  // TODO: Implémenter l'appel à Supabase Auth
  isAuthenticated.value = false;
  currentUser.value = null;
  todos.value = [];
}

/**
 * Gestion de la création d'une todo
 */
function handleCreateTodo(data: TodoInput) {
  console.log("Création todo:", data);
  // TODO: Implémenter l'appel à Supabase
  const newTodo: Todo = {
    id: Date.now(),
    title: data.title,
    description: data.description || null,
    status: data.status,
    createdAt: new Date(),
    userId: currentUser.value?.id || "",
  };
  todos.value.unshift(newTodo);
  showTodoForm.value = false;
}

/**
 * Gestion de la modification d'une todo
 */
function handleUpdateTodo(data: TodoInput) {
  console.log("Modification todo:", data);
  // TODO: Implémenter l'appel à Supabase
  if (editingTodo.value) {
    const index = todos.value.findIndex((t) => t.id === editingTodo.value?.id);
    const existingTodo = todos.value[index];
    if (index !== -1 && existingTodo) {
      todos.value[index] = {
        id: existingTodo.id,
        title: data.title,
        description: data.description || null,
        status: data.status,
        createdAt: existingTodo.createdAt,
        userId: existingTodo.userId,
      };
    }
  }
  showTodoForm.value = false;
  editingTodo.value = null;
}

/**
 * Ouverture du formulaire d'édition
 */
function openEditForm(todo: Todo) {
  editingTodo.value = todo;
  showTodoForm.value = true;
}

/**
 * Ouverture de la modal de suppression
 */
function openDeleteModal(todo: Todo) {
  todoToDelete.value = todo;
  showDeleteModal.value = true;
}

/**
 * Confirmation de la suppression
 */
function confirmDelete() {
  console.log("Suppression todo:", todoToDelete.value);
  // TODO: Implémenter l'appel à Supabase
  if (todoToDelete.value) {
    todos.value = todos.value.filter((t) => t.id !== todoToDelete.value?.id);
  }
  showDeleteModal.value = false;
  todoToDelete.value = null;
}

/**
 * Changement de statut d'une todo
 */
function toggleTodoStatus(todo: Todo) {
  console.log("Changement statut:", todo);
  // TODO: Implémenter l'appel à Supabase
  const index = todos.value.findIndex((t) => t.id === todo.id);
  const existingTodo = todos.value[index];
  if (index !== -1 && existingTodo) {
    todos.value[index] = {
      id: existingTodo.id,
      title: existingTodo.title,
      description: existingTodo.description,
      status: todo.status === "en_cours" ? "termine" : "en_cours",
      createdAt: existingTodo.createdAt,
      userId: existingTodo.userId,
    };
  }
}

/**
 * Annulation du formulaire
 */
function cancelForm() {
  showTodoForm.value = false;
  editingTodo.value = null;
}

/**
 * Ouverture du formulaire de création
 */
function openCreateForm() {
  editingTodo.value = null;
  showTodoForm.value = true;
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <AppHeader
      :is-authenticated="isAuthenticated"
      :user-full-name="currentUser?.fullName"
      @logout="handleLogout"
    />

    <!-- Contenu principal -->
    <main class="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Vue non authentifiée : Formulaires d'auth -->
      <template v-if="!isAuthenticated">
        <div class="flex items-center justify-center min-h-[60vh]">
          <AuthLoginForm
            v-if="authView === 'login'"
            @submit="handleLogin"
            @switch-to-register="authView = 'register'"
          />
          <AuthRegisterForm
            v-else
            @submit="handleRegister"
            @switch-to-login="authView = 'login'"
          />
        </div>
      </template>

      <!-- Vue authentifiée : Gestion des todos -->
      <template v-else>
        <!-- Formulaire de création/modification -->
        <div v-if="showTodoForm" class="mb-8">
          <TodoTodoForm
            :todo="editingTodo"
            :is-editing="!!editingTodo"
            @submit="
              editingTodo ? handleUpdateTodo($event) : handleCreateTodo($event)
            "
            @cancel="cancelForm"
          />
        </div>

        <!-- Liste des todos -->
        <TodoTodoList
          v-else
          :todos="todos"
          :is-loading="isLoadingTodos"
          @create="openCreateForm"
          @edit="openEditForm"
          @delete="openDeleteModal"
          @toggle-status="toggleTodoStatus"
        />
      </template>
    </main>

    <!-- Footer -->
    <AppFooter />

    <!-- Modal de suppression -->
    <TodoDeleteModal
      :is-open="showDeleteModal"
      :todo="todoToDelete"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>
