var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var novedadesModel = require('../models/novedadesModel');

/* GET home page. */
router.get('/', async function (req, res, next) {
  var novedades = await novedadesModel.getNovedades()
  res.render('index', {
    novedades
  });
});



router.post('/', async (req, res, next) => {

  var nombre = req.body.nombre;
  var email = req.body.email;
  var mensaje = req.body.mensaje;

  console.log(req.body)

  var obj = {
    to: 'estigarribia.l97@gmail.com',
    subject: 'CONTACTO WEB',
    html: nombre + " se contacto a través de la web y quiere más informacion a este correo : " + email + ". <br> Además, hizo este comentario : " + mensaje
  };

  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });


  var info = await transport.sendMail(obj);

  res.render('index', {
    message: 'Mensaje enviado correctamente'
  });
});

module.exports = router;
