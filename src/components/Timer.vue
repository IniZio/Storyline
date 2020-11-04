<template>
  <div>Do something</div>
  <button class="button" v-if="paused" @click="start">Start</button>
  <button class="button" v-if="started" @click="pause">Pause</button>
  <div>{{ timelines }}</div>

  <span class="icon  has-text-success">
    <i class="fas fa-home"></i>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

function useTimeline() {
  const timelines = ref<Date[][]>([]);

  const start = () => timelines.value.push([new Date()]);
  const pause = () => timelines.value[timelines.value.length - 1].push(new Date());
  
  const paused = computed(() => {
    const latestSlot = timelines.value[timelines.value.length - 1];

    return !latestSlot || latestSlot.length === 2;
  });
  const started = computed(() => !paused.value)

  return {
    timelines,
    start,
    pause,
    paused,
    started,
  }
}

export default defineComponent({
  setup() {
    return useTimeline();
  }
});
</script>
