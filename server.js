const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const path = require('path')
const cookieParser = require('cookie-parser');
const fs = require('fs')
const jwt = require("jsonwebtoken");

const homeController = require('./controllers/home')
const postsRouter = require('./routers/posts')
const apiRouter = require('./routers/api')
const notfound = require('./middleware/notfound')
const isUserAuthenticated = require('./middleware/auth')
const errorMiddleware = require('./middleware/errors')


app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.get('/', homeController.index)
app.get('/login', (req, res) => {
  if(req.cookies.session && jwt.verify(req.cookies.session, process.env.JWT_SECRET)){
    res.redirect('/admin')
    return
  }
  res.sendFile(path.resolve('./views/login.html'))
})
app.get('/logout', (req, res) => {
  res.clearCookie('session')
  res.clearCookie('user')
  res.redirect('/')
}
)

app.get('/admin', isUserAuthenticated, (req, res) => {

  let html = fs.readFileSync(path.resolve('./views/dashboard.html'), 'utf8');

  html = html.replace('{{ admin }}', req.cookies.user.username);
  const posts = fs.readFileSync(path.resolve('./db/posts.json'), 'utf8');
  const postList = JSON.parse(posts).map((post) => {
    return `<li style="display: flex; align-items: center; gap: 1rem">
    <span>ID: ${post.id}</span>
    <a href="/posts/${post.id}">${post.title}</a>
    <form action="/api/delete/${post.id}" method="POST">
    <input type="hidden" name="id" value="${post.id}">
    <input style='margin: 1rem 0;' type="submit" value="Cancella">   
    </form>
    </li>`
  }).join('')
  html = html.replace('{{ postList }}', postList);


  res.send(html)
})

app.use('/api', apiRouter)
app.use('/posts', postsRouter)

app.use(notfound)
app.use(errorMiddleware)
app.listen(port ?? 3000, () => {
  console.log(`Server running at http://localhost:${port}`)
})