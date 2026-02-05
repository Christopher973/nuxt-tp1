<script setup lang="ts">
import type { Todo } from "~/types";

/**
 * Composant TodoItem - Élément individuel de la liste des todos
 * Affiche une tâche avec ses actions (modifier, supprimer, changer le statut)
 */

interface Props {
  todo: Todo;
}

interface Emits {
  (e: "edit", todo: Todo): void;
  (e: "delete", todo: Todo): void;
  (e: "toggleStatus", todo: Todo): void;
}

defineProps<Props>();
defineEmits<Emits>();

/**
 * Formate la date de création
 */
function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
</script>

<template>
  <div
    class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    :class="{ 'opacity-60': todo.status === 'termine' }"
  >
    <div class="flex items-start gap-4">
      <!-- Checkbox de statut -->
      <button
        type="button"
        class="mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
        :class="
          todo.status === 'termine'
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 hover:border-primary-500'
        "
        @click="$emit('toggleStatus', todo)"
      >
        <svg
          v-if="todo.status === 'termine'"
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- Contenu -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <h4
              class="text-base font-medium"
              :class="
                todo.status === 'termine'
                  ? 'text-gray-500 line-through'
                  : 'text-gray-900'
              "
            >
              {{ todo.title }}
            </h4>
            <p
              v-if="todo.description"
              class="mt-1 text-sm"
              :class="
                todo.status === 'termine' ? 'text-gray-400' : 'text-gray-600'
              "
            >
              {{ todo.description }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              class="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Modifier"
              @click="$emit('edit', todo)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
            </button>
            <button
              type="button"
              class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Supprimer"
              @click="$emit('delete', todo)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Métadonnées -->
        <div class="mt-3 flex items-center gap-4">
          <!-- Badge de statut -->
          <span
            class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
            :class="
              todo.status === 'termine'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            "
          >
            {{ todo.status === "termine" ? "Terminé" : "En cours" }}
          </span>

          <!-- Date de création -->
          <span class="text-xs text-gray-500">
            Créé le {{ formatDate(todo.createdAt) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
