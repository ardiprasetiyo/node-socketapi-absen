
const app = require('express')()
const http = require('http').createServer(app)
const bodyParser = require('body-parser')
const io = require('socket.io')(http);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false }))

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html')
})

app.post('/api/send', function(req,res){
	const data = req.body.name
	console.log(data);
	io.emit('test', data)
	res.send("OK!")
})


io.on('connection', function(socket){
	console.log('A User Has Been Connected');
	socket.on('test', function(msg){
		io.emit('test', msg);
	})

})

http.listen(3000, function(){
	console.log("Server Is Listening")
})