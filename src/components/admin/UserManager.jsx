import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Check, Mail } from 'lucide-react';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [grantingAccess, setGrantingAccess] = useState({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await base44.entities.User.list('-created_date', 1000);
      setUsers(allUsers);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      await base44.users.inviteUser(inviteEmail.trim(), 'user');
      setInviteEmail('');
      await loadUsers();
    } catch (err) {
      console.error('Error inviting user:', err);
    } finally {
      setInviting(false);
    }
  };

  const handleGrantAccess = async (userId) => {
    setGrantingAccess(prev => ({ ...prev, [userId]: true }));
    try {
      const userEmail = users.find(u => u.id === userId)?.email;
      await base44.functions.invoke('grantUserAccess', { userEmail });
      await loadUsers();
    } catch (err) {
      console.error('Error granting access:', err);
    } finally {
      setGrantingAccess(prev => ({ ...prev, [userId]: false }));
    }
  };

  const hasPurchased = (userEmail) => {
    return users.some(u => u.email === userEmail && u.purchases?.length > 0);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Invite Section */}
      <div className="p-4 rounded-lg border border-white/[0.06] bg-white/[0.02]">
        <h3 className="font-semibold mb-4 text-sm">Invite New User</h3>
        <div className="flex gap-3">
          <Input
            type="email"
            placeholder="user@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleInviteUser()}
            className="bg-card border-border/30"
          />
          <Button
            onClick={handleInviteUser}
            disabled={inviting || !inviteEmail.trim()}
            className="bg-[#3B82F6] text-white hover:bg-[#2563EB]"
          >
            <Mail className="w-4 h-4 mr-2" /> Invite
          </Button>
        </div>
      </div>

      {/* Users List */}
      <div className="border border-white/[0.06] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.02] border-b border-white/[0.06]">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-center font-semibold">Access</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const hasAccess = hasPurchased(user.email);
                return (
                  <tr key={user.id} className="border-b border-white/[0.06] hover:bg-white/[0.02] transition">
                    <td className="px-6 py-3 text-[#E4E4E7]">{user.email}</td>
                    <td className="px-6 py-3 text-[#A1A1AA]">{user.full_name || '—'}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${hasAccess ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {hasAccess ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      {!hasAccess && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGrantAccess(user.id)}
                          disabled={grantingAccess[user.id]}
                          className="border-white/[0.1] text-[#3B82F6] hover:bg-[#3B82F6]/10"
                        >
                          {grantingAccess[user.id] ? '...' : <><Check className="w-3.5 h-3.5 mr-1" /> Grant Access</>}
                        </Button>
                      )}
                      {hasAccess && (
                        <span className="text-[#3B82F6] text-xs font-semibold flex items-center justify-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Granted
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 text-[#A1A1AA]">
          No users yet.
        </div>
      )}
    </div>
  );
}