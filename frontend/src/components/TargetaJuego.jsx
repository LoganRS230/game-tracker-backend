import { useEffect, useState } from 'react';
import { getResenasPorJuego } from '../services/api';
import ToogleCompletado from './ToggleCompletado';
import ModalResena from './ModalResena';
import '../styles/TargetaJuego.css';

export default function TargetaJuego({ juego, usuario }) {
  const [resenas, setResenas] = useState([]);

  useEffect(() => {
    getResenasPorJuego(juego._id)
      .then(res => setResenas(res.data))
      .catch(err => console.error(err.message));
  }, [juego._id]);

  return (
    <div className="targeta-juego">
      <div className="id-overlay">ID: {juego._id}</div>
      <img src={juego.imagenPortada} alt={juego.titulo} />
      <h3>{juego.titulo}</h3>
      <p>{juego.genero} | {juego.plataforma}</p>
      <p>Desarrollador: {juego.desarrollador}</p>
      <p>⭐ {juego.promedioPuntuacion}</p>
      <ToogleCompletado juego={juego} />
      <ModalResena juegoId={juego._id} usuario={usuario} onResenaCreada={() => {}} />
      <div className="resenas">
        {resenas.map(r => (
          <div key={r._id} className="resena">
            <strong>{r.usuario}</strong>: {r.comentario} ({r.puntuacion}/5)
          </div>
        ))}
      </div>
    </div>
  );
}
