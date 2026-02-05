<script setup lang="ts">
/**
 * Composant ProfileAvatar - Avatar de l'utilisateur
 * Affiche l'image de profil ou les initiales si aucune image
 */

interface Props {
  fullName: string;
  avatarUrl: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  editable?: boolean;
}

interface Emits {
  (e: "edit"): void;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  editable: false,
});

defineEmits<Emits>();

/**
 * Calcule les initiales à partir du nom complet
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

/**
 * Classes de taille pour l'avatar
 */
const sizeClasses = computed(() => {
  const sizes = {
    sm: "w-10 h-10 text-sm",
    md: "w-16 h-16 text-lg",
    lg: "w-24 h-24 text-2xl",
    xl: "w-32 h-32 text-4xl",
  };
  return sizes[props.size];
});

/**
 * Génère une couleur de fond basée sur le nom
 */
const backgroundColor = computed(() => {
  const colors = [
    "bg-primary-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];

  // Génère un index basé sur le hash du nom
  let hash = 0;
  for (let i = 0; i < props.fullName.length; i++) {
    hash = props.fullName.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
});
</script>

<template>
  <div class="relative inline-block">
    <!-- Avatar avec image -->
    <div
      v-if="avatarUrl"
      :class="[
        sizeClasses,
        'rounded-full overflow-hidden ring-2 ring-white shadow-md',
      ]"
    >
      <img
        :src="avatarUrl"
        :alt="`Avatar de ${fullName}`"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Avatar avec initiales -->
    <div
      v-else
      :class="[
        sizeClasses,
        backgroundColor,
        'rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-white shadow-md',
      ]"
    >
      {{ initials }}
    </div>

    <!-- Bouton d'édition -->
    <button
      v-if="editable"
      type="button"
      class="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
      title="Modifier la photo de profil"
      @click="$emit('edit')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-gray-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
        />
      </svg>
    </button>
  </div>
</template>
