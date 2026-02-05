<script setup lang="ts">
/**
 * Composant ProfileAvatarUpload - Modal d'upload d'avatar
 * Permet à l'utilisateur de télécharger une nouvelle photo de profil
 */

interface Props {
  isOpen: boolean;
  currentAvatarUrl: string | null;
  fullName: string;
  isLoading?: boolean;
}

interface Emits {
  (e: "upload", file: File): void;
  (e: "remove"): void;
  (e: "close"): void;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

const emit = defineEmits<Emits>();

// État local
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const dragOver = ref(false);
const error = ref<string | null>(null);

// Référence à l'input file
const fileInput = ref<HTMLInputElement | null>(null);

/**
 * Formats de fichiers acceptés
 */
const acceptedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const maxFileSize = 5 * 1024 * 1024; // 5 Mo

/**
 * Ouvre le sélecteur de fichiers
 */
function openFileSelector() {
  fileInput.value?.click();
}

/**
 * Gère la sélection d'un fichier
 */
function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    processFile(input.files[0]);
  }
}

/**
 * Gère le drop d'un fichier
 */
function handleDrop(event: DragEvent) {
  dragOver.value = false;
  const files = event.dataTransfer?.files;
  if (files && files[0]) {
    processFile(files[0]);
  }
}

/**
 * Traite le fichier sélectionné
 */
function processFile(file: File) {
  error.value = null;

  // Vérification du format
  if (!acceptedFormats.includes(file.type)) {
    error.value = "Format non supporté. Utilisez JPG, PNG, GIF ou WebP.";
    return;
  }

  // Vérification de la taille
  if (file.size > maxFileSize) {
    error.value = "Le fichier est trop volumineux. Taille maximum : 5 Mo.";
    return;
  }

  selectedFile.value = file;

  // Créer l'aperçu
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

/**
 * Confirme l'upload
 */
function confirmUpload() {
  if (selectedFile.value) {
    emit("upload", selectedFile.value);
  }
}

/**
 * Supprime l'avatar actuel
 */
function handleRemove() {
  emit("remove");
}

/**
 * Ferme la modal
 */
function handleClose() {
  selectedFile.value = null;
  previewUrl.value = null;
  error.value = null;
  emit("close");
}

/**
 * Calcule les initiales
 */
const initials = computed(() => {
  if (!props.fullName) return "?";

  const names = props.fullName
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
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="handleClose"
        />

        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="isOpen"
              class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <!-- Titre -->
              <div class="text-center mb-6">
                <h3
                  id="modal-title"
                  class="text-lg font-semibold text-gray-900"
                >
                  Photo de profil
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  Choisissez une nouvelle photo de profil
                </p>
              </div>

              <!-- Aperçu actuel ou nouveau -->
              <div class="flex justify-center mb-6">
                <div class="relative">
                  <!-- Aperçu de la nouvelle image -->
                  <div
                    v-if="previewUrl"
                    class="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary-100"
                  >
                    <img
                      :src="previewUrl"
                      alt="Aperçu"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <!-- Image actuelle -->
                  <div
                    v-else-if="currentAvatarUrl"
                    class="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-100"
                  >
                    <img
                      :src="currentAvatarUrl"
                      :alt="`Avatar de ${fullName}`"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <!-- Initiales par défaut -->
                  <div
                    v-else
                    class="w-32 h-32 rounded-full bg-primary-500 flex items-center justify-center text-white text-4xl font-semibold ring-4 ring-primary-100"
                  >
                    {{ initials }}
                  </div>

                  <!-- Badge de sélection -->
                  <div
                    v-if="previewUrl"
                    class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full"
                  >
                    Nouvelle image
                  </div>
                </div>
              </div>

              <!-- Zone de drop -->
              <div
                class="border-2 border-dashed rounded-lg p-6 text-center transition-colors"
                :class="[
                  dragOver
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400',
                ]"
                @dragover.prevent="dragOver = true"
                @dragleave="dragOver = false"
                @drop.prevent="handleDrop"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  class="hidden"
                  @change="handleFileSelect"
                />

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
                    stroke-width="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>

                <p class="mt-2 text-sm text-gray-600">
                  <button
                    type="button"
                    class="text-primary-600 hover:text-primary-700 font-medium"
                    @click="openFileSelector"
                  >
                    Cliquez pour sélectionner
                  </button>
                  ou glissez-déposez
                </p>
                <p class="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF ou WebP (max. 5 Mo)
                </p>
              </div>

              <!-- Message d'erreur -->
              <p v-if="error" class="mt-3 text-sm text-red-600 text-center">
                {{ error }}
              </p>

              <!-- Boutons d'action -->
              <div class="mt-6 flex flex-col gap-3">
                <!-- Bouton d'upload -->
                <button
                  v-if="selectedFile"
                  type="button"
                  :disabled="isLoading"
                  class="w-full py-2.5 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  @click="confirmUpload"
                >
                  <span
                    v-if="isLoading"
                    class="flex items-center justify-center gap-2"
                  >
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
                    Envoi en cours...
                  </span>
                  <span v-else>Enregistrer la photo</span>
                </button>

                <!-- Bouton de suppression (si avatar existant) -->
                <button
                  v-if="currentAvatarUrl && !selectedFile"
                  type="button"
                  :disabled="isLoading"
                  class="w-full py-2.5 px-4 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  @click="handleRemove"
                >
                  Supprimer la photo
                </button>

                <!-- Bouton annuler -->
                <button
                  type="button"
                  class="w-full py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  @click="handleClose"
                >
                  Annuler
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
