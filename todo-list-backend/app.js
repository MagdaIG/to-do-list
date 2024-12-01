const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Configuración de Express
app.use(bodyParser.json());
app.use(cors()); // Habilitar CORS

// Configuración de SQLite
const db = new sqlite3.Database('basededatos.sql');

// Crear tabla de tareas
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT,
      latitude REAL,
      longitude REAL
    )
  `);
});

// Endpoint para obtener todas las tareas
app.get('/todos', (req, res) => {
  db.all('SELECT * FROM todos', [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener las tareas' });
    } else {
      res.json(rows);
    }
  });
});

// Endpoint para reemplazar todas las tareas
app.put('/todos', (req, res) => {
  const todos = req.body;

  if (!Array.isArray(todos)) {
    return res.status(400).json({ error: 'El cuerpo de la solicitud debe ser un arreglo' });
  }

  db.serialize(() => {
    // Eliminar todas las tareas existentes
    db.run('DELETE FROM todos', [], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al eliminar las tareas' });
      }

      // Insertar las nuevas tareas
      const stmt = db.prepare(`
        INSERT INTO todos (id, title, description, image, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const todo of todos) {
        stmt.run(
            todo.id,
            todo.title,
            todo.description,
            todo.image,
            todo.latitude,
            todo.longitude,
            (err) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al insertar una tarea' });
              }
            }
        );
      }

      stmt.finalize(() => {
        res.status(200).json({ message: 'Tareas reemplazadas exitosamente' });
      });
    });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
