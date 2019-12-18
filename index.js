
const app = require('express')()
const http = require('http').createServer(app)
const bodyParser = require('body-parser')
const io = require('socket.io')(http)
const dateFormat = require('dateformat')
const dateToIndo = require('./date2indo.js')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false }))

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html')
})

app.post('/api/send', function(req,res){
	const idRfid = req.body.id_rfid
	var dateNow  =  dateFormat(new Date(), "d m yyyy H:m:s")

	// Parsing format to Indonesia Format 
	dateNow = dateToIndo(dateNow)

	JSONResponse =  {'id_rfid' : idRfid, 'datetime' : dateNow}

	io.emit('test',JSONResponse)
	res.send(JSONResponse)
})


io.on('connection', function(socket){
	console.log('A User Has Been Connected');
	socket.on('test', function(msg){
		io.emit('test', msg);
	})

})

http.listen(process.env.PORT || 3000, function(){
	console.log("Server Is Listening")
})
