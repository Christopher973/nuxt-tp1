<script setup lang="ts">
import { todoSchema, type TodoInput } from "~/utils/validation";
import type { FormErrors, Todo, TodoStatus } from "~/types";

/**
 * Composant TodoForm - Formulaire de création/modification de todo
 * Utilisé pour ajouter une nouvelle tâche ou modifier une existante
 */

interface Props {
  todo?: Todo | null;
  isEditing?: boolean;
}

interface Emits {
  (e: "submit", data: TodoInput): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  todo: null,
  isEditing: false,
});

const emit = defineEmits<Emits>();

// État du formulaire
const form = reactive<TodoInput>({
  title: "",
  description: "",
  status: "en_cours" as TodoStatus,
});

const errors = ref<FormErrors>({});
const isSubmitting = ref(false);

// Options de statut
const statusOptions = [
  { value: "en_cours", label: "En cours" },
  { value: "termine", label: "Terminé" },
];

/**
 * Initialisation du formulaire avec les données existantes si en mode édition
 */
watch(
  () => props.todo,
  (newTodo) => {
    if (newTodo) {
      form.title = newTodo.title;
      form.description = newTodo.description || "";
      form.status = newTodo.status;
    } else {
      form.title = "";
      form.description = "";
      form.status = "en_cours";
    }
  },
  { immediate: true },
);

/**
 * Validation du formulaire avec Zod
 */
function validateForm(): boolean {
  errors.value = {};
  const result = todoSchema.safeParse(form);

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as string;
      errors.value[field] = issue.message;
    });
    return false;
  }

  return true;
}

/**
 * Soumission du formulaire
 */
function handleSubmit() {
  if (!validateForm()) return;

  isSubmitting.value = true;
  emit("submit", { ...form });
}

/**
 * Annulation
 */
function handleCancel() {
  emit("cancel");
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <!-- En-tête -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900">
        {{ isEditing ? "Modifier la tâche" : "Nouvelle tâche" }}
      </h3>
      <p class="text-sm text-gray-500 mt-1">
        {{
          isEditing
            ? "Modifiez les informations de votre tâche"
            : "Ajoutez une nouvelle tâche à votre liste"
        }}
      </p>
    </div>

    <!-- Formulaire -->
    <form class="space-y-5" @submit.prevent="handleSubmit">
      <!-- Titre -->
      <div>
        <label
          for="todo-title"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Titre <span class="text-red-500">*</span>
        </label>
        <input
          id="todo-title"
          v-model="form.title"
          type="text"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          :class="errors.title ? 'border-red-500' : 'border-gray-300'"
          placeholder="Entrez le titre de la tâche"
        />
        <p v-if="errors.title" class="mt-1 text-sm text-red-600">
          {{ errors.title }}
        </p>
      </div>

      <!-- Description -->
      <div>
        <label
          for="todo-description"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="todo-description"
          v-model="form.description"
          rows="3"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
          :class="errors.description ? 'border-red-500' : 'border-gray-300'"
          placeholder="Décrivez votre tâche (optionnel)"
        />
        <p v-if="errors.description" class="mt-1 text-sm text-red-600">
          {{ errors.description }}
        </p>
      </div>

      <!-- Statut -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Statut
        </label>
        <div class="flex gap-4">
          <label
            v-for="option in statusOptions"
            :key="option.value"
            class="flex items-center gap-2 cursor-pointer"
          >
            <input
              v-model="form.status"
              type="radio"
              :value="option.value"
              class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            <span class="text-sm text-gray-700">{{ option.label }}</span>
          </label>
        </div>
      </div>

      <!-- Boutons d'action -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          @click="handleCancel"
        >
          Annuler
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isSubmitting" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
            Enregistrement...
          </span>
          <span v-else>{{
            isEditing ? "Mettre à jour" : "Créer la tâche"
          }}</span>
        </button>
      </div>
    </form>
  </div>
</template>
