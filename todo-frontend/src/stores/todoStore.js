import { defineStore } from "pinia";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useTodoStore = defineStore('todo', {
    state: () => ({
        todos: [],
        meta: [],
        filters: {
            page: 1,
            finished: null,
        },
        loadingContainer: false,
    }),

    actions: {
        async fetchTodos(params = []) {
            this.loadingContainer = true;

            try {
                const res = await axios.get(apiUrl, {
                    params: { ...this.filters, ...params }
                });

                this.todos = res.data.data;

                this.meta = {
                    current_page: res.data.current_page,
                    last_page: res.data.last_page,
                    total: res.data.total,
                }
            } finally {
                this.loadingContainer = false;
            }
        },

        async toggleFinished(todo) {
            this.toggleLoading = true;
            
            try {
                const response = await axios.put(`${apiUrl}/${todo.id}`, {
                    finished: !(todo.finished),
                });

                const index = this.todos.findIndex(item => item.id === todo.id);

                if (index !== -1) this.todos[index] = response.data;

            } finally {
                this.toggleLoading = false;
            }
        },

        async addTodo(taskName) {
            this.addTodoLoading = true;

            try {
                const response = await axios.post(apiUrl, { task_name: taskName });

                this.todos.unshift(response.data);

                this.meta.total++;

            } finally {
                this.addTodoLoading = false;
            }
        },

        async deleteTodo(todoId) {
            this.deleteLoading = true;
            try {
                
                await axios.delete(`${apiUrl}/${todoId}`);
                
                this.todos = this.todos.filter(item => item.id !== todoId);
                this.meta.total--;

            } finally {
                this.deleteLoading = false;
            }
        },

    },



});