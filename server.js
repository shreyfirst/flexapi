/*	server.js
*	(C) 2018 AppleCrazy. All rights reserved.
*	This file may not be distributed without the accompanying license
*   located in the repository https://github.com/applecrazy/flexapi.
*/

const flexGetter = require('./flexGetter')
const bodyParser = require('body-parser')
const express = require('express')

const PORT = process.env.PORT || 8080

var app = express()

app.use(bodyParser.json())
app.use(express.static(__dirname + '/doc'))


app.post('/:school/appointments', (req, res, next) => {
	res.header('Content-Type', 'application/json')
	if (!req.body || !req.body.username || !req.body.password) {
		res.status(400).json({ error: 'MISSING_CREDENTIALS' })
		next()
	}
	flexGetter.setSchool(req.params.school)
	flexGetter.login(req.body.username, req.body.password)
		.then(flexGetter.getAppointments)
		.then(body => {
			if (body === "" || !body) {
				res.status(400).json({ error: 'INVALID_CREDENTIALS' })
				res.end()
			} else {
				res.send(body)
			}
		})
		.catch(() => {
			res.json({ error: "REJECTED" })
		})
})


app.listen(PORT, () => {
	console.log(`Now listening on ${PORT}...`)
})