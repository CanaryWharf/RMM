<template>
  <v-container>
    <v-progress-circular indeterminate :color="loaderColor" v-if="showLoader"></v-progress-circular>
    <v-btn v-else color="primary" elevation="2" @click="init">Sync Up</v-btn>
  </v-container>
</template>

<script>
import ModManager from '../manager/manager';

export default {
  props: {
    profile: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      mods: undefined,
      ready: false,
      loading: false,
    };
  },
  beforeMount() {
    this.mods = new ModManager(this.profile.folder, this.profile.modpackfile, this.callback);
  },
  watch: {
    profile() {
      this.ready = false;
      this.mods = new ModManager(this.profile.folder, this.profile.modpackfile, this.callback);
    },
  },
  computed: {
    showLoader() {
      return !this.ready || this.loading;
    },
    loaderColor() {
      return this.loading ? 'primary' : 'amber';
    },
  },
  methods: {
    callback() {
      this.ready = true;
    },
    init() {
      this.loading = true;
      this.mods.syncUp().then(() => {
        this.loading = false;
      });
    },
  },
}
</script>
