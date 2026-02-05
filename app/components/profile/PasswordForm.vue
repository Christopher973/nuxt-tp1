<script setup lang="ts">
import {
  passwordChangeSchema,
  type PasswordChangeInput,
} from "~/utils/validation";
import type { FormErrors } from "~/types";

/**
 * Composant ProfilePasswordForm - Formulaire de changement de mot de passe
 * Permet à l'utilisateur de modifier son mot de passe
 */

interface Props {
  isLoading?: boolean;
}

interface Emits {
  (e: "submit", data: PasswordChangeInput): void;
  (e: "cancel"): void;
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
});

const emit = defineEmits<Emits>();

// État du formulaire
const form = reactive<PasswordChangeInput>({
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

const errors = ref<FormErrors>({});

// Affichage des mots de passe
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

/**
 * Vérifie si le formulaire est rempli
 */
const hasInput = computed(() => {
  return (
    form.currentPassword.length > 0 &&
    form.newPassword.length > 0 &&
    form.confirmNewPassword.length > 0
  );
});

/**
 * Validation du formulaire avec Zod
 */
function validateForm(): boolean {
  errors.value = {};
  const result = passwordChangeSchema.safeParse(form);

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
  form.currentPassword = "";
  form.newPassword = "";
  form.confirmNewPassword = "";
  errors.value = {};
  emit("cancel");
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <!-- Mot de passe actuel -->
    <div>
      <label
        for="current-password"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        Mot de passe actuel
      </label>
      <div class="relative">
        <input
          id="current-password"
          v-model="form.currentPassword"
          :type="showCurrentPassword ? 'text' : 'password'"
          autocomplete="current-password"
          class="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          :class="{ 'border-red-500': errors.currentPassword }"
          placeholder="••••••••"
        />
        <button
          type="button"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          @click="showCurrentPassword = !showCurrentPassword"
        >
          <svg
            v-if="showCurrentPassword"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
              clip-rule="evenodd"
            />
            <path
              d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fill-rule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <p v-if="errors.currentPassword" class="mt-1 text-sm text-red-600">
        {{ errors.currentPassword }}
      </p>
    </div>

    <!-- Nouveau mot de passe -->
    <div>
      <label
        for="new-password"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        Nouveau mot de passe
      </label>
      <div class="relative">
        <input
          id="new-password"
          v-model="form.newPassword"
          :type="showNewPassword ? 'text' : 'password'"
          autocomplete="new-password"
          class="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          :class="{ 'border-red-500': errors.newPassword }"
          placeholder="••••••••"
        />
        <button
          type="button"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          @click="showNewPassword = !showNewPassword"
        >
          <svg
            v-if="showNewPassword"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
              clip-rule="evenodd"
            />
            <path
              d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fill-rule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <p v-if="errors.newPassword" class="mt-1 text-sm text-red-600">
        {{ errors.newPassword }}
      </p>
      <p class="mt-1 text-xs text-gray-500">Minimum 8 caractères</p>
    </div>

    <!-- Confirmation du nouveau mot de passe -->
    <div>
      <label
        for="confirm-new-password"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        Confirmer le nouveau mot de passe
      </label>
      <div class="relative">
        <input
          id="confirm-new-password"
          v-model="form.confirmNewPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          autocomplete="new-password"
          class="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          :class="{ 'border-red-500': errors.confirmNewPassword }"
          placeholder="••••••••"
        />
        <button
          type="button"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          @click="showConfirmPassword = !showConfirmPassword"
        >
          <svg
            v-if="showConfirmPassword"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
              clip-rule="evenodd"
            />
            <path
              d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fill-rule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <p v-if="errors.confirmNewPassword" class="mt-1 text-sm text-red-600">
        {{ errors.confirmNewPassword }}
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
        :disabled="isLoading || !hasInput"
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
          Modification...
        </span>
        <span v-else>Modifier le mot de passe</span>
      </button>
    </div>
  </form>
</template>
