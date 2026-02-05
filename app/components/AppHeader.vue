<script setup lang="ts">
/**
 * Composant Header - En-tête de l'application
 * Affiche le logo, la navigation et les actions utilisateur
 */

interface Props {
  isAuthenticated: boolean;
  userFullName?: string;
  userAvatarUrl?: string | null;
}

interface Emits {
  (e: "logout"): void;
  (e: "openProfile"): void;
}

defineProps<Props>();
defineEmits<Emits>();

/**
 * Calcule les initiales à partir du nom complet
 */
function getInitials(fullName: string | undefined): string {
  if (!fullName) return "?";

  const names = fullName
    .trim()
    .split(" ")
    .filter((n) => n.length > 0);
  if (names.length === 0) return "?";

  const firstName = names[0];
  const lastName = names[names.length - 1];

  if (names.length === 1 && firstName) {
    return firstName.substring(0, 2).toUpperCase();
  }

  if (firstName && lastName && firstName.length > 0 && lastName.length > 0) {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  return "?";
}
</script>

<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo et titre -->
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <h1 class="text-xl font-bold text-gray-900">Todo App</h1>
        </div>

        <!-- Actions utilisateur -->
        <div v-if="isAuthenticated" class="flex items-center gap-4">
          <!-- Bouton profil avec avatar -->
          <button
            type="button"
            class="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title="Mon profil"
            @click="$emit('openProfile')"
          >
            <!-- Avatar -->
            <div
              v-if="userAvatarUrl"
              class="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary-100"
            >
              <img
                :src="userAvatarUrl"
                :alt="`Avatar de ${userFullName}`"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-primary-100"
            >
              {{ getInitials(userFullName) }}
            </div>

            <span class="hidden sm:block text-sm text-gray-600">
              <span class="font-medium text-gray-900">{{ userFullName }}</span>
            </span>

            <!-- Icône chevron -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-400 hidden sm:block"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <!-- Bouton déconnexion -->
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            @click="$emit('logout')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
