<script setup lang="ts">
import { registerSchema, type RegisterInput } from "~/utils/validation";
import type { FormErrors } from "~/types";

/**
 * Composant RegisterForm - Formulaire d'inscription
 * Permet aux nouveaux utilisateurs de créer un compte
 */

interface Emits {
  (e: "submit", data: RegisterInput): void;
  (e: "switchToLogin"): void;
}

const emit = defineEmits<Emits>();

// État du formulaire
const form = reactive({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const errors = ref<FormErrors>({});
const isSubmitting = ref(false);

/**
 * Validation du formulaire avec Zod
 */
function validateForm(): boolean {
  errors.value = {};
  const result = registerSchema.safeParse(form);

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
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <div class="bg-white rounded-xl shadow-lg p-8">
      <!-- En-tête -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900">Créer un compte</h2>
        <p class="mt-2 text-sm text-gray-600">
          Inscrivez-vous pour commencer à gérer vos tâches
        </p>
      </div>

      <!-- Formulaire -->
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <!-- Nom complet -->
        <div>
          <label
            for="register-fullname"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Nom complet
          </label>
          <input
            id="register-fullname"
            v-model="form.fullName"
            type="text"
            autocomplete="name"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            :class="errors.fullName ? 'border-red-500' : 'border-gray-300'"
            placeholder="Jean Dupont"
          />
          <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">
            {{ errors.fullName }}
          </p>
        </div>

        <!-- Email -->
        <div>
          <label
            for="register-email"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Adresse email
          </label>
          <input
            id="register-email"
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
            for="register-password"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Mot de passe
          </label>
          <input
            id="register-password"
            v-model="form.password"
            type="password"
            autocomplete="new-password"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            :class="errors.password ? 'border-red-500' : 'border-gray-300'"
            placeholder="••••••••"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">
            {{ errors.password }}
          </p>
          <p class="mt-1 text-xs text-gray-500">Minimum 8 caractères</p>
        </div>

        <!-- Confirmation mot de passe -->
        <div>
          <label
            for="register-confirm-password"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirmer le mot de passe
          </label>
          <input
            id="register-confirm-password"
            v-model="form.confirmPassword"
            type="password"
            autocomplete="new-password"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            :class="
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            "
            placeholder="••••••••"
          />
          <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
            {{ errors.confirmPassword }}
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
            Inscription en cours...
          </span>
          <span v-else>Créer mon compte</span>
        </button>
      </form>

      <!-- Lien vers connexion -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Déjà un compte ?
          <button
            type="button"
            class="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            @click="$emit('switchToLogin')"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
