//Simple database working in RAM memory

const storage = {
	messages: [],
}

function addMessage(message) {
	storage.messages.push(message)
}
function getMessages(address, startDate) {
	return storage.messages
		.filter(({ recieverAddress }) => address === undefined || recieverAddress === address)
		.filter(({ date }) => startDate === undefined || date > startDate)
}

module.exports = { addMessage, getMessages }