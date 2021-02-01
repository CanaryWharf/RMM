<template>
  <v-container>
    <v-btn color="primary" @click="toggleCreatePofile">Create new profile <v-icon>{{newProfileIcon}}</v-icon></v-btn>
    <v-main v-if="createProfileOpen">
      <v-text-field v-model="profileName" label="Profile name"></v-text-field>
      <v-text-field v-model="profileUrl" label="Modpack Url"></v-text-field>
      <!-- <input type="file" webkitdirectory @change="selectFile"/> -->
      <v-file-input color="primary" :success="folderSuccess" label="Mods Folder" :hide-input="true" webkitdirectory @change="selectFile" />
      <v-btn color="primary" @click="saveProfile">Save</v-btn>
    </v-main>
    <v-main v-if="profiles">
      <h2>Select Profile</h2>
      <v-container v-for="(prof, name) in profiles" :key="name"> 
        <v-btn color="success" @click="loadProfile(name)">{{name}}</v-btn>
        <v-btn color="error" @click="deleteProfile(name)"><v-icon>mdi-delete</v-icon></v-btn>
      </v-container>
    </v-main>
    <v-main v-if="selectedProfileName">
      <manager-ui :profile="selectedProfile"/>
    </v-main>
  </v-container>
</template>

<script>
import profileManager from '../manager/profile';
import path from 'path';
import ManagerUi from './manager-ui.vue';

export default {
  components: {
    ManagerUi,
  },
  data: () => ({
    manager: undefined,
    profileName: '',
    profileUrl: '',
    profileFolder: '',
    folderSuccess: false,
    profileswitch: false,
    createProfileOpen: false,
    selectedProfileName: undefined,
  }),
  beforeMount() {
    this.manager = new profileManager();
  },
  computed: {
    newProfileIcon() {
      return this.createProfileOpen ? 'mdi-chevron-down' : 'mdi-chevron-right';
    },
    profiles() {
      if (!this.manager) {
        return [];
      }
      this.profileswitch;
      return this.manager.profiles;
    },
    selectedProfile() {
      if (!this.manager || !this.selectedProfileName) {
        return undefined;
      }
      return this.profiles[this.selectedProfileName];
      
    },

  },
  methods: {
    toggleCreatePofile() {
      this.createProfileOpen = !this.createProfileOpen;
    },
    selectFile(ev) {
      this.profileFolder = path.dirname(ev.path);
      this.folderSuccess = true;
    },
    saveProfile() {
      this.manager.saveProfile(this.profileName, this.profileFolder, this.profileUrl);
      this.profileName = '';
      this.profileUrl = '';
      this.profileFolder = '';
      this.folderSuccess = false;
      this.createProfileOpen = false;
    },
    loadProfile(name) {
      this.selectedProfileName = name;
    },
    deleteProfile(name) {
      this.manager.deleteProfile(name);
      this.profileswitch = !this.profileswitch;
    }
  },
}
</script>
