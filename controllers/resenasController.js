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
  obtenerResenasPorJuego,
  eliminarResena
};
