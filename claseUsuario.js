// Clase base: Registro
import express from "express";
import mysql from "mysql2/promise";

const app = express();
app.use(express.json()); // para procesar JSON en requests

class Usuario {
  #contrasenia;

  constructor(usuario, contrasenia) {
    this.usuario = usuario;
    this.#contrasenia = contrasenia;
  }

  getUsuario() {return this.usuario; }
  getContrasenia() {return this.#contrasenia; }
  setUsuario(usuario) { this.usuario = usuario; }
  setContrasenia(contrasenia) { this.#contrasenia = contrasenia; }

  mostrarInfo() {
    return `Usuario: ${this.usuario}, Contrasenia: ${this.#contrasenia}`;
  }

  // 🔍 Método para verificar si USUARIO existe en BDD
  async verificarEnBD() {
    // 1️⃣ Conexión a la base de datos
    const conexion = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "JackElDestripador",
      database: "pedidosjack"
    });

    try {
      // 2️⃣ Verificar si el USUARIO existe
      const [rowsNombre] = await conexion.execute(
        "SELECT COUNT(*) AS total FROM usuarios WHERE nombre = ?",
        [this.usuario]
      );

      // 3️⃣ Verificar si el email existe
      const [rowsEmail] = await conexion.execute(
        "SELECT COUNT(*) AS total FROM usuarios WHERE email = ?",
        [this.#contrasenia]
      );

      // 4️⃣ Respuestas personalizadas
      if (rowsNombre[0].total > 0) {
        console.log("⚠️  Existe nombre usuario");
      }

      if (rowsEmail[0].total > 0) {
        console.log("⚠️  Este mail ya está registrado");
      }

      if (rowsNombre[0].total === 0 && rowsEmail[0].total === 0) {
        console.log("✅ Usuario válido. No existe en la base de datos.");
      }

    } catch (error) {
      console.error("Error al verificar en la base de datos:", error.message);
    } finally {
      await conexion.end(); // cerrar conexión
    }
  }
}
/*
// Clase derivada: Usuario
class Usuario extends SignUp {
  // Atributo privado adicional
  #id;
  #contrasenia;

  constructor(id, nombre, email, contrasenia) {
    // Llamamos al constructor de la clase padre (Registro)
    super(nombre, email);
    this.#id = id;
    this.#contrasenia = contrasenia;
  }

  getId() {
    return this.#id;
  }

  // Sobrescribimos el método mostrarInfo para incluir el ID
  mostrarInfo() {
    return `ID: ${this.#id}, ${super.mostrarInfo()}`;
  }
}
*/
// Ejemplo de uso

//console.log(usuario1.mostrarInfo()); // ID: 1, Nombre: Carlos Pérez, Email: carlos@example.com

const port = 3306;
app.listen(port, ()=> console.log('Servidor corriendo en http://localhost:3306'));