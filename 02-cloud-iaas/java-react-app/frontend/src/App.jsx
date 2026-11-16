import { useEffect, useState } from 'react';
import FilterableList from './components/FilterableList';

export default function App() {
  const [countries, setCountries] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/countries')
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((json) => setCountries(json.countries))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="container">
      <small>Project: java-react-app</small>
      <h1>Countries</h1>
      {error && <p className="error">Could not load countries: {error}</p>}
      {!error && (countries ? <FilterableList items={countries} /> : <p>Loading...</p>)}
    </main>
  );
}
