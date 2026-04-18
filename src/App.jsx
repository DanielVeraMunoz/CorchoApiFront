import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NoteDetail from './pages/NoteDetail';
import CreateNote from './pages/CreateNote';
import UserProfile from './pages/UserProfile';
import Community from './pages/Community';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Login />} />
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/notes/new"   element={<CreateNote />} />
        <Route path="/notes/:id"   element={<NoteDetail />} />
        <Route path="/users/:id"   element={<UserProfile />} />
        <Route path="/community"   element={<Community />} />
        <Route path="*"            element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
