'use strict';

module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    const io = require('socket.io')(strapi.server.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => { 
      console.log('A user connected');

      socket.on('sendMessage', async (data) => {
        console.log('Received data:', data);
        try {
          const entry = await strapi.entityService.create('api::message.message', {
            data: data
          });
          socket.emit('messageReceived', entry);
        } catch (error) {
          console.error('Error creating message:', error);
          socket.emit('error', { message: 'Failed to create message' });
        }
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  },
};