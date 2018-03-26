const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const sockets = require('./others/sockets')
const messagesRouter = require('./routes/messagesRouter')
const config = require('./config')

const PORT = process.env.PORT || config.port
const app = express()
const apiPath = 'api'

app.use(cors())
app.use(bodyParser.json())      		// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true,
}))
app.use(`/${apiPath}/messages`, messagesRouter)

const server = app.listen(PORT, function () {
	console.log('App is running on port: ' + PORT)
})
sockets(server)