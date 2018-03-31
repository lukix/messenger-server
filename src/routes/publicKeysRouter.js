const express = require('express')
const { publicKeys: publicKeysDB } = require('../others/database/')
const validate = require('../others/validate')
const randomstring = require('randomstring')
const router = express.Router()

const lengthMatch = (minLength = 0, maxLength = Infinity) =>
	(value) => value.length >= minLength && value.length <= maxLength
const generateRandomString = (length) => randomstring.generate({
	length,
	charset: 'alphanumeric',
	capitalization: 'lowercase',
	readable: true,
})
const generateRandomId = (chunks, chunkLength) => (
	new Array(chunks).fill().map(() => generateRandomString(chunkLength)).join('-')
)
const generateUniqueId = (chunks, chunkLength) => {
	const id = generateRandomId(chunks, chunkLength)
	return publicKeysDB.get(id).then(keyObj => {
		return keyObj === null
			? id
			: generateUniqueId(chunks, chunkLength)
	})
}
const selectKeyObjProps = ({ publicKey, aliasName }) => ({ publicKey, aliasName })

router.route('/')
	.post(function (req, res) {
		const requiredProps = [
			{ name: 'publicKey', type: 'string', validateFunc: lengthMatch(392, 392) },
		]
		const validationResult = validate(req.body, requiredProps, [], false)

		if(validationResult.isValid) {
			generateUniqueId(3, 4)
				.then(uniqueId => {
					const keyObj = {
						publicKey: req.body.publicKey,
						aliasName: uniqueId,
					}
					publicKeysDB.add(keyObj)
						.then(newKeyObj => res.status(201).send(selectKeyObjProps(newKeyObj)))
						.catch(err => res.status(500).send())	
				})
				.catch(err => res.status(500).send())	
						
		} else {
			res.status(400).send({
				errors: validationResult.errors,
			})
		}
	})

router.route('/:aliasName')
	.get(function (req, res) {
		const { aliasName } = req.params
		publicKeysDB.get(aliasName)
			.then(keyObj => (
				keyObj === null
					?	res.status(404).send('Key alias does not exist or it has expired')
					: res.status(200).send(selectKeyObjProps(keyObj))
			))
			.catch(err => res.status(500).send())
	})

module.exports = router