<script setup>
import { ref, onMounted } from 'vue'

const usuarios = ref([])

onMounted(async () => {
  const response = await fetch('http://localhost:3000/users')

  usuarios.value = await response.json()
})
</script>

<template>
  <main class="contenedor-principal">
    <h2>Gestion de Usuarios</h2>

    <div class="tabla-contenedor">
      <table class="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo Electronico</th>
            <th>Telefono</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in usuarios" :key="user.idusuarios">
            <td class="columna-id">{{ user.idusuarios }}</td>
            <td>{{ user.nombre }}</td>
            <td>{{ user.apellido }}</td>
            <td>{{ user.correo }}</td>
            <td>{{ user.telefono }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped src="./assets/tabla.css"></style>
