const express = require('express');
const router = express.Router();
const {
  obtenerJuegos,
  obtenerJuegoPorId,
  obtenerJuegosPorDesarrollador,
  obtenerJuegosPorTitulo,
  crearJuego,
  actualizarJuego,
  eliminarJuego
} = require('../controllers/juegosController');

router.get('/', obtenerJuegos); // Todos los juegos
router.get('/:id', obtenerJuegoPorId); // Por ID
router.get('/titulo/:nombre', obtenerJuegosPorTitulo); // Por título
router.get('/desarrollador/:nombre', obtenerJuegosPorDesarrollador); // Por desarrollador

router.post('/', crearJuego);
router.put('/:id', actualizarJuego);
router.delete('/:id', eliminarJuego);

module.exports = router;
