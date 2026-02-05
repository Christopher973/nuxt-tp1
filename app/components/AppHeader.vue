<script setup lang="ts">
/**
 * Composant Header - En-tête de l'application
 * Affiche le logo, la navigation et les actions utilisateur
 */

interface Props {
  isAuthenticated: boolean;
  userFullName?: string;
}

interface Emits {
  (e: "logout"): void;
}

defineProps<Props>();
defineEmits<Emits>();
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
          <span class="text-sm text-gray-600">
            Bonjour,
            <span class="font-medium text-gray-900">{{ userFullName }}</span>
          </span>
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
                d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4.414l-4.293 4.293a1 1 0 01-1.414 0L4 7.414 5.414 6l3.293 3.293L13 5l1 2.414z"
                clip-rule="evenodd"
              />
            </svg>
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
