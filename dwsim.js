var fs = require('fs');

var clienti=[];
var fatture=[];
var registrazioni=[];

var headclienti={};
var headfatture={};
var headregistrazioni={};

fs.readFile('clienti.csv', function( err, data ){
  if(err) throw err;
  var array = data.toString().split("\r\n");
  console.log('array='+array.length);
  var h=array[0].split(',');
  h.forEach(function(d,i) {
    headclienti[d]=i;
  });
//  console.log(headclienti);
  array.forEach(function(d, i) {
    if (i>0 && d.length>0) {
      clienti.push(d);
    }
  });
  console.log('clienti='+clienti.length);
});

fs.readFile('fatture.csv', function( err, data ){
  if(err) throw err;
  var array = data.toString().split("\r\n");
  console.log('array='+array.length);
  var h=array[0].split(',');
  h.forEach(function(d,i) {
    headfatture[d]=i;
  });
//  console.log(headclienti);
  array.forEach(function(d, i) {
    if (i>0 && d.length>0) {
      fatture.push(d);
    }
  });
  console.log('fatture='+fatture.length);
});

fs.readFile('registrazioni.csv', function( err, data ){
  if(err) throw err;
  var array = data.toString().split("\r\n");
  console.log('array='+array.length);
  var h=array[0].split(',');
  h.forEach(function(d,i) {
    headregistrazioni[d]=i;
  });
//  console.log(headclienti);
  array.forEach(function(d, i) {
    if (i>0 && d.length>0) {
      registrazioni.push(d);
    }
  });
  console.log('registrazioni='+registrazioni.length);
});

// ==================================
//
// ==================================

function getClienteById(idAzienda)
{
  var o={ idazienda: null, azienda: null, persone:[] };
  clienti.forEach(function(d,i) {
    var c=d.split(',');
    if (c[headclienti['idazienda']]==idAzienda) {
      o.idazienda=c[headclienti['idazienda']];
      o.azienda=c[headclienti['azienda']];
      var p={ idpersona: c[headclienti['idpersona']],
              nome: c[headclienti['nome']], cognome: c[headclienti['cognome']],  email: c[headclienti['email']],};
      o.persone.push(p);
    }
  });
  return o;
}

function getClienteByRecord(i)
{
  var o={ idazienda: null, azienda: null, persone:[] };
  var c=clienti[i].split(',');

  o.idazienda=c[headclienti['idazienda']];
  o.azienda=c[headclienti['azienda']];
  var p={ idpersona: c[headclienti['idpersona']],
          nome: c[headclienti['nome']], cognome: c[headclienti['cognome']],  email: c[headclienti['email']],};
  o.persone.push(p);

  return o;
}

function getFatturaById(idFattura)
{
  var o={ };
  fatture.forEach(function(d,i) {
    var c=d.split(',');
    if (c[headfatture['idfattura']]==idFattura) {
      var f=getFatturaByRecord(i);
      console.log(f);
      if (o.righe==undefined) {
        for (h in headfatture)
        {
          o[h]=f[h];
          if (++i>8)
            break;
        }
        o.righe=[]
      }
      o.righe.push(f.righe[0]);
    }
  });
  return o;
}

function getFatturaByRecord(i)
{
  var o={};
  var c=fatture[i].split(',');

  var i=0;
  for (h in headfatture)
  {
    o[h]=c[headfatture[h]];
    if (++i>8)
      break;
  }
  o.righe=[];

  var i=0;
  var or={};
  for (h in headfatture)
  {
    if (++i>9)
      or[h]=c[headfatture[h]];
  }
  o.righe.push(or);

  return o;
}


function getRegistrazioneByRecord(i)
{
  var o={};
  var c=registrazioni[i].split(',');

  var i=0;
  for (h in headregistrazioni)
  {
    o[h]=c[headregistrazioni[h]];
  }

  return o;
}

// ==================================
//
// ==================================

var express = require('express');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

