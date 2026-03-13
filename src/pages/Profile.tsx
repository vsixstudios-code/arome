import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, ShieldCheck } from 'lucide-react';
import ThemePicker from '../components/ThemePicker';

export default function Profile() {
  const { user, login, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleLogin = () => {
    if (!username.trim() || !firstName.trim()) return;
    login({
      username: username.trim(),
      firstName: firstName.trim(),
      age: age.trim(),
      gender: gender
    });
  };

  if (!user) {
    return (
      <div className="p-6 max-w-2xl mx-auto flex flex-col items-center justify-center h-full min-h-[75vh]">
        <div
          className="p-10 rounded-[2.5rem] w-full max-w-md"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid color-mix(in srgb, var(--color-border) 30%, transparent)',
            boxShadow: '0 10px 40px color-mix(in srgb, var(--color-text-primary) 6%, transparent)',
          }}
        >
          <div className="flex justify-center mb-8">
            <div
              className="p-5 rounded-full shadow-inner"
              style={{ backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-accent)' }}
            >
              <ShieldCheck size={36} strokeWidth={1.5} />
            </div>
          </div>
          <h1
            className="text-3xl font-serif font-medium text-center mb-3 tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Welcome to Arome
          </h1>
          <p
            className="text-center mb-10 text-sm leading-relaxed font-medium"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Sign in to curate your personal fragrance wardrobe and unlock tailored AI recommendations.
          </p>

          <div className="space-y-6">
            <div>
              <label className="section-label block mb-2 ml-1">Username *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-base w-full px-5 py-4 text-sm"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="section-label block mb-2 ml-1">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input-base w-full px-5 py-4 text-sm"
                placeholder="What should we call you?"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="section-label block mb-2 ml-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="input-base w-full px-5 py-4 text-sm"
                  placeholder="e.g. 25"
                />
              </div>
              <div>
                <label className="section-label block mb-2 ml-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="input-base w-full px-5 py-4 text-sm appearance-none"
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleLogin}
              disabled={!username.trim() || !firstName.trim()}
              className="w-full btn-primary rounded-2xl py-4 font-semibold mt-4 tracking-wide"
            >
              Sign In / Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="mb-10 mt-4">
        <h1
          className="text-3xl font-serif font-medium tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Profile
        </h1>
        <p className="text-sm font-medium mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Manage your olfactory identity
        </p>
      </header>

      {/* User card */}
      <div
        className="p-8 rounded-[2rem] flex items-center justify-between mb-8"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid color-mix(in srgb, var(--color-border) 30%, transparent)',
          boxShadow: '0 4px 20px color-mix(in srgb, var(--color-text-primary) 5%, transparent)',
        }}
      >
        <div className="flex items-center gap-5">
          <div
            className="p-5 rounded-full shadow-inner"
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-accent)',
              border: '1px solid color-mix(in srgb, var(--color-border) 10%, transparent)',
            }}
          >
            <User size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h2
              className="text-2xl font-serif font-medium leading-tight"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {user.firstName}
            </h2>
            <p className="section-label mt-1.5">
              @{user.username}{user.age ? ` • ${user.age} y/o` : ''}{user.gender ? ` • ${user.gender}` : ''}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="p-3.5 rounded-2xl shadow-sm active:scale-90 transition-all"
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            color: 'var(--color-text-secondary)',
          }}
          aria-label="Log out"
        >
          <LogOut size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Theme Picker */}
      <div
        className="rounded-[2rem] p-8 mb-8"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid color-mix(in srgb, var(--color-border) 30%, transparent)',
        }}
      >
        <ThemePicker />
      </div>

      {/* About section */}
      <div
        className="rounded-[2rem] p-8 relative overflow-hidden"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-bg-surface) 40%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-border) 10%, transparent)',
        }}
      >
        <h3
          className="font-serif text-xl mb-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          About Arome Profiles
        </h3>
        <p className="text-sm leading-relaxed font-medium italic" style={{ color: 'var(--color-text-secondary)' }}>
          Your profile allows you to maintain a personalized catalog of your fragrances.
          Our AI uses this catalog, along with local weather conditions and your travel destinations,
          to provide highly contextual recommendations that resonate with your unique style.
        </p>
      </div>
    </div>
  );
}
