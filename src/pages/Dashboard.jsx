import { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CategoryScrollableRow from '../components/CategoryScrollableRow';
import NoteCard from '../components/NoteCard';
import MenuBar from '../components/MenuBar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';


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
    if (!loading) {
      const t = setTimeout(() => setVisible(true), 30);
      return () => clearTimeout(t);
    }
  }, [loading]);

  useEffect(() => {
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

  if (loading) return <LoadingScreen />;

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
            filteredNotes.map((note, index) => (
              <div
                key={note.id}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.35s ease ${index * 0.08}s, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s`,
                }}
              >
                <NoteCard note={note} onClick={() => goToNote(note.id)} />
              </div>
            ))
          )}
        </div>

      </div>

      <MenuBar active="home" />
    </>
  );
}
