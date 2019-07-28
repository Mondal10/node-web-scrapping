const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://news.ycombinator.com/';
const fs = require('fs');
const writeStream = fs.createWriteStream('post.csv');

// Write Headers in CSV file
writeStream.write(`Title,Source,Link \n`);

axios.get(url)
    .then(response => {
        //Retrieve the whole Html file of the given url
        let getData = (html) => {
            // scrappedData = [];
            const $ = cheerio.load(html);
            $('table.itemlist tr td:nth-child(3)').each((i, element) => {
                // Not used Currently
                // scrappedData.push({
                //     title: $(element).text(),
                //     link: $(element).find('a.storylink').attr('href')
                // });

                const title = $(element).find('a.storylink').text();
                const newsSource = $(element)
                    .find('span.sitebit')
                    .text()
                    .replace(/[\])}[{(]/g, ''); // Replace all brackets
                const link = $(element).find('a.storylink').attr('href');

                // Write Row To CSV
                writeStream.write(`${title},${newsSource},${link} \n`);
            });

            console.log('******Scrapping Done******');
        }

        getData(response.data);
    })
    .catch(error => {
        console.log(error);
    })
