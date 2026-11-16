import { useState } from 'react';

export default function FilterableList({ items = [] }) {
  const [filter, setFilter] = useState('');
  const filtered = items.filter((item) => item.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter countries..."
        aria-label="Filter countries"
      />
      <p className="count">{filtered.length} of {items.length}</p>
      <ul>
        {filtered.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
