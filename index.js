// Node Module
const app = require('express')()
const http = require('http').createServer(app)
const bodyParser = require('body-parser')
const io = require('socket.io')(http)
const dateFormat = require('dateformat')
const fs = require('fs')

// Force HTTPS Redirection ( Heroku Only )
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
});

// Using Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false }))


// Routing

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html')
})

app.post('/api/send', function(req,res){
	const idRfid = req.body.id_rfid
	var dateNow  =  dateFormat(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }), "d mmmm yyyy H:M:ss")
	JSONResponse =  {'id_rfid' : idRfid, 'datetime' : dateNow}

	io.emit('test',JSONResponse)
	res.send(JSONResponse)
})

app.post('/api/register/device', function(req, res){
	const deviceID = req.body.id_device
	const deviceName = req.body.name_device

	// Store Data To Fak Database
	var db = JSON.parse(fs.readFileSync('./registered-device.json'))
	db.push({'deviceID' : deviceID, 'deviceName' : deviceName})
	fs.writeFileSync('./registered-device.json', JSON.stringify(db));

	res.send(db)
})


// Socket IO Connection
io.on('connection', function(socket){
	console.log('A User Has Been Connected');
	socket.on('test', function(msg){
		io.emit('test', msg);
	})

})

http.listen(process.env.PORT || 3000, function(){
	console.log("Server Is Listening")
})
