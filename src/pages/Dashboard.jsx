import { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CategoryScrollableRow from '../components/CategoryScrollableRow';
import NoteCard from '../components/NoteCard';
import MenuBar from '../components/MenuBar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const MOCK_CATEGORIES = [
  { id: 1, name: 'Avisos oficiales' },
  { id: 2, name: 'Eventos' },
  { id: 3, name: 'Favores' },
  { id: 4, name: 'Mercadillo' },
  { id: 5, name: 'Mantenimiento' },
  { id: 6, name: 'Mascotas' },
];

const MOCK_NOTES = [
  {
    id: 1,
    title: 'Corte de agua el jueves',
    description: 'El jueves 17 habrá corte de agua de 9:00 a 14:00 por obras en la red principal.',
    is_completed: false,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    user: { name: 'Ana García' },
    category: { name: 'Avisos oficiales' },
    comments_count: 4,
  },
  {
    id: 2,
    title: 'Fiesta de vecinos en el patio',
    description: 'Este sábado organizamos una barbacoa en el patio. ¡Todos estáis invitados! Traed algo para compartir.',
    is_completed: false,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    user: { name: 'Carlos M.' },
    category: { name: 'Eventos' },
    comments_count: 7,
  },
  {
    id: 3,
    title: 'Se vende bicicleta',
    description: 'Vendo bici de montaña en buen estado. 150€. Interesados contactar por el portal.',
    is_completed: true,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    user: { name: 'Laura P.' },
    category: { name: 'Mercadillo' },
    comments_count: 2,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {

    console.log('token:', token);

    api.get('/notes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setNotes(res.data.data);
      })
      .catch((err) => {
        console.error('Error fetching notes:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    api.get('/categories', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []
  );

  const goToNote = (id) => {
    setExiting(true);
    setTimeout(() => navigate(`/notes/${id}`), 260);
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === null || note.category.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div style={{
        backgroundColor: 'var(--color-bg)', minHeight: '100svh', paddingBottom: '100px',
        opacity: exiting ? 0 : (visible ? 1 : 0),
        transform: exiting ? 'translateX(-24px)' : 'translateX(0)',
        transition: exiting
          ? 'opacity 0.25s ease, transform 0.25s ease'
          : 'opacity 0.3s ease',
      }}>

        {/* Header */}
        <div style={{
          backgroundColor: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
          padding: '48px 18px 16px 18px',
          textAlign: 'center',
          marginBottom: '20px',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '42px',
            fontWeight: '400',
            color: 'var(--color-accent)',
            letterSpacing: '2px',
            lineHeight: 1,
          }}>
            CORCHO
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px', fontWeight: '500' }}>
            tablón de tu comunidad
          </p>
        </div>

        <SearchBar value={search} onChange={setSearch} />

        <div style={{ padding: '0 18px', marginBottom: '8px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Categorías
          </p>
        </div>

        <CategoryScrollableRow
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <div style={{ padding: '0 24px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            Últimas notas · {filteredNotes.length}
          </p>

          {filteredNotes.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '40px' }}>
              No hay notas que coincidan
            </p>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} onClick={() => goToNote(note.id)} />
            ))
          )}
        </div>

      </div>

      <MenuBar active="home" />
    </>
  );
}
