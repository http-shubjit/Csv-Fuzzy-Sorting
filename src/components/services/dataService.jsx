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
    // console.log(response)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const csvData = await response.text();

    // console.log(csvData)
    // const pr = new Promise((resolve, reject) => {
    //   parse(csvData, {
    //     header: true,
    //     dynamicTyping: true,
    //     complete: function (results) {
    //       resolve(results.data);
    //     },
    //     error: function (error) {
    //       reject(`Error parsing CSV: ${error.message}`);
    //     },
    //   });

    // });



    // let jsonData;
    // parse(csvData, {
    //   header: true,
    //   dynamicTyping: true,
    //   complete: function (results) {
    //     jsonData = results.data;
    //   },
    //   error: function (error) {
    //     throw new Error(`Error parsing CSV: ${error.message}`);
    //   },
    // });

    // return jsonData;}

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
    // console.log("pr=" + pr)
    // return pr;
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};



export default fetchData;
