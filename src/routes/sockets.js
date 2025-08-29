import cl from 'picocolors'

export async function configureSocketIO(io) {
  io.on('connection', (socket) => {
    cl.bgGreen(`⚡ Usuario conectado: ${socket.id}`);

    // Guardar userId si lo envía el cliente
    socket.on('myUserId', (user_id) => {
      socket.userId = user_id;
      cl.bgGreen(`🔗 Usuario asociado al socket: ${user_id}`);
    });

    // Desconexión automática (cierra app, pierde internet, etc.)
    socket.on('disconnect', (reason) => {
      cl.bgRed(`🔥 Usuario desconectado: ${socket.userId} (Motivo: ${reason})`);

      // Si quieres notificar a otros usuarios o guardar en BD:
      // await User.update({ online: false }, { where: { id: socket.userId } });
      // socket.to(room).emit('player_left', { userId: socket.userId });
    });
  });
}
