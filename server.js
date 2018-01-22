const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())      		// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true,
}))

app.get('/api/:id', function (req, res) {
	res.send({
		title: 'Example data',
		recivedId: req.param.id,
		words: 'Lorem ipsum dolor sit ament'.split(' '),
	})
})

app.use(express.static('./build'))
app.get('/*', (req,res) => {
	res.sendFile(path.join(__dirname, '/../build/index.html'))
})

const PORT = 8080
app.listen(PORT, function () {
	console.log('App is running on port: ' + PORT)
})