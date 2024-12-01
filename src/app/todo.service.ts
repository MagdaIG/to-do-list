import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import { Todo } from './todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos: Todo[] = [];
  private apiUrl = 'http://localhost:3000/todos';

  constructor(private http: HttpClient) {}

  // Obtener tareas locales
  getTodos(): Todo[] {
    return this.todos;
  }

  // Agregar una nueva tarea
  addTodo(title: string, description: string, image: string, latitude: number, longitude: number) {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      description,
      image,
      latitude,
      longitude,
    };
    this.todos.push(newTodo);
  }

  // Eliminar una tarea local
  deleteTodo(id: number) {
    this.todos = this.todos.filter((t) => t.id !== id);
  }

  // Nueva función para descargar tareas desde la API
  fetchTodosFromApi(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      tap((todos) => {
        this.todos = todos; // Reemplaza las tareas locales con las obtenidas
      })
    );
  }

  async syncTodosWithApi(todos: Todo[]): Promise<Observable<any>> {
    return this.http.put<any>(this.apiUrl, todos);
  }
}
