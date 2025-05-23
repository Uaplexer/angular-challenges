import { inject, Injectable } from '@angular/core';
import { patchState, signalState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { TodoHttpService } from '../api/todo.service';
import { Todo } from '../models/todo.model';

export interface TodoState {
  isLoading: boolean;
  todos: Todo[] | null;
  todosLoadings: boolean[] | null;
  error: string | null;
}

const initialState: TodoState = {
  isLoading: false,
  todos: null,
  todosLoadings: null,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class TodoSignalStore {
  private readonly todoService = inject(TodoHttpService);
  private readonly state = signalState<TodoState>(initialState);

  readonly todos = this.state.todos;
  readonly isLoading = this.state.isLoading;
  readonly todosLoadings = this.state.todosLoadings;
  readonly error = this.state.error;

  load = rxMethod<void>(
    pipe(
      tap(() => patchState(this.state, { isLoading: true })),
      switchMap(() =>
        this.todoService.fetchTodos$().pipe(
          tap({
            next: (todos: Todo[]) => {
              patchState(this.state, {
                todos,
                todosLoadings: Array(todos.length).fill(false),
              });
            },
            error: (error) => patchState(this.state, { error: error.message }),
            complete: () => patchState(this.state, { isLoading: false }),
          }),
        ),
      ),
    ),
  );

  update = rxMethod<Todo>(
    pipe(
      tap((todo: Todo) => {
        this.setTodoLoadingState(todo.id, true);
        patchState(this.state, { isLoading: true });
      }),
      switchMap((todo: Todo) =>
        this.todoService.updateTodo$(todo).pipe(
          tap({
            next: (updatedTodo: Todo) => {
              const todos = this.state.todos();
              if (!todos) return;
              const index = todos.findIndex((t) => t.id === updatedTodo.id);
              if (index !== -1) {
                const updated = [...todos];
                updated[index] = updatedTodo;
                patchState(this.state, { todos: updated });
              }
            },
            error: (error) => patchState(this.state, { error: error.message }),
            complete: () => {
              this.setTodoLoadingState(todo.id, false);
              patchState(this.state, { isLoading: false });
            },
          }),
        ),
      ),
    ),
  );

  delete = rxMethod<number>(
    pipe(
      tap((todoId: number) => {
        this.setTodoLoadingState(todoId, true);
        patchState(this.state, { isLoading: true });
      }),
      switchMap((todoId: number) =>
        this.todoService.deleteTodo$(todoId).pipe(
          tap({
            next: () => {
              const todos = this.state.todos();
              if (!todos) return;
              this.setTodoLoadingState(todoId, false, true);
              patchState(this.state, {
                todos: todos.filter((todo) => todo.id !== todoId),
              });
            },
            error: (error) => patchState(this.state, { error: error.message }),
            complete: () => {
              patchState(this.state, { isLoading: false });
            },
          }),
        ),
      ),
    ),
  );

  setTodoLoadingState(todoId: number, state: boolean, del = false) {
    const todos = this.state.todos();
    const loadings = this.state.todosLoadings();
    if (!todos || !loadings) return;

    const index = todos.findIndex((t) => t.id === todoId);
    if (index === -1) return;

    const newLoadings = [...loadings];
    newLoadings[index] = state;

    if (del) {
      newLoadings.splice(index, 1);
    }

    patchState(this.state, { todosLoadings: newLoadings });
  }
}
