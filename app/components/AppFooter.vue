<script setup lang="ts">
/**
 * Composant Footer - Pied de page de l'application
 * Affiche les informations de copyright et les liens utiles
 */
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <!-- Copyright -->
        <p class="text-sm text-gray-500">
          &copy; {{ currentYear }} Todo App. Tous droits réservés.
        </p>

        <!-- Liens -->
        <div class="flex items-center gap-6">
          <a
            href="#"
            class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Politique de confidentialité
          </a>
          <a
            href="#"
            class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Conditions d'utilisation
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
