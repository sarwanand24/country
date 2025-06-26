import { useEffect, useState } from 'react';
import './App.css';

const PAGE_SIZE = 10;

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData(searchQuery);
  }, [searchQuery, data]);

  useEffect(() => {
    loadPage(1);
  }, [filteredData]);

  const fetchData = async () => {
    try {
      const res = await fetch('https://restcountries.com/v3.1/independent?status=true');
      const json = await res.json();
      setData(json);
      setFilteredData(json);
    } catch (err) {
      console.error('Failed to fetch countries', err);
    } finally {
      setLoading(false);
    }
  };

  const filterData = (query) => {
    const lowerQuery = query.toLowerCase();
    const filtered = data.filter(country =>
      country.name?.common?.toLowerCase().includes(lowerQuery)
    );
    setFilteredData(filtered);
    setPage(1);
  };

  const loadPage = (pageNum) => {
    const start = (pageNum - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const newData = filteredData.slice(0, end);
    setVisibleData(newData);
    setPage(pageNum);
  };

  const loadMore = () => {
    if (visibleData.length < filteredData.length) {
      loadPage(page + 1);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadMore();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  return (
    <div className="container">
      <h1>🌍 Countries List</h1>
      <input
        type="text"
        placeholder="Search countries..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="searchBar"
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="countryList">
          {visibleData.map((country, index) => (
            <li key={index} className="countryCard">
              <img
                src={country.flags?.png}
                alt={`Flag of ${country.name.common}`}
                className="flag"
              />
              <div>
                <strong>{country.name.common}</strong>
                <div>{country.region}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
