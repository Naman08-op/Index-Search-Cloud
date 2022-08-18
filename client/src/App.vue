<template>
  <v-app>
    <v-main>
      <Search/>
    </v-main>
  </v-app>
</template>

<script>
import Search from './components/Search';

export default {
  name: 'App',

  components: {
    Search,
  },

  data: () => ({
    //
  }),
};
</script>
