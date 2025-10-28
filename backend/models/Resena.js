const mongoose = require('mongoose');

const resenaSchema = new mongoose.Schema({
  juegoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Juego', required: true },
  usuario: { type: String, required: true },
  comentario: { type: String, required: true },
  puntuacion: { type: Number, min: 1, max: 5, required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resena', resenaSchema);
