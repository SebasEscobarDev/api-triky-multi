import express from 'express'
import http from 'http'
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan'
import cors from 'cors'
import { env } from './environment.js'

// conectar db
import { sequelize } from './database/sequelize.js'
// rutas
import usersRoutes from './routes/users.js'
import './models/associations.js'

import cl from 'picocolors'

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
  // sequelize.sync({ force: env.DB_SYNC == 'true' ? true : false }).then(() => {
  //   console.log(cl.bgGreen('Sincronizacion base de datos = ' + env.DB_SYNC))
  // }).catch(error => {
  //   console.log(cl.bgRed('se ha producido un error ', error.message))
  //   console.log(cl.bgRed(error))
  // })
})


export default app
