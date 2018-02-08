const io = require('socket.io')()
const { addMessageListener, removeMessageListener } = require('./database.js')

module.exports = function (server) {
	server.listen(8080)
	io.attach(server)

	io.on('connection', function (socket) {
		let listener = null
		socket.on('listen', function (publicKey) {
			listener = addMessageListener(function (message) {
				if(message.recieverAddress === publicKey) {
					socket.emit('message', publicKey)
				}
			})
		})
		socket.on('disconnect', function () {
			if(listener !== null) {
				removeMessageListener(listener)
			}
		})
	})
}