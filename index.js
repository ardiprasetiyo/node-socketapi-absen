// MODULES
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const fs = require('fs')
const bodyParser = require('body-parser')
const dateFormat = require('dateformat')


// FORCE HTTP (HEROKU)
app.use(function(req, res, next) {
    if (process.env.NODE_ENV === 'production') {
        if (req.headers['x-forwarded-proto'] != 'https') {
            return res.redirect('https://' + req.headers.host + req.url);
        } else {
            return next();
        }
    } else {
        return next();
    }
})



// SOCKET CONNECTION
io.on('connection', function(socket){
	console.log('A User Has Been Connected');
	socket.on('rfid-reader', function(msg){
		io.emit('rfid-reader', msg);
	})

})



// MIDDLEWARE
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false }))



// ROUTING

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html')
})


// READ RFID DATA

app.post('/api/rfid', function(req,res){
	const rfidID = req.body.id_rfid
	const deviceID = req.body.id_device

	if( !rfidID || !deviceID ){
		JSONResponse =  {'status_code' : 422, 'message' : 'Parameter is Required'}
		res.status(422).send(JSONResponse)
		return
	}

	var dateNow  =  dateFormat(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }), "d mmmm yyyy H:M:ss")
	
	JSONResponse =  {'status_code' : 200, 'id_rfid' : rfidID, 'id_device' : deviceID, 'datetime' : dateNow}

	io.emit('rfid-reader',JSONResponse)
	res.status(200).send(JSONResponse)
})


 // REGISTER DEVICE


app.post('/api/device', function(req, res){
	const deviceID = req.body.id_device
	const deviceName = req.body.name_device

	if( !deviceID ){
		JSONResponse =  {'status_code' : 422, 'message' : 'Device ID Is Required'}
		res.status(422).send(JSONResponse)
		return
	}


	JSONResponse = {'status_code' : 200, 'message' : 'Device Registered' ,'id_device' : deviceID}

	res.status(200).send(JSONResponse)


})



http.listen(process.env.PORT || 3000, function(){
	console.log("Server Is Listening")
})
