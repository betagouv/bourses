var soap = require('soap');
var request = require('request');
var fs = require('fs');
var util = require('util');
var constants = require('constants');
exports.caf = function(req, res) {

  var url = 'https://pep-test.caf.fr/sgmap/wswdd/v1?wsdl';

  var dateDebutPeriode = req.body.dateDebutPeriode;
  var dateFinPeriode = req.body.dateFinPeriode;
  var dateEnvironement = req.body.dateEnvironement;
  var codeOrganisme = req.body.codeOrganisme; //148
  var matricule = req.body.matricule; //354

  var args = {
    arg0: {
      app: 'WAT',
      id: '?',
      beanEntreeDemandeDocumentWeb: {
        codeOrganisme: '148',
        matricule: '354',
        dateDebutPeriode: '01072015',
        dateFinPeriode: '31072015',
        dateEnvironement: '01082015',
        codeAppli: 'WAT',
        codeSituation: 1,
        codePrestation: 'AF',
        typeDocument: '0',
        typeEnvoi: '3'
      }
    }
  };

  var client = soap.createClient(url, {
    wsdl_options: {
      cert: fs.readFileSync('/etc/nginx/ssl/bourse.sgmap.fr.bundle.crt'),
      key: fs.readFileSync('/etc/nginx/ssl/bourse.sgmap.fr.key')
    }
  }, function(err, client) {
    client.setSecurity(new soap.ClientSSLSecurity(
      '/etc/nginx/ssl/bourse.sgmap.fr.key',
      '/etc/nginx/ssl/bourse.sgmap.fr.bundle.crt',
      {
        rejectUnauthorized: false,
        strictSSL: false,
        secureOptions: constants.SSL_OP_NO_TLSv1_2
      }
    ));
    client.WsdemandedocumentwebV1Service.WsdemandedocumentwebV1Port.demanderDocumentWeb(args, function(err, result, raw, header) {
      //console.log(err);
      console.log(result);
      console.log(raw);
      console.log(header);
    });

    // console.log(client.WsdemandedocumentwebV1Service.WsdemandedocumentwebV1Port.demanderDocumentWeb.describe());
  });
};
