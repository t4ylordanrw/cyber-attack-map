'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../components/Map'), { ssr: false });

const categories = {
  Financial: { color: '#ef4444', label: 'Financial' },
  'Private Organisation': { color: '#3b82f6', label: 'Private Organisation' },
  'Critical Infrastructure': { color: '#f97316', label: 'Critical Infrastructure' },
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
            title="From date"
          />
          <span className="text-gray-400 text-sm">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="px-2 py-1.5 rounded bg-gray-700 border border-gray-600 text-sm"
            title="To date"
          />
          {(search || dateFrom || dateTo || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setDateFrom('');
                setDateTo('');
                setSelectedCategory('All');
              }}
              className="text-sm text-blue-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1 rounded text-sm ${selectedCategory === 'All' ? 'bg-white text-black' : 'bg-gray-700'}`}
          >
            All ({attacks.length})
          </button>
          {Object.entries(categories).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${selectedCategory === key ? 'ring-2 ring-white' : ''}`}
              style={{ backgroundColor: val.color + '40' }}
            >
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: val.color }} />
              {val.label} ({attacks.filter(a => a.category === key).length})
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 bg-gray-800 overflow-y-auto border-r border-gray-700 p-4 hidden md:block">
          <h2 className="font-semibold mb-3">
            Incidents ({sorted.length})
          </h2>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : sorted.length === 0 ? (
            <p className="text-gray-400 text-sm">No incidents match your filters.</p>
          ) : (
            <div className="space-y-2">
              {sorted.map(attack => (
                <div
                  key={attack.id}
                  onClick={() => setSelectedAttack(attack)}
                  className="p-3 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 text-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: categories[attack.category]?.color }}
                    />
                    <span className="font-medium line-clamp-2">{attack.title}</span>
                  </div>
                  <div className="text-gray-400 text-xs">{attack.location} • {attack.date}</div>
                </div>
              ))}
            </div>
          )}
        </aside>

        <main className="flex-1 relative">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400">Loading map...</div>
          ) : (
            <MapComponent
              attacks={filteredAttacks}
              selectedAttack={selectedAttack}
              onSelect={setSelectedAttack}
            />
          )}
        </main>
      </div>

      {selectedAttack && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 p-4 border-t border-gray-700 max-h-56 overflow-y-auto z-10">
          <h3 className="font-bold">{selectedAttack.title}</h3>
          <p className="text-sm text-gray-300 mt-1">{selectedAttack.description}</p>
          <p className="text-xs text-gray-400 mt-2">Impact: {selectedAttack.impact}</p>
          <p className="text-xs text-gray-500 mt-1">Source: {selectedAttack.source}</p>
          <button onClick={() => setSelectedAttack(null)} className="mt-2 text-sm text-blue-400">Close</button>
        </div>
      )}
    </div>
  );
}
