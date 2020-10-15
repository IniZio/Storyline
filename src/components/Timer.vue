<template>
  <div>Playground</div>
  {{ time }}
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

  export default defineComponent({
    setup() {
      const time = ref(0);
      
      setInterval(() => {
        time.value++;
      }, 1000)

      return {
        time
      };
    }
  })
</script>
