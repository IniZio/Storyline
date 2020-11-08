<template>
  <div 
    v-for="(timeslot, index) in timeline" 
    :key="timeslot.start"
    class="card mt-2 is-flex is-align-items-center"
  >
    <a class="delete mx-4" @click="timeline.splice(index, 1)"></a>
    <input 
      v-model="timeslot.name"
      class="input"
      type="text"
    >
    <div v-if="timeslot.start" class="mx-3 is-family-primary has-text-weight-semibold1">
      {{ humanizeDuration((timeslot.end || currentTime) - timeslot.start) }}
    </div>
    <div v-if="index === timeline.length - 1">
      <button 
        v-if="paused" 
        class="button"
        :disabled="!timeslot.name"
        @click="start" 
      >
        <span class="icon is-small">
          <i class="fas fa-play"></i>
        </span>
      </button>
      <button 
        v-if="started"
        class="button" 
        :disabled="!timeslot.name"
        @click="pause"
      >
        <span class="icon is-small">
          <i class="fas fa-pause"></i>
        </span>
      </button>
    </div>
  </div>
  <textarea 
    class="textarea is-family-code mt-6" 
    rows="15"
    :value="JSON.stringify(timeline, null, 4)" 
  />
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, toRefs, watchEffect } from "vue";
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs'
dayjs.extend(utc)

type TimeSlot = {
  start: Date,
  end: Date,
  name: string,
}

type LastTimeSlot = Partial<TimeSlot> & {
  end?: undefined;
}

type SerializedTimeSlot = {
  start: string;
  end?: string;
  name: string;
}

function useTimeline() {

  const currentTime = ref(new Date());
  const currentTimeInterval = setInterval(() => {
    currentTime.value = new Date();
  });
  onBeforeUnmount(() => {
    clearInterval(currentTimeInterval);
  });

  const timeline = ref<(TimeSlot | LastTimeSlot)[]>([{
    name: '',
  }]);
  const timelineReady = ref(false);

  const start = () => {
    timeline.value[timeline.value.length - 1].start = new Date();
  }
  const pause = () => {
    if (timeline.value[timeline.value.length - 1]) {
      timeline.value[timeline.value.length - 1].end = new Date();
    }
    
    timeline.value.push({
      name: '',
    });
  }
  
  const paused = computed(() => {
    const latestSlot = timeline.value[timeline.value.length - 1];

    return latestSlot.end || !latestSlot.start;
  });
  const started = computed(() => !paused.value);

  const total = computed(() => {
    return timeline.value.reduce((acc, slot) => {
      if (!slot.start) {
        return acc;
      }
      return acc + (slot.end || currentTime.value).getTime() - slot.start.getTime()

    }, 0);
  });

  onMounted(
    () => {
      const timelineJSON = localStorage.getItem('timeline')
      if (timelineJSON) {
        timeline.value = JSON.parse(timelineJSON).map(
          (timeslotRaw: SerializedTimeSlot) => ({
            name: timeslotRaw.name,
            start: timeslotRaw.start ? dayjs(timeslotRaw.start).toDate() : undefined,
            end: timeslotRaw.end ? dayjs(timeslotRaw.end).toDate() : undefined
          })
        );
      }
      timelineReady.value = true;
    }
  );
  watchEffect(
    () => {
      if (timelineReady.value) {
        localStorage.setItem('timeline', JSON.stringify(timeline.value));
      }

       if (
        !timeline.value 
        || !timeline.value.length
        || timeline.value[timeline.value.length - 1].end
      ) {
        timeline.value = timeline.value || []
        timeline.value.push({
          name: '',
        })
      }
    }
  )

  return {
    timeline,
    start,
    pause,
    paused,
    started,
    total,
    currentTime,
  }
}

export default defineComponent({
  setup() {
    const humanizeDuration = (milliseconds: number) => {
      return dayjs(milliseconds).utc().format('HH:mm:ss')
    };
    return {
      ...toRefs(useTimeline()),
      humanizeDuration
    };
  }
});
</script>
