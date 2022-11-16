<template>
  <Home />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Home from '@/modules/general/views/Home.vue';

export default defineComponent({
  name: 'App',
  components: {
    Home
  }
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@800&display=swap');

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}

#app {
  font-family: 'Baloo 2', cursive;
}

.my-text {
  color: #213547 !important;
}

.text-dark {
  color: #2c3e50 !important;
}

.bg-dark {
  background: #213547 !important;
}

.btn-dark {
  background: #213547 !important;

  &:hover {
    background: #2c3e50 !important;
  }

  &:active {
    transform: scale(0.98);
  }
}

.btn-primary {
  &:active {
    transform: scale(0.98);
  }
}

h5 {
  text-align: center;
  text-shadow: 2px 2px 5px #000000;
}
</style>
