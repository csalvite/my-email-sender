const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: 'http://cesaralvite.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Habilita las cookies u otros encabezados personalizados
};

app.use(cors(corsOptions));

app.use(cors());

app.options('*', cors());

const { EMAIL, PASS, PORT } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/enviar-correo', (req, res) => {
  const { email, asunto, mensaje } = req.body;

  console.log('body', req.body);
  if (!(email || asunto || mensaje)) {
    throw new Error('Falta de datos!');
  }

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
      res.send({
        status: 'ok',
        message: 'Correo enviado con éxito',
      });
    }
  });
});

app.use((error, req, res, _) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: 'Error',
    message: error.message,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
