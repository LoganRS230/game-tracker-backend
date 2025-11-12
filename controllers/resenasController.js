const Resena = require('../models/Resena');

const crearResena = async (req, res) => {
  try {
    const { juegoId, usuario, comentario, puntuacion } = req.body;

    if (!juegoId || !usuario || !comentario || !puntuacion) {
      return res.status(400).json({
        success: false,
        mensaje: 'Faltan campos obligatorios'
      });
    }

    if (puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({
        success: false,
        mensaje: 'La puntuación debe estar entre 1 y 5'
      });
    }

    const nuevaResena = new Resena({ juegoId, usuario, comentario, puntuacion });
    const resenaGuardada = await nuevaResena.save();

    res.status(201).json({
      success: true,
      data: resenaGuardada,
      mensaje: 'Reseña creada correctamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      mensaje: 'Error al crear la reseña',
      error: error.message
    });
  }
};


const obtenerTodasResenas = async (req, res) => {
  try {
    const resenas = await Resena.find().sort({ fecha: -1 });

    res.json({
      success: true,
      data: resenas,
      mensaje: 'Todas las reseñas obtenidas correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener reseñas',
      error: error.message
    });
  }
};


const obtenerResenasPorJuego = async (req, res) => {
  try {
    const { juegoId } = req.params;
    const resenas = await Resena.find({ juegoId });

    res.json({
      success: true,
      data: resenas,
      mensaje: 'Reseñas obtenidas correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener reseñas',
      error: error.message
    });
  }
};


const actualizarResena = async (req, res) => {
  try {
    const { id } = req.params;
    const { comentario, puntuacion } = req.body;

    if (!comentario || !puntuacion) {
      return res.status(400).json({
        success: false,
        mensaje: 'Faltan campos obligatorios'
      });
    }

    if (puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({
        success: false,
        mensaje: 'La puntuación debe estar entre 1 y 5'
      });
    }

    const resenaActualizada = await Resena.findByIdAndUpdate(
      id,
      { comentario, puntuacion },
      { new: true, runValidators: true }
    );

    if (!resenaActualizada) {
      return res.status(404).json({
        success: false,
        mensaje: 'Reseña no encontrada'
      });
    }

    res.json({
      success: true,
      data: resenaActualizada,
      mensaje: 'Reseña actualizada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar la reseña',
      error: error.message
    });
  }
};


const eliminarResena = async (req, res) => {
  try {
    const { id } = req.params;
    const resenaEliminada = await Resena.findByIdAndDelete(id);

    if (!resenaEliminada) {
      return res.status(404).json({
        success: false,
        mensaje: 'Reseña no encontrada'
      });
    }

    res.json({
      success: true,
      data: resenaEliminada,
      mensaje: 'Reseña eliminada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar la reseña',
      error: error.message
    });
  }
};

module.exports = {
  crearResena,
  obtenerTodasResenas,
  obtenerResenasPorJuego,
  actualizarResena,
  eliminarResena
};
