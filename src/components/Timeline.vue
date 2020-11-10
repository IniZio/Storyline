<template>
  <div class="columns">
    <div class="column is-one-third">
      <div v-for="(task, index) in tasks" class="card mb-4" :key="index">
        <header class="card-header p-2 is-flex is-align-items-center">
          <a class="delete mr-2" @click="tasks.splice(index, 1)"></a>
          <input type="text" class="input" v-model="task.name">
        </header>
        <!-- <div class="card-content">
          <textarea class="textarea" v-model="task.description" rows="3" />
        </div> -->
      </div>
      <button class="button mt-4" @click="appendEmptyTask">
        <span class="icon is-small">
          <i class="fas fa-plus"></i>
        </span>
      </button>
    </div>
    <div class="column is-two-thirds">
      <div
        v-for="(timeslot, index) in timeline" 
        :key="timeslot.start"
      >
        <div 
          v-if="timeslot.start"
          class="mb-2 is-size-7 has-text-white" 
          :data-tooltip="timeslot.start"
        >
          <div 
            v-if="index === 0 || !isSameDay(timeslot.start, timeline[index - 1].start)"
            class="has-text-weight-bold"
          >
            {{ humanizeDate(timeslot.start) }}
          </div>
          <span class="has-text-weight-semibold">{{ humanizeTime(timeslot.start) }}</span>          
          <span class="ml-3 is-italic">({{ relativeTime(timeslot.start) }})</span>          
        </div>
        <div 
          class="card mb-2 is-flex is-align-items-center"
        >
          <a class="delete mx-4" @click="timeline.splice(index, 1)"></a>
          <input 
            v-model="timeslot.name"
            class="input"
            type="text"
          >
          <div class="select">
            <select
              v-model="timeslot.taskId"
            >
              <option v-for="task in tasks" :key="task.id" :value="task.id">{{ task.name }}</option>
            </select>
          </div>
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
      </div>
      <textarea 
        class="textarea is-family-code mt-6" 
        rows="15"
        :value="JSON.stringify(timeline, null, 4)" 
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, toRefs, watchEffect } from "vue";
import { isSameDay } from 'date-fns';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
dayjs.extend(utc)
dayjs.extend(relativeTime)

type TimeSlot = {
  start: Date,
  end: Date,
  name: string,
  taskId: string;
}

type LastTimeSlot = Partial<TimeSlot> & {
  end?: undefined;
}

type SerializedTimeSlot = {
  start: string;
  end?: string;
  name: string;
  taskId: string;
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
            end: timeslotRaw.end ? dayjs(timeslotRaw.end).toDate() : undefined,
            taskId: timeslotRaw.taskId
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

import { nanoid } from 'nanoid'

type Task = {
  id: string;
  name: string;
  description?: string;
};

function useTasks() {
  const tasks = ref<Task[]>([]);
  const tasksReady = ref(false);

  const appendEmptyTask = () => tasks.value.push({
    id: nanoid(),
    name: ''
  })
  
  onMounted(
    () => {
      const tasksJSON = localStorage.getItem('tasks')
      if (tasksJSON) {
        tasks.value = JSON.parse(tasksJSON);
      }
      tasksReady.value = true;
    }
  );
  watchEffect(
    () => {
      if (tasksReady.value) {
        localStorage.setItem('tasks', JSON.stringify(tasks.value));
      }
    }
  )

  return {
    tasks,
    appendEmptyTask,
  }
}

export default defineComponent({
  setup() {
    const humanizeDuration = (milliseconds: number) => {
      return dayjs(milliseconds).utc().format('HH:mm:ss')
    };
    const humanizeTime = (time: Date) =>  dayjs(time).format('hh:mm:ss A')
    const humanizeDate = (time: Date) =>  dayjs(time).format('MMM DD (ddd)')
    const relativeTime = (time: Date) => dayjs(time).fromNow()
    return {
      ...toRefs(useTimeline()),
      ...toRefs(useTasks()),
      humanizeDuration,
      relativeTime,
      humanizeTime,
      humanizeDate,
      isSameDay,
    };
  }
});
</script>
