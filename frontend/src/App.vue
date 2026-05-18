<script setup>
import { ref, onMounted } from 'vue'

// 1. VARIABLES DE ESTADO
const usuarios = ref([])

// Variables para manejar el formulario
const formulario = ref({
  nombre: '',
  apellido: '',
  correo: '',
  contrasena: '',
  telefono: '',
})
const editando = ref(false) // Para saber si el botón dice "Guardar" o "Actualizar"
const idActual = ref(null) // Guarda el ID del usuario que estamos editando

// 2. FUNCIONES CRUD

// GET (Leer)
const cargarUsuarios = async () => {
  const response = await fetch('https://api-practicavue.onrender.com/users')
  usuarios.value = await response.json()
}

// POST y PUT (Crear y Actualizar)
const guardarUsuario = async () => {
  if (editando.value) {
    // Si estamos editando, hacemos un PUT a la ruta con el ID
    await fetch(`https://api-practicavue.onrender.com/users/${idActual.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formulario.value),
    })
  } else {
    // Si es nuevo, hacemos un POST
    await fetch('https://api-practicavue.onrender.com/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formulario.value),
    })
  }

  // Limpiamos los cuadros de texto y recargamos la tabla
  limpiarFormulario()
  cargarUsuarios()
}

// DELETE (Eliminar)
const eliminarUsuario = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    await fetch(`https://api-practicavue.onrender.com/users/${id}`, {
      method: 'DELETE',
    })
    cargarUsuarios()
  }
}

// 3. FUNCIONES AUXILIARES PARA EL FORMULARIO
const prepararEdicion = (user) => {
  formulario.value = {
    nombre: user.nombre,
    apellido: user.apellido,
    correo: user.correo,
    contrasena: user.contrasena || '', // La contraseña puede no venir del GET por seguridad
    telefono: user.telefono,
  }
  idActual.value = user.idusuarios
  editando.value = true
}

const limpiarFormulario = () => {
  formulario.value = { nombre: '', apellido: '', correo: '', contrasena: '', telefono: '' }
  idActual.value = null
  editando.value = false
}

// Ejecutamos la carga inicial cuando la pantalla se dibuja
onMounted(() => {
  cargarUsuarios()
})
</script>

<template>
  <main class="contenedor-principal">
    <h2>Gestion de Usuarios</h2>

    <div class="formulario-contenedor">
      <form @submit.prevent="guardarUsuario" class="formulario">
        <input type="text" v-model="formulario.nombre" placeholder="Nombre" required />
        <input type="text" v-model="formulario.apellido" placeholder="Apellido" required />
        <input type="email" v-model="formulario.correo" placeholder="Correo Electrónico" required />
        <input type="password" v-model="formulario.contrasena" placeholder="Contraseña" required />
        <input type="text" v-model="formulario.telefono" placeholder="Teléfono" required />

        <div class="botones">
          <button type="submit" class="btn-guardar">
            {{ editando ? 'Actualizar Usuario' : 'Guardar Nuevo' }}
          </button>
          <button type="button" v-if="editando" @click="limpiarFormulario" class="btn-cancelar">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <div class="tabla-contenedor">
      <table class="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo Electronico</th>
            <th>Telefono</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in usuarios" :key="user.idusuarios">
            <td class="columna-id">{{ user.idusuarios }}</td>
            <td>{{ user.nombre }}</td>
            <td>{{ user.apellido }}</td>
            <td>{{ user.correo }}</td>
            <td>{{ user.telefono }}</td>
            <td>
              <button @click="prepararEdicion(user)" class="btn-editar">Editar</button>
              <button @click="eliminarUsuario(user.idusuarios)" class="btn-eliminar">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped src="./assets/tabla.css"></style>
