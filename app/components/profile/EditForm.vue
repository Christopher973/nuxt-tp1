<script setup lang="ts">
import { profileSchema, type ProfileInput } from "~/utils/validation";
import type { FormErrors } from "~/types";

/**
 * Composant ProfileEditForm - Formulaire de modification du profil
 * Permet à l'utilisateur de modifier son nom et email
 */

interface Props {
  initialFullName: string;
  initialEmail: string;
  isLoading?: boolean;
}

interface Emits {
  (e: "submit", data: ProfileInput): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

const emit = defineEmits<Emits>();

// État du formulaire
const form = reactive<ProfileInput>({
  fullName: props.initialFullName,
  email: props.initialEmail,
});

const errors = ref<FormErrors>({});

// Synchroniser avec les props si elles changent
watch(
  () => [props.initialFullName, props.initialEmail],
  ([newName, newEmail]) => {
    form.fullName = newName ?? "";
    form.email = newEmail ?? "";
  },
);

/**
 * Vérifie si le formulaire a été modifié
 */
const hasChanges = computed(() => {
  return (
    form.fullName !== props.initialFullName || form.email !== props.initialEmail
  );
});

/**
 * Validation du formulaire avec Zod
 */
function validateForm(): boolean {
  errors.value = {};
  const result = profileSchema.safeParse(form);

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
  emit("submit", { ...form });
}

/**
 * Réinitialisation du formulaire
 */
function handleCancel() {
  form.fullName = props.initialFullName;
  form.email = props.initialEmail;
  errors.value = {};
  emit("cancel");
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <!-- Nom complet -->
    <div>
      <label
        for="profile-fullname"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        Nom complet
      </label>
      <input
        id="profile-fullname"
        v-model="form.fullName"
        type="text"
        autocomplete="name"
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        :class="{ 'border-red-500': errors.fullName }"
        placeholder="Jean Dupont"
      />
      <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">
        {{ errors.fullName }}
      </p>
    </div>

    <!-- Email -->
    <div>
      <label
        for="profile-email"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        Adresse email
      </label>
      <input
        id="profile-email"
        v-model="form.email"
        type="email"
        autocomplete="email"
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        :class="{ 'border-red-500': errors.email }"
        placeholder="exemple@email.com"
      />
      <p v-if="errors.email" class="mt-1 text-sm text-red-600">
        {{ errors.email }}
      </p>
    </div>

    <!-- Boutons d'action -->
    <div class="flex gap-3 pt-4">
      <button
        type="button"
        class="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        @click="handleCancel"
      >
        Annuler
      </button>
      <button
        type="submit"
        :disabled="isLoading || !hasChanges"
        class="flex-1 py-2.5 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span v-if="isLoading" class="flex items-center justify-center gap-2">
          <svg
            class="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Enregistrement...
        </span>
        <span v-else>Enregistrer les modifications</span>
      </button>
    </div>
  </form>
</template>
