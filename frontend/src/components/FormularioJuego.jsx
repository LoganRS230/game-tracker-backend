import { useState } from 'react';
import { crearJuego } from '../services/api';
import '../styles/FormularioJuego.css';

export default function FormularioJuego({ onJuegoCreado }) {
  const [form, setForm] = useState({
    titulo: '',
    genero: '',
    plataforma: '',
    añoLanzamiento: '',
    desarrollador: '',
    imagenPortada: '',
    descripcion: '',
    completado: false
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await crearJuego({ ...form, añoLanzamiento: Number(form.añoLanzamiento) });
      onJuegoCreado(res.data);
      setForm({ ...form, titulo: '', descripcion: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form className="formulario-juego" onSubmit={handleSubmit}>
      <input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título" required />
      <input name="genero" value={form.genero} onChange={handleChange} placeholder="Género" required />
      <input name="plataforma" value={form.plataforma} onChange={handleChange} placeholder="Plataforma" required />
      <input name="añoLanzamiento" value={form.añoLanzamiento} onChange={handleChange} placeholder="Año" required />
      <input name="desarrollador" value={form.desarrollador} onChange={handleChange} placeholder="Desarrollador" required />
      <input name="imagenPortada" value={form.imagenPortada} onChange={handleChange} placeholder="URL portada" />
      <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" />
      <label>
        <input type="checkbox" name="completado" checked={form.completado} onChange={handleChange} />
        Completado
      </label>
      <button type="submit">Agregar juego</button>
    </form>
  );
}
