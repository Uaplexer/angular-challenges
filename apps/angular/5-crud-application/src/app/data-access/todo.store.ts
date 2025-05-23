import { inject, Injectable, signal } from '@angular/core';
import { FakeHttpService } from '../api/todo.service';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoStore {
  service = inject(FakeHttpService);

  todos = signal<Todo[]>([]);
  isLoading = signal<boolean>(false);

  load() {
    this.isLoading.set(true);
    this.service.fetchTodos$().subscribe({
      next: (todos: Todo[]) => {
        this.todos.set(todos);
      },
      error: (error) => {
        console.error('Failed to load todos', error);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  update(todo: Todo) {
    this.isLoading.set(true);
    this.service.updateTodo$(todo).subscribe({
      next: (updatedTodo: Todo) => {
        this.todos.update((todos) => {
          const index = todos.findIndex((t) => t.id === updatedTodo.id);
          if (index === -1) return todos;
          const todosCopy = [...todos];
          todosCopy[index] = updatedTodo;
          return todosCopy;
        });
      },
      error: (error) => {
        console.error('Error during update:', error);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  delete(id: number) {
    this.isLoading.set(true);
    this.service.deleteTodo$(id).subscribe({
      next: () => {
        this.todos.update((prev) =>
          prev.filter((todo: Todo) => todo.id !== id),
        );
      },
      error: (error) => {
        console.error('Failed to delete todo', error);
      },
      complete: () => this.isLoading.set(false),
    });
  }
}
