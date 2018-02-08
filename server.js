const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const sockets = require('./others/sockets')
const messagesRouter = require('./routes/messagesRouter')

const app = express()
const apiPath = 'api'

app.use(bodyParser.json())      		// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true,
}))
app.use(`/${apiPath}/messages`, messagesRouter)

app.use(express.static('./build'))
app.get('/*', (req,res) => {
	res.sendFile(path.join(__dirname, '/../build/index.html'))
})

const PORT = 8080
const server = app.listen(PORT, function () {
	console.log('App is running on port: ' + PORT)
})
sockets(server)