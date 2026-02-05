<script setup lang="ts">
import type { Todo } from "~/types";

/**
 * Composant TodoList - Liste des todos
 * Affiche toutes les tâches de l'utilisateur avec filtres et statistiques
 */

interface Props {
  todos: Todo[];
  isLoading?: boolean;
}

interface Emits {
  (e: "edit", todo: Todo): void;
  (e: "delete", todo: Todo): void;
  (e: "toggleStatus", todo: Todo): void;
  (e: "create"): void;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

defineEmits<Emits>();

// Filtre actif
const activeFilter = ref<"all" | "en_cours" | "termine">("all");

// Filtres disponibles
const filters = [
  { value: "all", label: "Toutes" },
  { value: "en_cours", label: "En cours" },
  { value: "termine", label: "Terminées" },
] as const;

/**
 * Todos filtrés selon le filtre actif
 */
const filteredTodos = computed(() => {
  if (activeFilter.value === "all") {
    return props.todos;
  }
  return props.todos.filter((todo) => todo.status === activeFilter.value);
});

/**
 * Statistiques des todos
 */
const stats = computed(() => ({
  total: props.todos.length,
  enCours: props.todos.filter((t) => t.status === "en_cours").length,
  terminees: props.todos.filter((t) => t.status === "termine").length,
}));
</script>

<template>
  <div class="space-y-6">
    <!-- En-tête avec statistiques et bouton d'ajout -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h2 class="text-xl font-bold text-gray-900">Mes tâches</h2>
        <p class="text-sm text-gray-500 mt-1">
          {{ stats.total }} tâche{{ stats.total > 1 ? "s" : "" }} •
          {{ stats.enCours }} en cours • {{ stats.terminees }} terminée{{
            stats.terminees > 1 ? "s" : ""
          }}
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        @click="$emit('create')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        Nouvelle tâche
      </button>
    </div>

    <!-- Filtres -->
    <div class="flex gap-2">
      <button
        v-for="filter in filters"
        :key="filter.value"
        type="button"
        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
        :class="
          activeFilter === filter.value
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        "
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
        <span
          class="ml-1.5 px-1.5 py-0.5 text-xs rounded-full"
          :class="
            activeFilter === filter.value
              ? 'bg-primary-500 text-white'
              : 'bg-gray-200 text-gray-600'
          "
        >
          {{
            filter.value === "all"
              ? stats.total
              : filter.value === "en_cours"
                ? stats.enCours
                : stats.terminees
          }}
        </span>
      </button>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-primary-600" viewBox="0 0 24 24">
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
    </div>

    <!-- Liste des todos -->
    <div v-else-if="filteredTodos.length > 0" class="space-y-3">
      <TodoTodoItem
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @toggle-status="$emit('toggleStatus', $event)"
      />
    </div>

    <!-- État vide -->
    <div
      v-else
      class="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">
        {{
          activeFilter === "all"
            ? "Aucune tâche"
            : "Aucune tâche dans cette catégorie"
        }}
      </h3>
      <p class="mt-2 text-sm text-gray-500">
        {{
          activeFilter === "all"
            ? "Commencez par créer votre première tâche"
            : "Changez de filtre ou créez une nouvelle tâche"
        }}
      </p>
      <button
        v-if="activeFilter === 'all'"
        type="button"
        class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        @click="$emit('create')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        Créer une tâche
      </button>
    </div>
  </div>
</template>
