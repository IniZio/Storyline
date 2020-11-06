<template>
  <div>Do something</div>
  <button 
    v-if="paused" 
    class="button"
    @click="start" 
  >
    Start
  </button>
  <button 
    v-if="started"
    class="button" 
    @click="pause"
  >
    Pause
  </button>
  <div>{{ timeline }}</div>

  <div>{{ humanizeDuration(total) }}</div>

  <span class="icon  has-text-success">
    <i class="fas fa-home"></i>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, ref, toRefs } from "vue";
import { formatDuration } from 'date-fns'

function useTimeline() {

  const currentTime = ref(new Date());
  const currentTimeInterval = setInterval(() => {
    currentTime.value = new Date();
  });
  onBeforeUnmount(() => {
    clearInterval(currentTimeInterval);
  });

  const timeline = ref<Date[][]>([]);

  const start = () => timeline.value.push([new Date()]);
  const pause = () => timeline.value[timeline.value.length - 1].push(new Date());
  
  const paused = computed(() => {
    const latestSlot = timeline.value[timeline.value.length - 1];

    return !latestSlot || latestSlot.length === 2;
  });
  const started = computed(() => !paused.value);

  const total = computed(() => {
    return timeline.value.reduce((acc, slot) => {
      return acc + (slot[1] || currentTime.value).getTime() - slot[0].getTime()
    }, 0);
  });

  return {
    timeline,
    start,
    pause,
    paused,
    started,
    total,
  }
}

export default defineComponent({
  setup() {
    const humanizeDuration = (milliseconds: number) => formatDuration({
      seconds: Math.floor(milliseconds / 1000)
    });
    return {
      ...toRefs(useTimeline()),
      humanizeDuration
    };
  }
});
</script>
