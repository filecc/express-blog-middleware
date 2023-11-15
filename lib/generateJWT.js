const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');


function generateJWT(req, res) {

    const users = JSON.parse(fs.readFileSync(path.resolve('./db/users.json'), 'utf8'));
    const profile = users.find((user) => user.username == req.body.username && user.password == req.body.password);

    if(!profile) {
       let html = fs.readFileSync(path.resolve('./views/500.html'), 'utf8');
       html.replace('{{ message }}', 'Email o password non validi');
       res.status(401).send(`<h1>Email o password non validi</h1><a href="/login">Riprova</a>`)
        return;
    }

    const payload = {
        id: profile.id,
        name: profile.name,
        username: profile.username,
        email: profile.email,
    }

    const token = jwt.sign({user: {...payload}}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('user', payload, { httpOnly: true });
   
    return token;
}

module.exports = generateJWT;