<script setup>
  import { toast } from "vue3-toastify";

  import { onMounted, ref, watch } from "vue";
  import { useTodoStore } from "./stores/todoStore";
  import { useRoute, useRouter } from "vue-router";

  const store = useTodoStore();
  const newTask = ref("");
  const togglingTodoId = ref(null);

  const route = useRoute();
  const router = useRouter();

  async function fetchWithQueryPage() {
    const page = parseInt(route.query.page) || 1;
    const finished = route.query.finished || 0;

    store.filters.finished = +finished;

    await store.fetchTodos({ page, finished });
  }

  // onMounted(async () => { fetchWithQueryPage(); });

  watch(
    () => route.query,
    () => {
      fetchWithQueryPage();
    },
    { deep: false }
  );

  async function addTodo() {
    const newTaskValue = newTask?.value.trim();

    if (!newTaskValue) return;
    await store.addTodo(newTaskValue);

    toast.success("New task added!");

    router.push({ query: { ...route.query, page: 1 } });

    newTask.value = "";
  }

  async function filterByFinished(value) {
    store.filters.finished = value;

    let { finished, ...query } = route.query;

    if (+value === 1) query.finished = value;

    query.page = 1;

    const queryObj = query;

    // await store.fetchTodos({ query });
    await router.push({ query });
  }

  async function toggleFinished(todo) {
    togglingTodoId.value = todo.id;

    await store.toggleFinished(todo);
    togglingTodoId.value = null;

    const taskName = todo?.task_name;

    if (!todo.finished) toast.success(`Task "${taskName.substring(0, 10)}..." marked as completed 🎉`);
  }

  async function deleteTodoItem(todo) {
    togglingTodoId.value = todo.id;

    await store.deleteTodo(todo.id);
    togglingTodoId.value = null;

    const taskName = todo?.task_name;
    toast.error(`Deleted Task "${taskName.substring(0, 20)}..."`);

    await router.push({ query: { ...route.query, page: 1 } });
  }
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto space-y-6 bg-white shadow-md rounded my-10">
    <div class="p-6 max-w-2xl mx-auto">
      <h1 :class="['text-2xl font-bold mb-4']">Todos</h1>

      <div class="flex gap-2 justify-center mt-4">
        <button @click="filterByFinished(null)" class="cursor-pointer px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
          Remaining
        </button>
        <button @click="filterByFinished(1)" class="cursor-pointer px-4 py-2 rounded bg-green-200 hover:bg-green-300">
          Finished
        </button>
      </div>
    </div>

    <div :class="['mb-6 flex items-center space-x-2', { 'opacity-50 cursor-not-allowed': store.addTodoLoading }]">
      <input
        v-model="newTask"
        @keyup.enter="addTodo"
        placeholder="Add new task"
        class="w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-gray-200 focus:outline-none transition placeholder:text-gray-400"
      />

      <button
        @click="addTodo"
        class="px-4 py-2 bg-gray-200 cursor-pointer text-black rounded hover:bg-gray-300 disabled:opacity-50"
        :disabled="store.addTodoLoading"
      >
        Add
      </button>
    </div>

    <div :class="['flex justify-center items-center py-10', { hidden: !store.loadingContainer }]">
      <p :class="['text-2xl font-bold mb-4 animate-bounce m-2']">Loading..</p>

      <svg class="animate-spin h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" width="50px">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <div :class="['mt-4 text-center text-gray-600', { hidden: store.loadingContainer }]">
      <div v-if="store.meta.total === 0 || store.todos.length < 1">
        No
        <span v-if="store.filters.finished == 1">finished items</span>
        <span v-else-if="store.filters.finished === 0">remaining</span>
        <span v-else>tasks</span>
        found.
      </div>
      <div v-else>
        Showing {{ store.todos.length }}
        <span class="mr-2" v-if="store.meta.last_page > 1">of {{ store.meta.total }} </span>
        <span v-if="store.filters.finished === 1">finished task</span>
        <span v-else-if="store.filters.finished !== 1">remaining task</span>
        <span v-if="store.meta.total > 1">s</span>.
      </div>
    </div>

    <ul :class="['divide-y divide-gray-200 mt-4 min-h-6', { 'opacity-0': store.loadingContainer }]">
      <li
        v-for="todo in store.todos"
        :key="todo.id"
        @click="toggleFinished(todo)"
        class="py-3 px-4 bg-white rounded hover:bg-gray-50 flex justify-between items-center transition cursor-pointer"
        :class="[{ 'text-gray-400': todo.finished }]"
      >
        <div class="flex items-center gap-2">
          <div>
            <i v-if="!todo.finished" class="far fa-square text-gray-400"></i>
            <i v-if="todo.finished" class="fas fa-check-circle text-green-500"></i>
          </div>
          <span
            :class="[{ 'line-through text-gray-400': todo.finished }, { 'opacity-50': togglingTodoId == todo.id }]"
            >{{ todo.task_name }}</span
          >
        </div>

        <div class="flex items-center gap-2">
          <button @click.stop="deleteTodoItem(todo)" class="text-red-500 hover:text-red-700 text-sm cursor-pointer">
            <i class="fas fa-trash-alt mr-1"></i>
            <span class="mr-2">Remove</span>
          </button>
        </div>
      </li>
    </ul>

    <div class="flex justify-center mt-6 gap-2" v-if="!store.loadingContainer && store.meta.last_page > 1">
      <button
        v-for="n in store.meta.last_page"
        :key="n"
        @click="router.push({ query: { ...route.query, page: n } })"
        class="px-2.5 py-1.5 border border-white rounded-full text-sm transition cursor-pointer"
        :class="{
          'bg-green-400 text-white': parseInt(route.query.page) === n || (!route.query.page && n === 1),
          'hover:bg-gray-100': parseInt(route.query.page) !== n,
        }"
      >
        {{ n }}
      </button>
    </div>
  </div>
</template>
