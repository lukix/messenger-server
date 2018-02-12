const express = require('express')
const db = require('../others/database')
const validate = require('../others/validate')
const router = express.Router()

const selectMessageProps = ({ recieverAddress, encryptedPassword, message, signature, date }) =>
	({ recieverAddress, encryptedPassword, message, signature, date })

router.route('/')
	.post(function (req, res) {
		const requiredProps = [
			{ name: 'recieverAddress', type: 'string' },
			{ name: 'encryptedPassword', type: 'string' },
			{ name: 'message', type: 'string' },
			{ name: 'signature', type: 'string' },
		]
		const optionalProps = [
			{ name: 'clientGeneratedId', type: 'string' },
		]
		const validationResult = validate(req.body, requiredProps, optionalProps, false)

		if(validationResult.isValid) {
			const message = { ...req.body, date: new Date() }
			db.addMessage(message)
				.then(addedMessage => res.status(201).send(addedMessage))
				.catch(err => res.status(500).send())
		} else {
			res.status(400).send({
				errors: validationResult.errors,
			})
		}
	})
	.get(function (req, res) {
		const { recieverAddress, clientGeneratedId } = req.query
		const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined
		db.getMessages(recieverAddress, startDate, clientGeneratedId)
			.then(messages => messages.map(selectMessageProps))
			.then(messages => res.status(200).send(messages))
			.catch(err => res.status(500).send())
	})

module.exports = router