import { parse } from 'papaparse';

const fetchData = async () => {
  try {
    const response = await fetch(
      'https://prototype.sbulltech.com/api/v2/instruments',
      {
        headers: {
          Accept: 'text/csv',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const csvData = await response.text();
    return new Promise((resolve, reject) => {
      parse(csvData, {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
          resolve(results.data);
        },
        error: function (error) {
          reject(`Error parsing CSV: ${error.message}`);
        },
      });
    });
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};
export default fetchData;
