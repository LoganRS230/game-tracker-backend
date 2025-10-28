const Juego = require('../models/Juego');

// GET /api/juegos
const obtenerJuegos = async (req, res) => {
  try {
    const juegos = await Juego.find();
    res.json(juegos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los juegos' });
  }
};

// GET /api/juegos/:id
const obtenerJuegoPorId = async (req, res) => {
  try {
    const juego = await Juego.findById(req.params.id);
    if (!juego) return res.status(404).json({ mensaje: 'Juego no encontrado' });
    res.json(juego);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el juego' });
  }
};

//buscar juegos por título
const obtenerJuegosPorTitulo = async (req, res) => {
  try {
    const { nombre } = req.params;
    const juegos = await Juego.find({ titulo: { $regex: new RegExp(nombre, 'i') } });

    if (juegos.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron juegos con ese título' });
    }

    res.json(juegos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar juegos por título', error: error.message });
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
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    if (typeof añoLanzamiento !== 'number' || añoLanzamiento < 1970 || añoLanzamiento > 2100) {
      return res.status(400).json({ mensaje: 'Año de lanzamiento inválido' });
    }

    if (imagenPortada && !imagenPortada.startsWith('http')) {
      return res.status(400).json({ mensaje: 'URL de imagen inválida' });
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
    res.status(201).json(juegoGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el juego', error: error.message });
  }
};


// PUT /api/juegos/:id

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

const actualizarJuego = async (req, res) => {
  try {
    const actualizaciones = {};

    // Validar campos permitidos
    for (const campo in req.body) {
      if (camposPermitidos.includes(campo)) {
        if (req.body[campo] !== '' && req.body[campo] !== null && req.body[campo] !== undefined) {
          actualizaciones[campo] = req.body[campo];
        }
      } else {
        return res.status(400).json({ mensaje: `Campo no permitido: ${campo}` });
      }
    }

    if (Object.keys(actualizaciones).length === 0) {
      return res.status(400).json({ mensaje: 'No se proporcionaron campos válidos para actualizar' });
    }

    const juegoActualizado = await Juego.findByIdAndUpdate(req.params.id, actualizaciones, { new: true });

    if (!juegoActualizado) {
      return res.status(404).json({ mensaje: 'Juego no encontrado' });
    }

    res.json(juegoActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el juego', error: error.message });
  }
};


// DELETE /api/juegos/:id
const eliminarJuego = async (req, res) => {
  try {
    const { id } = req.params;
    const juegoEliminado = await Juego.findByIdAndDelete(id);

    if (!juegoEliminado) {
      return res.status(404).json({ mensaje: 'Juego no encontrado' });
    }

    res.json({ mensaje: 'Juego eliminado correctamente', juego: juegoEliminado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el juego', error: error.message });
  }
};


module.exports = {
  obtenerJuegos,
  obtenerJuegoPorId,
  obtenerJuegosPorTitulo,
  crearJuego,
  actualizarJuego,
  eliminarJuego,
};