app.get('/', function(req,resp, next) {
  var help='<html><body>';
  help+='<h1>Developer Week Simulator</h1>';
  help+='<h2>REST Api methods</h1>';
  help+='<ul>';
  help+='<ul>REST Api methods</h1>';

  help+='<li>/clienti <a href="/clienti">Test me</a></li>';
  help+='<li>/cliente/:codice <a href="/cliente/2">Test me</a></li>';
  help+='<li>/clientecerca/:ricerca <a href="/clientecerca/Potter">Test me</a></li>';

  help+='<li>/fatture <a href="/fatture">Test me</a></li>';
  help+='<li>/fattura/:idfattura <a href="/fattura/1">Test me</a></li>';
  help+='<li>/fatturacerca/:stringaricerca <a href="/fatturacerca/Potter">Test me</a></li>';

  help+='<li>/registrazioni <a href="/registrazioni">Test me</a></li>';
  help+='<li>/registrazione/:idregistrazione <a href="/registrazione/1">Test me</a></li>';
  help+='<li>/registrazionecerca/:stringaricerca <a href="/registrazionecerca/Grifondoro">Test me</a></li>';
  help+='<li>/saldo/:idazienda <a href="/saldo/Grifondoro">Test me</a></li>';

  help+='</ul>';
  help+='</body></html>';

  resp.send(help);
});


app.get('/clienti', function(req, resp, next) {
  var r=[];
  var id=null;
  clienti.forEach(function(d,i){
    var c=getClienteByRecord(i);
    if (c.idazienda!=id) {
      id=c.idazienda;
      r.push(getClienteById(id));
    }
  });
  resp.send(JSON.stringify(r));
});

app.get('/cliente/:codice', function(req,resp) {
  var codice=req.params.codice;
  var n=parseInt(codice);
  var c=getClienteById(codice);

  resp.send(JSON.stringify(c));
});

app.get('/clientecerca/:ricerca', function(req,resp) {
  var ricerca=req.params.ricerca;
  var r=[];
  clienti.forEach(function(d,i){
    var c=d.split(',');
    var f=false;
    c.forEach(function(s) {
      if (s==ricerca) f=true;
    });
    if (f) r.push(getClienteByRecord(i));
  });
  resp.send(JSON.stringify(r));
});

app.get('/fatture', function(req,resp) {
  var r=[];
  var id=null;
  fatture.forEach(function(d,i){
    var c=getFatturaByRecord(i);
    if (c.idfattura!=id) {
      id=c.idfattura;
      r.push(getFatturaById(id));
    }
  });
  resp.send(JSON.stringify(r));

});

app.get('/fattura/:codice', function(req,resp) {
  var codice=req.params.codice;
  var n=parseInt(codice);
  var c=getFatturaById(codice);
  resp.send(JSON.stringify(c));
});

app.get('/fatturacerca/:ricerca', function(req,resp) {
  var ricerca=req.params.ricerca;
  var r=[];
  fatture.forEach(function(d,i){
    var c=d.split(',');
    var f=false;
    c.forEach(function(s) {
      if (s==ricerca) f=true;
    });
    if (f) r.push(getFatturaByRecord(i));
  });
  resp.send(JSON.stringify(r));
});

app.get('/registrazione/:codice', function(req,resp) {
  var codice=req.params.codice;
  var n=parseInt(codice);
  var c=getRegistrazioneByRecord(codice);
  resp.send(JSON.stringify(c));
});

app.get('/registrazioni', function(req,resp) {
  var r=[];
  var id=null;
  registrazioni.forEach(function(d,i){
    var c=getRegistrazioneByRecord(i);
    r.push(c);
  });
  resp.send(JSON.stringify(r));
});

app.get('/registrazionecerca/:ricerca', function(req,resp) {
  var ricerca=req.params.ricerca;
  var r=[];
  registrazioni.forEach(function(d,i){
    var c=d.split(',');
    var f=false;
    c.forEach(function(s) {
      if (s==ricerca) f=true;
    });
    if (f) r.push(getRegistrazioneByRecord(i));
  });
  resp.send(JSON.stringify(r));
});

app.get('/saldo/:idazienda', function(req,resp) {
  var idazienda=req.params.idazienda;
  var r=[];
  var saldo=0;
  registrazioni.forEach(function(d,i){
    var c=getRegistrazioneByRecord(i);
    if (c.idazienda==idazienda)
      console.log(c);
      r.push(c);
      saldo+=parseFloat(c.importo);
  });
  resp.send(JSON.stringify({saldo:saldo, registrazioni: r}));
});
