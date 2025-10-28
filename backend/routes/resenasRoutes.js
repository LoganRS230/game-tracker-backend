const express = require('express');
const router = express.Router();
const {
  obtenerResenas,
  obtenerResenaPorId,
  crearResena,
  actualizarResena,
  eliminarResena,
} = require('../controllers/resenasController');

router.get('/', obtenerResenas);
router.get('/:id', obtenerResenaPorId);
router.post('/', crearResena);
router.put('/:id', actualizarResena);
router.delete('/:id', eliminarResena);

module.exports = router;
