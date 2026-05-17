import { Router } from 'express';

import {getAllUsers, getUserByCorreo, getBuscarNombre,postCrearUsuario,actualizarUsuario,eliminarUsuario } from '../services/usersServices.js';

const router = Router();

router.get('/', getAllUsers);

router.get('/buscarPorCorreo/:correo', getUserByCorreo);

router.get('/buscarPorNombre/:nombre', async (req, res) => {
    const { nombre } = req.params;
    try {
        const allUsersByName = await getBuscarNombre(nombre);
        res.json(allUsersByName);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nombre, apellido, correo, contrasena, telefono } = req.body;

        const newUser = await postCrearUsuario(nombre, apellido, correo, contrasena, telefono);

        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:idusuarios', async (req, res) => {

    try {

        const { nombre, apellido, correo, contrasena, telefono } = req.body;

        const { idusuarios } = req.params;

        const usuario = [
            nombre,
            apellido,
            correo,
            contrasena,
            telefono,
            idusuarios
        ];

        const updatedUser = await actualizarUsuario(usuario);

        if (!updatedUser) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json(updatedUser);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
});

router.delete('/:idusuarios', async (req, res) => {

    try {
        const { idusuarios } = req.params;
        const result = await eliminarUsuario(idusuarios);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;