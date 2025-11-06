import { actualizarJuego } from '../services/api';
import '../styles/ToggleCompletado.css';

export default function ToogleCompletado({ juego }) {
  const cambiarEstado = async () => {
    try {
      await actualizarJuego(juego._id, { completado: !juego.completado });
      window.location.reload(); // O actualiza el estado si usas hooks
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <button onClick={cambiarEstado}>
      {juego.completado ? '✅ Completado' : '⏳ Sin completar'}
    </button>
  );
}
