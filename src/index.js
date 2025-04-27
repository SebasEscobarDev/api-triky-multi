import express from 'express'
import http from 'http'
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan'
import cors from 'cors'
import { env } from './environment.js'
// conectar db
import { sequelize } from './database/connection.js'
// rutas

import usersRoutes from './routes/users.js'


import cl from 'picocolors'
import { exec } from 'child_process';

const app = express()
app.use(cors())

const server = http.createServer(app)


app.set('port', env.APP_PORT)
app.use(morgan('dev'))
// app.use( session({secret: '123456', resave: true, saveUninitialized: true}) );
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('__dirname', __dirname);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// usar rutas
app.use('/users', usersRoutes)

app.get('/', (req, res) => {
  res.send('Servidor backend funcionando!')
})

server.listen(app.get('port'), async () => {
  console.log(cl.bgBlue('Server iniciado en puerto: ' + app.get('port')))
  sequelize.sync({ force: env.DB_SYNC == 'true' ? true : false }).then(() => {
    console.log(cl.bgGreen('Sincronizacion base de datos = ' + env.DB_SYNC))
  }).catch(error => {
    console.log(cl.bgRed('se ha producido un error ', error.message))
    console.log(cl.bgRed(error))
  })
})

//VALIDATE IF SYNC TRUE OR FALSE
if (env.DB_SYNC == 'true') {
  console.log(cl.bgGreen('Base de datos sincronizada'))
  // Ejecutar las migraciones
  // exec('npx sequelize-cli db:seed:all', (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Error ejecutando las migraciones: ${error.message}`);
  //     return;
  //   }
  //   if (stderr) {
  //     console.error(`Error en las migraciones: ${stderr}`);
  //     return;
  //   }
  //   console.log(`Migraciones ejecutadas con éxito: ${stdout}`);
  // });
}


export default app
