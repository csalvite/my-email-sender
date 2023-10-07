const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

app.use(express.json());

const { EMAIL, PASS, PORT } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/enviar-correo', (req, res) => {
  const { email, asunto, mensaje } = req.body;

  console.log('body', req.body);

  // Configura el transporte de correo electrónico (puedes usar tu propio servicio SMTP aquí)
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: EMAIL, // 'tu_correo@gmail.com',
      pass: PASS, //'tu_contraseña',
    },
  });

  const mailOptions = {
    from: email, //'tu_correo@gmail.com',
    to: EMAIL,
    subject: asunto,
    text: `Correo de: ${email}\n\n${mensaje}`,
  };

  // Envía el correo electrónico
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error al enviar el correo');
    } else {
      console.log('Correo enviado: ' + info.response);
      res.send('Correo enviado con éxito');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
