import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { TodoHttpService } from '../api/todo.service';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoStore {
  service = inject(TodoHttpService);

  todos = signal<Todo[]>([]);
  isLoading = signal<boolean>(false);

  load() {
    this.isLoading.set(true);
    this.service
      .fetchTodos$()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (todos: Todo[]) => {
          this.todos.set(todos);
        },
        error: (error) => {
          console.error('Failed to load todos', error);
        },
      });
  }

  update(todo: Todo) {
    this.isLoading.set(true);
    this.service
      .updateTodo$(todo)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
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
      });
  }

  delete(id: number) {
    this.isLoading.set(true);
    this.service
      .deleteTodo$(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.todos.update((prev) =>
            prev.filter((todo: Todo) => todo.id !== id),
          );
        },
        error: (error) => {
          console.error('Failed to delete todo', error);
        },
      });
  }
}
