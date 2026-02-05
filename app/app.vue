<script setup lang="ts">
import type { Todo } from "~/types";
import type {
  LoginInput,
  RegisterInput,
  TodoInput,
  ProfileInput,
  PasswordChangeInput,
} from "~/utils/validation";

/**
 * Composant principal de l'application Todo
 * Gère l'état global de l'authentification et des todos avec Supabase
 */

// Composables Supabase
const {
  user: currentUser,
  isAuthenticated,
  isLoading: isAuthLoading,
  error: authError,
  signUp,
  signIn,
  signOut,
  getSession,
  updateProfile,
  updatePassword,
  uploadAvatar,
  removeAvatar,
} = useAuth();

const {
  todos,
  isLoading: isLoadingTodos,
  error: todosError,
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus: toggleStatus,
  clearTodos,
} = useTodos();

// État local de l'interface
const authView = ref<"login" | "register">("login");
const currentView = ref<"todos" | "profile">("todos");
const showTodoForm = ref(false);
const editingTodo = ref<Todo | null>(null);
const showDeleteModal = ref(false);
const todoToDelete = ref<Todo | null>(null);
const isProfileLoading = ref(false);

// Message d'erreur global
const globalError = ref<string | null>(null);

/**
 * Initialisation : vérifier la session au chargement
 */
onMounted(async () => {
  await getSession();
  if (isAuthenticated.value) {
    await fetchTodos();
  }
});

/**
 * Gestion de l'inscription
 */
async function handleRegister(data: RegisterInput) {
  globalError.value = null;
  const result = await signUp(data.email, data.password, data.fullName);

  if (result.success) {
    await fetchTodos();
  } else {
    globalError.value = result.error || "Erreur lors de l'inscription";
  }
}

/**
 * Gestion de la connexion
 */
async function handleLogin(data: LoginInput) {
  globalError.value = null;
  const result = await signIn(data.email, data.password);

  if (result.success) {
    await fetchTodos();
  } else {
    globalError.value = result.error || "Erreur lors de la connexion";
  }
}

/**
 * Gestion de la déconnexion
 */
async function handleLogout() {
  globalError.value = null;
  const result = await signOut();

  if (result.success) {
    clearTodos();
    showTodoForm.value = false;
    editingTodo.value = null;
    showDeleteModal.value = false;
    todoToDelete.value = null;
    currentView.value = "todos";
  } else {
    globalError.value = result.error || "Erreur lors de la déconnexion";
  }
}

/**
 * Gestion de la création d'une todo
 */
async function handleCreateTodo(data: TodoInput) {
  globalError.value = null;
  const result = await createTodo(
    data.title,
    data.description || null,
    data.status,
  );

  if (result.success) {
    showTodoForm.value = false;
  } else {
    globalError.value = result.error || "Erreur lors de la création";
  }
}

/**
 * Gestion de la modification d'une todo
 */
