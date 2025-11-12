const express = require('express');
const router = express.Router();
const {
  crearResena,
  obtenerTodasResenas,
  obtenerResenasPorJuego,
  actualizarResena,
  eliminarResena
} = require('../controllers/resenasController');

// Rutas para reseñas - IMPORTANTE: rutas específicas primero, genéricas después
router.post('/', crearResena);
router.get('/juego/:juegoId', obtenerResenasPorJuego);  // Específica PRIMERO
router.get('/', obtenerTodasResenas);                    // Genérica DESPUÉS
router.put('/:id', actualizarResena);
router.delete('/:id', eliminarResena);

module.exports = router;
