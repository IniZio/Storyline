<template>
  <div v-bind="$attrs">
    <div v-for="(task, index) in tasks" class="card" :key="index">
      <header class="card-header p-2">
        <input type="text" class="input" v-model="task.name">
      </header>
      <div class="card-content">
        <textarea class="textarea" v-model="task.description" />
      </div>
      <footer class="card-footer">
        <a href="#" class="card-footer-item">Save</a>
        <a href="#" class="card-footer-item">Edit</a>
        <a href="#" class="card-footer-item">Delete</a>
      </footer>
    </div>
    <button class="button mt-4" @click="appendEmptyTask">
      <span class="icon is-small">
        <i class="fas fa-plus"></i>
      </span>
    </button>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { nanoid } from 'nanoid'

type Task = {
  id: string;
  name: string;
  description?: string;
};

export default defineComponent({
  setup() {
    const tasks = ref<Task[]>([]);

    const appendEmptyTask = () => tasks.value.push({
      id: nanoid(),
      name: ''
    })

    return {
      tasks,
      appendEmptyTask,
    }
  }
})
</script>
