const Datastore = require('nedb')
const config = require('../../config')

const publicKeysStore = new Datastore({ filename: config.publicKeysStorePath, autoload: true })
function addKey(keyObj) {
	return new Promise((resolve, reject) => {
		publicKeysStore.insert(keyObj, function (err, newKeyObj) {
			if(err) return reject(err)
			resolve(newKeyObj)
		})
	})
}
function getKey(aliasName) {
	return new Promise((resolve, reject) => {
		const query = { aliasName }
		publicKeysStore.findOne(query, function (err, key) {
			if(err) return reject(err)
			resolve(key)
		})
	})
}

module.exports = {
	add: addKey,
	get: getKey,
}