const express = require('express');
const router = express.Router();
const {
  crearResena,
  obtenerResenasPorJuego,
  eliminarResena
} = require('../controllers/resenasController');

// Rutas para reseñas
router.post('/', crearResena);
router.get('/juego/:juegoId', obtenerResenasPorJuego);
router.delete('/:id', eliminarResena);

module.exports = router;
