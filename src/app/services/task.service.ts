import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { CreateTask, Operation, Task, UpdateTask } from '@models/task.model';
import { enviroment } from '@enviroments/enviroments.prod';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  operation: Operation = 'create';
  tasksList = signal<Task[]>([]);
  selectedTask = signal<Task | null>(null);
  apiUrl = enviroment.API_URL;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  setValueToSelectedTask(task: Task | null, operation: Operation) {
    this.operation = operation;
    this.selectedTask.set(task);
  }

  getTasks(): Observable<Task[]> {
    const token = this.tokenService.getToken();
    return this.http
      .get<Task[]>(`${this.apiUrl}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((tasks: Task[]) => {
          this.tasksList.set(tasks);
        })
      );
  }

  createTask(task: CreateTask): Observable<Task> {
    const token = this.tokenService.getToken();
    return this.http
      .post<Task>(`${this.apiUrl}/api/tasks`, task, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((newTask: Task) => {
          this.tasksList.update((tasks) => {
            const updatedTasks = [...tasks, newTask];
            updatedTasks.sort((a, b) => {
              const aTime =
                a.createdAt._seconds + a.createdAt._nanoseconds * 1e-9;
              const bTime =
                b.createdAt._seconds + b.createdAt._nanoseconds * 1e-9;
              return bTime - aTime;
            });
            return updatedTasks;
          });
        })
      );
  }

  updateTask(id: string, task: UpdateTask): Observable<Task> {
    const token = this.tokenService.getToken();
    return this.http
      .put<Task>(`${this.apiUrl}/api/tasks/${id}`, task, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap((updatedTask: Task) => {
          this.tasksList.update((tasks) => {
            const taskIndex = tasks.findIndex((taskItem) => taskItem.id === id);
            if (taskIndex !== -1) {
              const updatedTasks = [...tasks];
              updatedTasks[taskIndex] = updatedTask;
              return updatedTasks;
            }
            return tasks;
          });
        })
      );
  }

  deleteTask(id: string): Observable<Task> {
    const token = this.tokenService.getToken();
    return this.http
      .delete<Task>(`${this.apiUrl}/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        tap(() => {
          this.tasksList.update((tasks) =>
            tasks.filter((task) => task.id !== id)
          );
        })
      );
  }
}
