import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import HomeNavbar from './home/HomeNavbar';

export default function Layout() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch {
        setUser(null);
      }
    };
    loadUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <HomeNavbar user={user} />
      <Outlet context={{ user }} />
    </div>
  );
}