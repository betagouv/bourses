var request = require('request');

exports.caf = function(req, res) {

  var dateDebutPeriode = req.body.dateDebutPeriode;
  var dateFinPeriode = req.body.dateFinPeriode;
  var dateEnvironement = req.body.dateEnvironement;
  var codeOrganisme = req.body.codeOrganisme; //148
  var matricule = req.body.matricule; //354

  var soapRequest = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://v1.ws.wsdemandedocumentweb.cnaf/">' +
   '<soapenv:Header/>' +
    '<soapenv:Body>' +
      '<v1:demanderDocumentWeb>' +
         '<arg0>' +
            '<app>WAT</app>' +
            '<id>?</id>' +
            '<beanEntreeDemandeDocumentWeb>' +
              '<codeOrganisme>' + codeOrganisme + '</codeOrganisme>' +
              '<matricule>' + matricule + '</matricule>' +
              '<dateDebutPeriode>' + dateDebutPeriode + '</dateDebutPeriode>' +
              '<dateFinPeriode>' + dateFinPeriode + '</dateFinPeriode>' +
              '<dateEnvironement>' + dateEnvironement + '</dateEnvironement>' +
              '<codeAppli>WAT</codeAppli>' +
              '<codeSituation>1</codeSituation>' +
              '<codePrestation>AF</codePrestation>' +
              '<typeDocument>0</typeDocument>' +
              '<typeEnvoi>3</typeEnvoi>' +
            '</beanEntreeDemandeDocumentWeb>' +
         '</arg0>' +
      '</v1:demanderDocumentWeb>' +
   '</soapenv:Body>' +
  '</soapenv:Envelope>';

  request.post({
    url:'https://pep-test.caf.fr/sgmap/wswdd/v1?wsdl',
    body: soapRequest,
    headers: {'Content-Type': 'text/xml'}
  }, function(error, response) {
    if (error) {
      req.log.error(error);
      return res.status(500).send(error);
    }

    res.send({response: response});
  });
};
