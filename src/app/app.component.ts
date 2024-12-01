import { Component } from '@angular/core';
import {IonApp, IonRouterOutlet, Platform} from '@ionic/angular/standalone';
import {TaskListPage} from "./task-list/task-list.page";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, TaskListPage],
})

export class AppComponent {
  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      // Establecer el tema manualmente
      document.body.classList.add('light-theme'); // Forzar tema claro
      // Si prefieres el tema oscuro, utiliza 'dark-theme'
    });
  }
}
