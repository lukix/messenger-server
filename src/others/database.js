const Datastore = require('nedb')
const config = require('../config')

const messagesStore = new Datastore({ filename: config.messagesStorePath, autoload: true })
let messageListeners = []
function addMessageListener(listener) {
	messageListeners.push(listener)
	return listener
}
function removeMessageListener(listener) {
	messageListeners = messageListeners.filter(l => l !== listener)
}
function addMessage(message) {
	return new Promise((resolve, reject) => {
		messagesStore.insert(message, function (err, newMessage) {
			if(err) return reject(err)
			resolve(newMessage)
			messageListeners.forEach((listener) => listener(message))
		})
	})
}
function getMessages(address, startDate, clientGeneratedId) {
	return new Promise((resolve, reject) => {
		const query = {
			...(address !== undefined ? { recieverAddress: address } : {}),
			...(startDate !== undefined ? { date: { $gt: startDate } } : {}),
			...(clientGeneratedId !== undefined ? { clientGeneratedId } : {}),
		}
		messagesStore.find(query, function (err, messages) {
			if(err) return reject(err)
			resolve(messages)
		})
	})
}

module.exports = {
	messages: {
		add: addMessage,
		get: getMessages,
		addListener: addMessageListener,
		removeListener: removeMessageListener,
	},
}