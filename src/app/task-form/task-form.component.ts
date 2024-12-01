import { Component } from '@angular/core';
import {IonicModule, ModalController} from '@ionic/angular';
import {FormsModule, NgForm} from '@angular/forms';
import { TodoService } from '../todo.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-task-form',
  standalone: true,
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  imports: [IonicModule, FormsModule, NgIf]
})
export class TaskFormComponent {
  newTask = {
    title: '',
    description: '',
    image: ''
  };

  constructor(private todoService: TodoService, private modalController: ModalController) {}

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    if (image.base64String !== undefined) {
      this.newTask.image = `data:image/${image.format};base64,${image.base64String}`;
    }
  };

  async saveTask() {
    if (this.newTask.title.trim() && this.newTask.description.trim()) {
      const coordinates = await Geolocation.getCurrentPosition();
      const latitude = coordinates.coords.latitude;
      const longitude = coordinates.coords.longitude;
      this.todoService.addTodo(this.newTask.title, this.newTask.description, this.newTask.image, latitude, longitude);
      await this.modalController.dismiss();
    }
  }
}
