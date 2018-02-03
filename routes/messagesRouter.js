const express = require('express')
const db = require('../others/database')
const validate = require('../others/validate')
const router = express.Router()

router.route('/')
	.post(function (req, res) {
		const requiredProperties = [
			{ name: 'recieverAddress', type: 'string' },
			{ name: 'encryptedPassword', type: 'string' },
			{ name: 'message', type: 'string' },
			{ name: 'signature', type: 'string' },
		]
		const validationResult = validate(req.body, requiredProperties)

		if(validationResult.isValid) {
			const message = { ...req.body, date: new Date() }
			db.addMessage(message)
			res.status(201).send()
		} else {
			res.status(400).send({
				errors: validationResult.errors,
			})
		}
	})
	.get(function (req, res) {
		const { recieverAddress, startDate } = req.body
		const messages = db.getMessages(recieverAddress, startDate)
		res.status(200).send(messages)
	})

module.exports = router