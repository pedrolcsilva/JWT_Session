const express = require('express');
const cors = require('cors')
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const usuarios = JSON.parse(fs.readFileSync('./users.json'));

const app = express();

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:8080'})); //habilitando cors na nossa aplicacao

const privatekey = fs.readFileSync('./jwtRS256.key')

app.get('/', (req, res) => res.send("Hello World"))


//function validToken(req, res, next){
// 
//}
app.post('/regUser', urlencodedParser, (req, res) => {
    const form = req.body;

    console.log(form)
    let userSearch = usuarios.slice()
    
    userSearch = userSearch.filter(element => {
        return element.username == form.username;
    });
    

    if(userSearch.length == 0 ){
        usuarios.push({name: form.name, username: form.username, password: form.password, userType: "user"})
        
        fs.writeFileSync('./users.json', JSON.stringify(usuarios));
        res.sendStatus(201);
    }else{
        res.sendStatus(401);
    }
   
}) 

app.post('/regUser', urlencodedParser, (req, res) => {
    const form = req.body;

    console.log(form)
    let userSearch = usuarios.slice()
    
    userSearch = userSearch.filter(element => {
        return element.username == form.username;
    });
    

    if(userSearch.length == 0 ){
        usuarios.push({name: form.name, username: form.username, password: form.password, userType: "user"})
        
        fs.writeFileSync('./users.json', JSON.stringify(usuarios));
        res.sendStatus(201);
    }else{
        res.sendStatus(401);
    }
   
}) 

app.post('/login', jsonParser, (req, res) => {
    const form = req.body;

    usuarios.forEach(element => {
        if(element.username == form.username && element.password == form.password){
            res.cookie("login", "true");
            if(element.userType == "adm"){
                res.cookie("loginType", "adm");
            }

            const token = jwt.sign(
                { 
                    username: element.username,
                    userType: element.userType, 
                }, 
                privatekey, 
                { algorithm: 'RS256' },
                { expiresIn: 60 * 5 }
            );
            res.cookie("token", token)
	        res.send(true);
        }
    });
    res.status(401).send('Login inválido!');
    
})  

app.post('/getcookie', jsonParser,function(req, res) {
    jwt.verify(req.cookies.token, privatekey, {algorithms: 'RS256'}, function(err, decoded) {
        if(err){    
            res.send(false);  
        }else{
            res.send(true);  
        }
    })
});

app.post('/checkAdm', jsonParser,function(req, res) {
    jwt.verify(req.cookies.token, privatekey, {algorithms: 'RS256'}, function(err, decoded) {
        if(decoded.userType == 'adm'){
            res.send(true);   
        }else{
            res.send(false);  
        }
    })
});

app.get('/logout', (req, res) => {
    res.clearCookie("login");
    res.clearCookie("loginType");
    res.clearCookie("token");
	res.send('Cookie has been deleted')
});

app.get('/showUsers', (req, res) => {
    res.send(usuarios);
})

const server = app.listen(8000, () => { 
    console.log("http://localhost:8000");
});