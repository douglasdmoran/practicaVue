import {pool} from '../db.js';

export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Usuarios');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getUserByCorreo = async (req,res) => {
    const { correo } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Usuarios WHERE correo = $1', [correo]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getBuscarNombre = async (nombre) => {
    const buscar = `%${nombre}%`
    const result = await pool.query(
        "SELECT * FROM Usuarios WHERE nombre like $1",[buscar]
    );
    return result.rows;
};

export const postCrearUsuario = async (nombre, apellido,correo,contrasena,telefono) => {
    try {
        const query = 'INSERT INTO Usuarios (nombre, apellido, correo, contrasena, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const result = await pool.query(query, [nombre, apellido, correo, contrasena, telefono]);

        return result.rows[0];
    } catch (err) {
        throw err;
    }
};

export const actualizarUsuario = async (usuario) => {

    const query = `
        UPDATE Usuarios
        SET nombre = $1,
            apellido = $2,
            correo = $3,
            contrasena = $4,
            telefono = $5
        WHERE IdUsuarios = $6
        RETURNING *
    `;

    try {

        const result = await pool.query(query, usuario);

        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];

    } catch (err) {
        throw new Error(err.message);
    }
};

export const eliminarUsuario = async (idusuarios) => {
    try {
        const usuarioAEliminar = await pool.query('SELECT * FROM Usuarios WHERE IdUsuarios = $1', [idusuarios]);

        if (usuarioAEliminar.rowCount === 0) throw new Error('Usuario no encontrado');

        const  result = await pool.query('DELETE FROM Usuarios WHERE IdUsuarios = $1 RETURNING *', [idusuarios]);

        return { message: 'Usuario eliminado exitosamente', usuario: result.rows[0] };
    } catch (err) {
        throw new Error(err.message);
    }
};