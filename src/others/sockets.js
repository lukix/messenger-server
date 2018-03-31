const io = require('socket.io')()
const { messages: messagesDB } = require('./database/')
const config = require('../config')

module.exports = function (server) {
	server.listen(config.websocketsPort)
	io.attach(server)

	io.on('connection', function (socket) {
		let listener = null
		socket.on('listen', function (publicKey) {
			listener = messagesDB.addListener(function (message) {
				if(message.recieverAddress === publicKey) {
					socket.emit('message', publicKey)
				}
			})
		})
		socket.on('disconnect', function () {
			if(listener !== null) {
				messagesDB.removeListener(listener)
			}
		})
	})
}