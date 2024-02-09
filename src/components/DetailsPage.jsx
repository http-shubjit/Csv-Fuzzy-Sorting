// In DetailsPage.js

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import fetchData from '../components/services/dataService';
import './DetailsPage.css';

const DetailsPage = () => {
  const { symbol } = useParams();
  const [details, setDetails] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchDetailsData = async () => {
      const data = await fetchData();
      const detailsData = data.find((item) => item.Symbol === symbol);
      setDetails(detailsData);

      // Fetch quotes data for the selected symbol
      fetchQuotesData(symbol);
    };

    fetchDetailsData();
  }, [symbol]);

  const fetchQuotesData = async (selectedSymbol) => {
    try {
      const response = await fetch(`https://prototype.sbulltech.com/api/v2/quotes/${selectedSymbol}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const quotesData = await response.json();
      if (quotesData.success) {
        // Sort quotes based on timestamp initially
        const initialSortedQuotes = [...quotesData.payload[selectedSymbol]].sort((a, b) => {
          const timeA = new Date(a.time).getTime();
          const timeB = new Date(b.time).getTime();

          return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
        });

        setQuotes(initialSortedQuotes);
      } else {
        console.error(`Error fetching quotes data for ${selectedSymbol}: ${quotesData.error}`);
      }
    } catch (error) {
      console.error(`Error fetching quotes data for ${selectedSymbol}:`, error.message);
    }
  };

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';

    // Sort quotes based on timestamp
    const sortedQuotes = [...quotes].sort((a, b) => {
      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();

      return newSortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

    setQuotes(sortedQuotes);
    setSortOrder(newSortOrder);
  };

  if (!details) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Details for Symbol: {symbol}</h2>
      <p>Name: {details.Name}</p>
      <p>Sector: {details.Sector}</p>
      <p>Valid Till: {details.Validtill}</p>

      {/* Display quotes data */}
      <div className="quotes-section">
        <h3>Quotes for Symbol: {symbol}</h3>

        {quotes.length > 0 ? (
          <table className="quotes-table">
            <thead>
              <tr>
                <th onClick={toggleSortOrder} className={sortOrder === 'asc' ? 'sorted-asc' : 'sorted-desc'}>
                  Time
                </th>
                <th>Price</th>
                <th>Valid Till</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote, index) => (
                <tr key={index}>
                  <td>{quote.time}</td>
                  <td>{quote.price}</td>
                  <td>{quote.valid_till}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No quotes available for {symbol}</p>
        )}

        {/* Button to navigate back to CsvDataDisplay page */}
        <Link to="/">
          <button>Search Again</button>
        </Link>
      </div>
    </div>
  );
};

export default DetailsPage;
