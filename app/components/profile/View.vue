<script setup lang="ts">
import type { User } from "~/types";
import type { ProfileInput, PasswordChangeInput } from "~/utils/validation";

/**
 * Composant ProfileView - Page de profil de l'utilisateur
 * Affiche et permet la modification des informations de l'utilisateur
 */

interface Props {
  user: User;
  isLoading?: boolean;
}

interface Emits {
  (e: "updateProfile", data: ProfileInput): void;
  (e: "updatePassword", data: PasswordChangeInput): void;
  (e: "updateAvatar", file: File): void;
  (e: "removeAvatar"): void;
  (e: "back"): void;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

defineEmits<Emits>();

// État local
const activeTab = ref<"profile" | "password">("profile");
const showAvatarUpload = ref(false);
const isEditingProfile = ref(false);
const isEditingPassword = ref(false);

/**
 * Formate la date de création du compte
 */
const formattedCreatedAt = computed(() => {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
  }).format(props.user.createdAt);
});

/**
 * Gestion de la soumission du profil
 */
function handleProfileSubmit(data: ProfileInput) {
  // Émet vers le parent qui gère la logique
}

/**
 * Gestion de la soumission du mot de passe
 */
function handlePasswordSubmit(data: PasswordChangeInput) {
  // Émet vers le parent qui gère la logique
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <!-- Bouton retour -->
    <button
      type="button"
      class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      @click="$emit('back')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
          clip-rule="evenodd"
        />
      </svg>
      Retour aux tâches
    </button>

    <!-- Carte principale -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- En-tête avec avatar -->
      <div class="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
        <div class="flex flex-col sm:flex-row items-center gap-6">
          <!-- Avatar -->
          <ProfileAvatar
            :full-name="user.fullName"
            :avatar-url="user.avatarUrl"
            size="xl"
            editable
            @edit="showAvatarUpload = true"
          />

          <!-- Informations principales -->
          <div class="text-center sm:text-left">
            <h1 class="text-2xl font-bold text-white">
              {{ user.fullName }}
            </h1>
            <p class="mt-1 text-primary-100">
              {{ user.email }}
            </p>
            <p class="mt-2 text-sm text-primary-200">
              Membre depuis le {{ formattedCreatedAt }}
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation par onglets -->
      <div class="border-b border-gray-200">
        <nav class="flex" aria-label="Onglets">
          <button
            type="button"
            class="flex-1 py-4 px-4 text-center text-sm font-medium transition-colors relative"
            :class="[
              activeTab === 'profile'
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-gray-700',
            ]"
            @click="activeTab = 'profile'"
          >
            <span class="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
              Informations
            </span>
            <span
              v-if="activeTab === 'profile'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
            />
          </button>
          <button
            type="button"
            class="flex-1 py-4 px-4 text-center text-sm font-medium transition-colors relative"
            :class="[
              activeTab === 'password'
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-gray-700',
            ]"
            @click="activeTab = 'password'"
          >
            <span class="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
              Mot de passe
            </span>
            <span
              v-if="activeTab === 'password'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
            />
          </button>
        </nav>
      </div>

      <!-- Contenu des onglets -->
      <div class="p-6">
        <!-- Onglet Informations -->
        <div v-if="activeTab === 'profile'">
          <div v-if="!isEditingProfile">
            <!-- Affichage des informations -->
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  Nom complet
                </label>
                <p class="text-lg text-gray-900">{{ user.fullName }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  Adresse email
                </label>
                <p class="text-lg text-gray-900">{{ user.email }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  Identifiant
                </label>
                <p class="text-sm text-gray-600 font-mono">{{ user.id }}</p>
              </div>

              <button
                type="button"
                class="w-full sm:w-auto py-2.5 px-6 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                @click="isEditingProfile = true"
              >
                Modifier mes informations
              </button>
            </div>
          </div>

          <!-- Formulaire d'édition -->
          <ProfileEditForm
            v-else
            :initial-full-name="user.fullName"
            :initial-email="user.email"
            :is-loading="isLoading"
            @submit="
              (data) => {
                $emit('updateProfile', data);
                isEditingProfile = false;
              }
            "
            @cancel="isEditingProfile = false"
          />
        </div>

        <!-- Onglet Mot de passe -->
        <div v-if="activeTab === 'password'">
          <div v-if="!isEditingPassword">
            <div class="text-center py-8">
              <div
                class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                Sécurisez votre compte
              </h3>
              <p class="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                Nous vous recommandons d'utiliser un mot de passe unique que
                vous n'utilisez pas sur d'autres sites.
              </p>
              <button
                type="button"
                class="py-2.5 px-6 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                @click="isEditingPassword = true"
              >
                Modifier mon mot de passe
              </button>
            </div>
          </div>

          <!-- Formulaire de mot de passe -->
          <ProfilePasswordForm
            v-else
            :is-loading="isLoading"
            @submit="
              (data) => {
                $emit('updatePassword', data);
                isEditingPassword = false;
              }
            "
            @cancel="isEditingPassword = false"
          />
        </div>
      </div>
    </div>

    <!-- Modal d'upload d'avatar -->
    <ProfileAvatarUpload
      :is-open="showAvatarUpload"
      :current-avatar-url="user.avatarUrl"
      :full-name="user.fullName"
      :is-loading="isLoading"
      @upload="
        (file) => {
          $emit('updateAvatar', file);
          showAvatarUpload = false;
        }
      "
      @remove="
        () => {
          $emit('removeAvatar');
          showAvatarUpload = false;
        }
      "
      @close="showAvatarUpload = false"
    />
  </div>
</template>
