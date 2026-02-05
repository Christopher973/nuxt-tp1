<script setup lang="ts">
import { loginSchema, type LoginInput } from "~/utils/validation";
import type { FormErrors } from "~/types";

/**
 * Composant LoginForm - Formulaire de connexion
 * Permet aux utilisateurs de se connecter à leur compte
 */

interface Emits {
  (e: "submit", data: LoginInput): void;
  (e: "switchToRegister"): void;
}

const emit = defineEmits<Emits>();

// État du formulaire
const form = reactive<LoginInput>({
  email: "",
  password: "",
});

const errors = ref<FormErrors>({});
const isSubmitting = ref(false);

/**
 * Validation du formulaire avec Zod
 */
function validateForm(): boolean {
  errors.value = {};
  const result = loginSchema.safeParse(form);

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
  // Le parent gère la logique de soumission et réinitialise isSubmitting si nécessaire
}
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <div class="bg-white rounded-xl shadow-lg p-8">
      <!-- En-tête -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900">Connexion</h2>
        <p class="mt-2 text-sm text-gray-600">
          Connectez-vous pour accéder à vos tâches
        </p>
      </div>

      <!-- Formulaire -->
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <!-- Email -->
        <div>
          <label
            for="login-email"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Adresse email
          </label>
          <input
            id="login-email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            :class="errors.email ? 'border-red-500' : 'border-gray-300'"
            placeholder="exemple@email.com"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">
            {{ errors.email }}
          </p>
        </div>

        <!-- Mot de passe -->
        <div>
          <label
            for="login-password"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Mot de passe
          </label>
          <input
            id="login-password"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            :class="errors.password ? 'border-red-500' : 'border-gray-300'"
            placeholder="••••••••"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">
            {{ errors.password }}
          </p>
        </div>

        <!-- Bouton de soumission -->
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span
            v-if="isSubmitting"
            class="flex items-center justify-center gap-2"
          >
            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
            Connexion en cours...
          </span>
          <span v-else>Se connecter</span>
        </button>
      </form>

      <!-- Lien vers inscription -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Pas encore de compte ?
          <button
            type="button"
            class="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            @click="$emit('switchToRegister')"
          >
            Créer un compte
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
