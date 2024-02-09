
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import fetchData from '../components/services/dataService';
import './DetailsPage.css';

const DetailsPage = () => {
  const { symbol } = useParams();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetailsData = async () => {
      const data = await fetchData();
      const detailsData = data.find((item) => item.Symbol === symbol);
      setDetails(detailsData);
    };

    fetchDetailsData();
  }, [symbol]);

  if (!details) {

    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Details for Symbol: {symbol}</h2>
      <p>Name: {details.Name}</p>
      <p>Sector: {details.Sector}</p>
      <p>Valid Till: {details.Validtill}</p>

    </div>
  );
};

export default DetailsPage;
