const Juego = require('../models/Juego');
const Resena = require('../models/Resena');

// Función para calcular el promedio de puntuaciones de un juego  
const calcularPromedioPuntuacion = async (juegoId) => {
  const resenas = await Resena.find({ juegoId });

  if (resenas.length === 0) return 0;

  const total = resenas.reduce((sum, r) => sum + r.puntuacion, 0);
  return parseFloat((total / resenas.length).toFixed(1));
};


// GET /api/juegos
const obtenerJuegos = async (req, res) => {
  try {
    const { genero, orden, page = 1, limit = 10 } = req.query;

    const filtro = genero ? { genero } : {};

    // Convertir page y limit a números
    const pagina = parseInt(page);
    const cantidad = parseInt(limit);

    // Obtener juegos filtrados y paginados
    const juegos = await Juego.find(filtro)
      .skip((pagina - 1) * cantidad)
      .limit(cantidad);

    // Calcular promedio de puntuación para cada juego
    const juegosConPromedio = await Promise.all(
      juegos.map(async (juego) => {
        const promedio = await calcularPromedioPuntuacion(juego._id);
        return { ...juego.toObject(), promedioPuntuacion: promedio };
      })
    );

    // Ordenar por mejor puntuación si se solicita
    if (orden === 'mejor') {
      juegosConPromedio.sort((a, b) => b.promedioPuntuacion - a.promedioPuntuacion);
    }

    res.json({
      success: true,
      data: juegosConPromedio,
      mensaje: 'Juegos obtenidos correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener juegos paginados',
      error: error.message
    });
  }
};

// GET /api/juegos/:id
const mongoose = require('mongoose');

const obtenerJuegoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const juego = await Juego.findById(id);

    if (!juego) {
      return res.status(404).json({
        success: false,
        mensaje: 'Juego no encontrado'
      });
    }

    const promedio = await calcularPromedioPuntuacion(id);

    res.json({
      success: true,
      data: { ...juego.toObject(), promedioPuntuacion: promedio },
      mensaje: 'Juego obtenido correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener el juego',
      error: error.message
    });
  }
};

// GET /api/juegos/desarrollador/:nombre
const obtenerJuegosPorDesarrollador = async (req, res) => {
  try {
    const { nombre } = req.params;
    const juegos = await Juego.find({ desarrollador: { $regex: new RegExp(nombre, 'i') } });

    if (juegos.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'No se encontraron juegos con ese desarrollador'
      });
    }

    res.json({
      success: true,
      data: juegos,
      mensaje: 'Juegos encontrados por desarrollador'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al buscar juegos por desarrollador',
      error: error.message
    });
  }
};

// GET /api/juegos/titulo/:nombre
const obtenerJuegosPorTitulo = async (req, res) => {
  try {
    const { nombre } = req.params;
    const juegos = await Juego.find({ titulo: { $regex: new RegExp(nombre, 'i') } });

    if (juegos.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'No se encontraron juegos con ese título'
      });
    }

    res.json({
      success: true,
      data: juegos,
      mensaje: 'Juegos encontrados por título'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al buscar juegos por título',
      error: error.message
    });
  }
};


// POST /api/juegos
const crearJuego = async (req, res) => {
  try {
    const {
      titulo,
      genero,
      plataforma,
      añoLanzamiento,
      desarrollador,
      imagenPortada,
      descripcion,
      completado
    } = req.body;

    // Validaciones básicas
    if (!titulo || !genero || !plataforma || !añoLanzamiento || !desarrollador) {
      return res.status(400).json({
        success: false,
        mensaje: 'Faltan campos obligatorios'
      });
    }

    if (typeof añoLanzamiento !== 'number' || añoLanzamiento < 1970 || añoLanzamiento > 2100) {
      return res.status(400).json({
        success: false,
        mensaje: 'Año de lanzamiento inválido'
      });
    }

    if (imagenPortada && !imagenPortada.startsWith('http')) {
      return res.status(400).json({
        success: false,
        mensaje: 'URL de imagen inválida'
      });
    }

    const nuevoJuego = new Juego({
      titulo,
      genero,
      plataforma,
      añoLanzamiento,
      desarrollador,
      imagenPortada,
      descripcion,
      completado
    });

    const juegoGuardado = await nuevoJuego.save();

    res.status(201).json({
      success: true,
      data: juegoGuardado,
      mensaje: 'Juego creado correctamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      mensaje: 'Error al crear el juego',
      error: error.message
    });
  }
};





// Lista de campos válidos para actualizar
const camposPermitidos = [
  'titulo',
  'genero',
  'plataforma',
  'añoLanzamiento',
  'desarrollador',
  'imagenPortada',
  'descripcion',
  'completado'
];

// PUT /api/juegos/:id
const actualizarJuego = async (req, res) => {
  try {
    const actualizaciones = {};

    for (const campo in req.body) {
      if (camposPermitidos.includes(campo)) {
        if (req.body[campo] !== '' && req.body[campo] !== null && req.body[campo] !== undefined) {
          actualizaciones[campo] = req.body[campo];
        }
      } else {
        return res.status(400).json({
          success: false,
          mensaje: `Campo no permitido: ${campo}`
        });
      }
    }

    if (Object.keys(actualizaciones).length === 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'No se proporcionaron campos válidos para actualizar'
      });
    }

    const juegoActualizado = await Juego.findByIdAndUpdate(req.params.id, actualizaciones, { new: true });

    if (!juegoActualizado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Juego no encontrado'
      });
    }

    res.json({
      success: true,
      data: juegoActualizado,
      mensaje: 'Juego actualizado correctamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      mensaje: 'Error al actualizar el juego',
      error: error.message
    });
  }
};



// DELETE /api/juegos/:id
const eliminarJuego = async (req, res) => {
  try {
    const { id } = req.params;
    const juegoEliminado = await Juego.findByIdAndDelete(id);

    if (!juegoEliminado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Juego no encontrado'
      });
    }

    res.json({
      success: true,
      data: juegoEliminado,
      mensaje: 'Juego eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar el juego',
      error: error.message
    });
  }
};

module.exports = {
  obtenerJuegos,
  obtenerJuegoPorId,
  obtenerJuegosPorDesarrollador,
  obtenerJuegosPorTitulo,
  crearJuego,
  actualizarJuego,
  eliminarJuego,
};
