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
const adminRouter = require('./routers/admin')


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


app.use('/admin', adminRouter)
app.use('/api', apiRouter)
app.use('/posts', postsRouter)

app.use(notfound)
app.use(errorMiddleware)
app.listen(port ?? 3000, () => {
  console.log(`Server running at http://localhost:${port}`)
})