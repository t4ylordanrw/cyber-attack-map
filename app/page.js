'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../components/Map'), { ssr: false });

const categories = {
  Financial: { color: '#ef4444', label: 'Financial' },
  'Private Organisation': { color: '#3b82f6', label: 'Private Organisation' },
  'Critical Infrastructure': { color: '#f97316', label: 'Critical Infrastructure' },
  Healthcare: { color: '#10b981', label: 'Healthcare' },
  'Government / Public Sector': { color: '#a855f7', label: 'Government / Public Sector' },
  'Technology / Supply Chain': { color: '#06b6d4', label: 'Technology / Supply Chain' },
};

export default function Home() {
  const [attacks, setAttacks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdated] = useState(new Date().toLocaleDateString());

  useEffect(() => {
    fetch('/attacks.json')
      .then(res => res.json())
      .then(data => {
        setAttacks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load attacks:', err);
        setLoading(false);
      });
  }, []);

  const filteredAttacks = useMemo(() => {
    return attacks.filter(a => {
      if (selectedCategory !== 'All' && a.category !== selectedCategory) return false;

      const q = search.toLowerCase();
      if (q && !(
        a.title.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      )) return false;

      if (dateFrom && a.date < dateFrom) return false;
      if (dateTo && a.date > dateTo) return false;

      return true;
    });
  }, [attacks, selectedCategory, search, dateFrom, dateTo]);

  const sorted = [...filteredAttacks].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 border-b border-gray-700 space-y-3">
        <div>
          <h1 className="text-2xl font-bold">Global Cyber Attack Map</h1>
          <p className="text-sm text-gray-400">
            Latest reported incidents • Last data update: {lastUpdated} • {attacks.length} total incidents
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Search title, location, description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-1.5 rounded bg-gray-700 border border-gray-600 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="px-2 py-1.5 rounded bg-gray-700 border border-gray-600 text-sm"
          />
          <span className="text-gray-400 text-sm">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="px-2 py-1.5 rounded bg-gray-700 border border-gray-600 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1 rounded text-sm ${selectedCategory === 'All' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            All
          </button>
          {Object.entries(categories).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${selectedCategory === key ? 'ring-2 ring-white' : ''}`}
              style={{ backgroundColor: val.color + '30', borderColor: val.color, borderWidth: 1 }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: val.color }}></span>
              {val.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">Loading map...</div>
          ) : (
            <MapComponent
              attacks={sorted}
              selectedAttack={selectedAttack}
              onSelect={setSelectedAttack}
            />
          )}
        </div>

        <aside className="w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto p-4">
          <h2 className="text-lg font-semibold mb-3">Incidents ({sorted.length})</h2>
          {sorted.length === 0 && <p className="text-gray-400 text-sm">No incidents match filters.</p>}
          {sorted.map(attack => (
            <div
              key={attack.id}
              onClick={() => setSelectedAttack(attack)}
              className={`mb-3 p-3 rounded cursor-pointer border ${selectedAttack?.id === attack.id ? 'border-blue-500 bg-gray-700' : 'border-gray-700 bg-gray-750 hover:bg-gray-700'}`}
            >
              <div className="flex items-start justify-between">
                <strong className="text-sm">{attack.title}</strong>
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: categories[attack.category]?.color + '40' }}>
                  {attack.category}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{attack.location} • {attack.date}</p>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
