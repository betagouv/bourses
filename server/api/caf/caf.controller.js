var soap = require('soap');
var request = require('request');
var fs = require('fs');

exports.caf = function(req, res) {

  var url = 'https://pep-test.caf.fr/sgmap/wswdd/v1?wsdl';

  var dateDebutPeriode = req.body.dateDebutPeriode;
  var dateFinPeriode = req.body.dateFinPeriode;
  var dateEnvironement = req.body.dateEnvironement;
  var codeOrganisme = req.body.codeOrganisme; //148
  var matricule = req.body.matricule; //354

  var args = {
    beanEntreeDemandeDocumentWeb: {
      codeOrganisme: codeOrganisme,
      matricule: matricule,
      dateDebutPeriode: dateDebutPeriode,
      dateFinPeriode: dateFinPeriode,
      dateEnvironement: dateEnvironement,
      codeAppli: 'WAT',
      codeSituation: 1,
      codePrestation: 'AF',
      typeDocument: '0',
      typeEnvoi: '3'
    }
  };

  var client = soap.createClient(url, {
    wsdl_options: {
      cert: fs.readFileSync('/etc/nginx/ssl/bourse.sgmap.fr.bundle.crt'),
      key: fs.readFileSync('/etc/nginx/ssl/bourse.sgmap.fr.key')
    }
  }, function(err, client) {
    // console.log(client.describe());
    // console.log(client.WsdemandedocumentwebV1Service.WsdemandedocumentwebV1Port.demanderDocumentWeb.describe());
  });

};
