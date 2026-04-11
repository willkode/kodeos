import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import HomeNavbar from './home/HomeNavbar';

export default function Layout() {
  const [user, setUser] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        if (currentUser) {
          if (currentUser.role === 'admin') {
            setHasPurchased(true);
          } else {
            const purchases = await base44.entities.Purchase.filter({
              userEmail: currentUser.email,
              status: 'completed'
            });
            setHasPurchased(purchases.length > 0);
          }
        }
      } catch {
        setUser(null);
      }
    };
    loadUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <HomeNavbar user={user} hasPurchased={hasPurchased} />
      <Outlet context={{ user, hasPurchased }} />
    </div>
  );
}