const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const sockets = require('./others/sockets')
const messagesRouter = require('./routes/messagesRouter')
const config = require('./config')

const app = express()
const apiPath = 'api'

app.use(cors())
app.use(bodyParser.json())      		// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true,
}))
app.use(`/${apiPath}/messages`, messagesRouter)

const server = app.listen(config.port, function () {
	console.log('App is running on port: ' + config.port)
})
sockets(server)