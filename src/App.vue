<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/rmm.png"
          transition="scale-transition"
          width="40"
        />
      </div>
      <v-spacer></v-spacer>
      Raj's Mod Manager
      <div>
      </div>
    </v-app-bar>
    <v-main>
      <profile-ui />
    </v-main>
  </v-app>
</template>

<script>
import ProfileUi from './components/profile-ui.vue';

export default {
  name: 'App',
  components: {
    ProfileUi,
  },
  data: () => ({
    selectedProfile: undefined,
  }),
};
</script>
