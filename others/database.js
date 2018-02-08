//Simple database working in RAM memory

const storage = {
	messages: [],
}
let messageListeners = []
function addMessageListener(listener) {
	messageListeners.push(listener)
	return listener
}
function removeMessageListener(listener) {
	messageListeners = messageListeners.filter(l => l !== listener)
}
function addMessage(message) {
	storage.messages.push(message)
	messageListeners.forEach((listener) => listener(message))
}
function getMessages(address, startDate) {
	return storage.messages
		.filter(({ recieverAddress }) => address === undefined || recieverAddress === address)
		.filter(({ date }) => startDate === undefined || date > startDate)
}

module.exports = { addMessage, getMessages, addMessageListener, removeMessageListener }