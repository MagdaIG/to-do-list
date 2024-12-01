import { Component } from '@angular/core';
import {IonicModule, ModalController} from '@ionic/angular';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TodoService } from '../todo.service';
import { Todo } from '../todo.model';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
  imports: [
    IonicModule,
    NgForOf,
    NgIf
  ]
})
export class TaskListPage {
  tasks: Todo[] = [];

  constructor(private todoService: TodoService, private modalController: ModalController) {
    this.loadTasks();
  }

  loadTasks() {
    this.tasks = this.todoService.getTodos();
  }

  async openTaskForm() {
    const modal = await this.modalController.create({
      component: TaskFormComponent,
    });

    modal.onDidDismiss().then(() => {
      this.loadTasks();
    });

    return await modal.present();
  }

  deleteTask(id: number) {
    this.todoService.deleteTodo(id);
    this.loadTasks();
  }

  downloadTasks() {
    this.todoService.fetchTodosFromApi().subscribe(
      (data: Todo[]) => {
        this.tasks = data; // Actualiza las tareas locales con los datos de la API
        console.log('Tareas descargadas:', data);
      },
      (error) => {
        console.error('Error al descargar tareas:', error);
      }
    );
  }

  async uploadTasks() {
    (await this.todoService.syncTodosWithApi(this.tasks)).subscribe(
      (response) => {
        console.log('Tareas subidas exitosamente:', response);
      },
      (error) => {
        console.error('Error al subir tareas:', error);
      }
    );
  }
}
