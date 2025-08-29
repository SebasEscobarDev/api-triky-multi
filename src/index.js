import express from 'express'
import http from 'http'
import morgan from 'morgan'
import cors from 'cors'
import { env } from './environment.js'
import { Server as SocketIOServer } from 'socket.io'
import { configureSocketIO } from './routes/sockets.js'
// conectar db
import { sequelize } from './database/sequelize.js'
// rutas
import usersRoutes from './routes/users.js'
import gamesRoutes from './routes/games.js'
import gameMovesRoutes from './routes/game-moves.js'
import rankingsRoutes from './routes/rankings.js'
import userSettingsRoutes from './routes/user-settings.js'
import notificationsRoutes from './routes/notifications.js'
import './models/associations.js'

import cl from 'picocolors'

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new SocketIOServer(server, {
  transports: ['websocket', 'polling'],
  cors: {
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
})

app.set('port', env.APP_PORT)
app.use(morgan('dev'))
// app.use( session({secret: '123456', resave: true, saveUninitialized: true}) );
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// socket
configureSocketIO(io)
app.set('socketIo', io);


// usar rutas
app.use('/users', usersRoutes)
app.use('/games', gamesRoutes)
app.use('/game-moves', gameMovesRoutes)
app.use('/rankings', rankingsRoutes)
app.use('/user-settings', userSettingsRoutes)
app.use('/notifications', notificationsRoutes)

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
