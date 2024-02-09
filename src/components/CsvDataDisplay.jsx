import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import fetchData from './services/dataService';
import './CsvDataDisplay.css';

const CsvDataDisplay = () => {
  const [originalData, setOriginalData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortOrder, setSortOrder] = useState({ field: '', direction: 'asc' });

  useEffect(() => {
    const fetchDataAndSetData = async () => {
      const data = await fetchData();
      setOriginalData(data);
    };

    fetchDataAndSetData();
  }, []);

  useEffect(() => {
    if (searchTerm && originalData.length > 0) {
      const fuse = new Fuse(originalData, {
        keys: ['Symbol'],
        threshold: 0.2,
      });

      const result = fuse.search(searchTerm);
      setSearchResults(result.map((item) => item.item));
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, originalData]);

  const handleSort = (field) => {
    setSortOrder((prevSortOrder) => ({
      field,
      direction: prevSortOrder.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const displayData = (data) => {
    const sortedData = data
      .filter((item) => item.Symbol !== null)
      .sort((a, b) => {
        if (sortOrder.field === 'Symbol') {
          return sortOrder.direction === 'asc' ? a.Symbol.localeCompare(b.Symbol) : b.Symbol.localeCompare(a.Symbol);
        } else if (sortOrder.field === 'Validtill') {
          const dateA = new Date(a.Validtill.replace(/-/g, '/')).getTime(); // Convert to valid date format
          const dateB = new Date(b.Validtill.replace(/-/g, '/')).getTime(); // Convert to valid date format

          return sortOrder.direction === 'asc' ? dateA - dateB : dateB - dateA;
        } else {
          return 0;
        }
      });

    return sortedData.map((item) => (
      <tr key={item.Symbol}>
        <td>
          <Link to={`/details/${item.Symbol}`}>{item.Symbol}</Link>
        </td>
        <td>{item.Name}</td>
        <td>{item.Sector}</td>
        <td>{item.Validtill}</td>
      </tr>
    ));
  };

  const performSearch = () => {
    if (!searchTerm) {
      alert('Harigoli Agyann....');
    }
  };

  return (
    <div className="csv-data-display-container">
      <div className="search-container">
        <input
          type="text"
          id="searchInput"
          placeholder="Search by Symbol Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={performSearch} id="searchButton">
          Search
        </button>
      </div>
      <div className="sort-buttons">
        <button onClick={() => handleSort('Symbol')}>Sort by Symbol</button>
      </div>
      <table id="csvTable">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Sector</th>
            <th>Valid Till</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.length > 0
            ? displayData(searchResults)
            : displayData(originalData)}
        </tbody>
      </table>
    </div>
  );
};

export default CsvDataDisplay;
