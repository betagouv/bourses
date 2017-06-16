
const iconv = require('iconv-lite');
const https = require('https');
const parse = require('csv-parse/lib/sync');
const fs = require('fs');

const dataGouvUrl = 'https://www.data.gouv.fr/s/resources/' +
  'adresse-et-geolocalisation-des-etablissements-denseignement-du-premier-et-second-degres/' +
  '20160526-143453/DEPP-etab-1D2D.csv';

function download(done) {
  https.get(dataGouvUrl, function(res) {
    const chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });
    res.on('end', function() {
      var decodedBody = iconv.decode(Buffer.concat(chunks), 'ISO-8859-1');
      done(decodedBody);
    });
  });
}

download(function(input) {
  const json = parse(input, {delimiter: ';', columns: true});
  fs.writeFileSync('DEPP-etab.json', JSON.stringify(json, null, 2), 'utf8');
});
