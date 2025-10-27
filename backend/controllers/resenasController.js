const Resena = require('../models/Resena');

// Obtener todas las reseñas
const obtenerResenas = async (req, res) => {
  try {
    const resenas = await Resena.find();
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las reseñas' });
  }
};

// Obtener una reseña por ID
const obtenerResenaPorId = async (req, res) => {
  try {
    const resena = await Resena.findById(req.params.id);
    if (!resena) {
      return res.status(404).json({ mensaje: 'Reseña no encontrada' });
    }
    res.json(resena);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la reseña' });
  }
};

// Crear una nueva reseña
const crearResena = async (req, res) => {
  try {
    const resena = new Resena(req.body);
    await resena.save();
    res.status(201).json(resena);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la reseña' });
  }
};

// Actualizar una reseña
const actualizarResena = async (req, res) => {
  try {
    const resena = await Resena.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!resena) {
      return res.status(404).json({ mensaje: 'Reseña no encontrada' });
    }
    res.json(resena);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la reseña' });
  }
};

// Eliminar una reseña
const eliminarResena = async (req, res) => {
  try {
    const resena = await Resena.findByIdAndDelete(req.params.id);
    if (!resena) {
      return res.status(404).json({ mensaje: 'Reseña no encontrada' });
    }
    res.json({ mensaje: 'Reseña eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la reseña' });
  }
};

module.exports = {
  obtenerResenas,
  obtenerResenaPorId,
  crearResena,
  actualizarResena,
  eliminarResena,
};