async function handleUpdateTodo(data: TodoInput) {
  globalError.value = null;

  if (!editingTodo.value) return;

  const result = await updateTodo(editingTodo.value.id, {
    title: data.title,
    description: data.description || null,
    status: data.status,
  });

  if (result.success) {
    showTodoForm.value = false;
    editingTodo.value = null;
  } else {
    globalError.value = result.error || "Erreur lors de la modification";
  }
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
async function confirmDelete() {
  globalError.value = null;

  if (!todoToDelete.value) return;

  const result = await deleteTodo(todoToDelete.value.id);

  if (result.success) {
    showDeleteModal.value = false;
    todoToDelete.value = null;
  } else {
    globalError.value = result.error || "Erreur lors de la suppression";
  }
}

/**
 * Changement de statut d'une todo
 */
async function handleToggleStatus(todo: Todo) {
  globalError.value = null;
  const result = await toggleStatus(todo.id);

  if (!result.success) {
    globalError.value = result.error || "Erreur lors du changement de statut";
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

/**
 * Ferme le message d'erreur global
 */
function dismissError() {
  globalError.value = null;
}

/**
 * Ouvre la page de profil
 */
function openProfile() {
  currentView.value = "profile";
}

/**
 * Retourne à la liste des todos
 */
function backToTodos() {
  currentView.value = "todos";
}

/**
 * Gestion de la mise à jour du profil
 */
async function handleUpdateProfile(data: ProfileInput) {
  globalError.value = null;
  isProfileLoading.value = true;

  try {
    const result = await updateProfile(data.fullName, data.email);

    if (!result.success) {
      globalError.value =
        result.error || "Erreur lors de la mise à jour du profil";
    }
  } finally {
    isProfileLoading.value = false;
  }
}

/**
 * Gestion du changement de mot de passe
 */
async function handleUpdatePassword(data: PasswordChangeInput) {
  globalError.value = null;
  isProfileLoading.value = true;

  try {
    const result = await updatePassword(data.newPassword);

    if (result.success) {
      // Afficher un message de succès (optionnel)
      globalError.value = null;
    } else {
      globalError.value =
        result.error || "Erreur lors du changement de mot de passe";
    }
  } finally {
    isProfileLoading.value = false;
  }
}

/**
 * Gestion de l'upload d'avatar
 */
async function handleUpdateAvatar(file: File) {
  globalError.value = null;
  isProfileLoading.value = true;

  try {
    const result = await uploadAvatar(file);

    if (!result.success) {
      globalError.value = result.error || "Erreur lors de l'upload de l'avatar";
    }
  } finally {
    isProfileLoading.value = false;
  }
}

/**
 * Gestion de la suppression d'avatar
 */
async function handleRemoveAvatar() {
  globalError.value = null;
  isProfileLoading.value = true;

  try {
    const result = await removeAvatar();

    if (!result.success) {
      globalError.value =
        result.error || "Erreur lors de la suppression de l'avatar";
    }
  } finally {
    isProfileLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <AppHeader
      :is-authenticated="isAuthenticated"
      :user-full-name="currentUser?.fullName"
      :user-avatar-url="currentUser?.avatarUrl"
      @logout="handleLogout"
      @open-profile="openProfile"
    />

    <!-- Message d'erreur global -->
    <div
      v-if="globalError"
      class="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4"
    >
      <div
        class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="flex-1">
          <p class="text-sm text-red-700">{{ globalError }}</p>
        </div>
        <button
          type="button"
          class="text-red-500 hover:text-red-700 transition-colors"
          @click="dismissError"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Contenu principal -->
    <main class="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- État de chargement initial -->
      <div
        v-if="isAuthLoading"
        class="flex items-center justify-center min-h-[60vh]"
      >
        <div class="text-center">
          <svg
            class="animate-spin h-10 w-10 text-primary-600 mx-auto"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
              fill="none"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p class="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>

      <!-- Vue non authentifiée : Formulaires d'auth -->
      <template v-else-if="!isAuthenticated">
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
        <!-- Vue Profil -->
        <ProfileView
          v-if="currentView === 'profile' && currentUser"
          :user="currentUser"
          :is-loading="isProfileLoading"
          @update-profile="handleUpdateProfile"
          @update-password="handleUpdatePassword"
          @update-avatar="handleUpdateAvatar"
          @remove-avatar="handleRemoveAvatar"
          @back="backToTodos"
        />

        <!-- Vue Todos -->
        <template v-else>
          <!-- Formulaire de création/modification -->
          <div v-if="showTodoForm" class="mb-8">
            <TodoForm
              :todo="editingTodo"
              :is-editing="!!editingTodo"
              @submit="
                editingTodo
                  ? handleUpdateTodo($event)
                  : handleCreateTodo($event)
              "
              @cancel="cancelForm"
            />
          </div>

          <!-- Liste des todos -->
          <TodoList
            v-else
            :todos="todos"
            :is-loading="isLoadingTodos"
            @create="openCreateForm"
            @edit="openEditForm"
            @delete="openDeleteModal"
            @toggle-status="handleToggleStatus"
          />
        </template>
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
