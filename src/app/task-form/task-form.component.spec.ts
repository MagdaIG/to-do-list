import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { TodoService } from '../todo.service';
import { ModalController } from '@ionic/angular';
import { Camera, Photo } from '@capacitor/camera';
import { Geolocation, Position } from '@capacitor/geolocation';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let todoService: jasmine.SpyObj<TodoService>;
  let modalController: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    // Crear espías para los servicios que usamos
    todoService = jasmine.createSpyObj('TodoService', ['addTodo']);
    modalController = jasmine.createSpyObj('ModalController', ['dismiss']);

    await TestBed.configureTestingModule({
      declarations: [ TaskFormComponent ],
      providers: [
        { provide: TodoService, useValue: todoService },
        { provide: ModalController, useValue: modalController }
      ]
    })
      .compileComponents();

    // Crear la instancia del componente
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Prueba para el método takePicture
  it('debería capturar y almacenar la imagen cuando se llame a takePicture', async () => {
    const mockImage: Photo = {
      base64String: 'mockBase64ImageString',
      format: 'jpeg',
      webPath: 'mock/path/to/image',
      saved: true, // Agregar la propiedad "saved"
    };

    // Simular la llamada al método getPhoto y devolver un valor simulado
    spyOn(Camera, 'getPhoto').and.returnValue(Promise.resolve(mockImage));

    // Llamar al método takePicture
    await component.takePicture();

    // Verificar que newTask.image se haya actualizado con la imagen capturada
    expect(component.newTask.image).toBe(`data:image/jpeg;base64,${mockImage.base64String}`);
  });

  // Prueba para el método saveTask
  it('debería guardar la tarea con los datos correctos y cerrar el modal', async () => {
    const mockCoordinates: Position = {
      coords: {
        latitude: 40.7128,
        longitude: -74.0060,
        accuracy: 0,
        altitudeAccuracy: undefined,
        altitude: null,
        speed: null,
        heading: null
      },
      timestamp: 1234567890, // Agregar un valor para el timestamp
    };

    // Simular la llamada a Geolocation.getCurrentPosition
    spyOn(Geolocation, 'getCurrentPosition').and.returnValue(Promise.resolve(mockCoordinates));

    // Establecer valores en newTask
    component.newTask = {
      title: 'Tarea de prueba',
      description: 'Esta es una tarea de prueba',
      image: 'mockImageData',
    };

    // Llamar al método saveTask
    await component.saveTask();

    // Verificar que el método addTodo fue llamado con los datos correctos
    expect(todoService.addTodo).toHaveBeenCalledWith(
      'Tarea de prueba',
      'Esta es una tarea de prueba',
      'mockImageData',
      40.7128,
      -74.0060
    );

    // Verificar que el modal se cerró
    expect(modalController.dismiss).toHaveBeenCalled();
  });

  // Prueba de validación para no guardar tarea si falta título o descripción
  it('no debería guardar la tarea si falta el título o la descripción', async () => {
    // Dejar el título vacío
    component.newTask = {
      title: '',
      description: 'Esta es una tarea de prueba',
      image: 'mockImageData',
    };

    // Llamar al método saveTask
    await component.saveTask();

    // Verificar que addTodo no se haya llamado porque falta el título
    expect(todoService.addTodo).not.toHaveBeenCalled();
  });

  // Prueba para el manejo de errores en takePicture
  it('debería manejar los errores al tomar una foto', async () => {
    // Simular un error en la captura de imagen
    spyOn(Camera, 'getPhoto').and.returnValue(Promise.reject('Error de cámara'));

    // Llamar al método takePicture y verificar que no se asigna la imagen
    await component.takePicture();

    // Verificar que newTask.image no se haya actualizado
    expect(component.newTask.image).toBe('');
  });

  afterEach(() => {
    fixture.detectChanges();
  });
});
