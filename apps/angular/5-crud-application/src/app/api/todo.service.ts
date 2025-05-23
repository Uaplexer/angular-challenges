import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { randText } from '@ngneat/falso';
import { map, Observable } from 'rxjs';
import { TodoResponse } from '../models/response.model';
import { Todo, TodoApi } from '../models/todo.model';
import { baseApiUrl } from './api.const';

@Injectable({
  providedIn: 'root',
})
export class TodoHttpService {
  http = inject(HttpClient);

  fetchTodos$(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${baseApiUrl}/todos`);
  }
  getTodo$(id: number) {
    return this.http.get<Todo>(`${baseApiUrl}/todos/${id}`);
  }

  updateTodo$(todo: Todo): Observable<Todo> {
    return this.http
      .put<TodoResponse>(`${baseApiUrl}/todos/${todo.id}`, {
        body: JSON.stringify({
          todo: todo.id,
          title: randText({ length: 7 }),
          completed: todo.completed,
          userId: todo.userId,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .pipe(
        map((obj: TodoResponse) => {
          const todo: TodoApi = JSON.parse(obj.body);
          return {
            id: todo.todo,
            title: todo.title,
            completed: todo.completed,
            userId: todo.userId,
          };
        }),
      );
  }

  deleteTodo$(id: number) {
    return this.http.delete(`${baseApiUrl}/todos/${id}`);
  }
}
