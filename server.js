const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const path = require('path')
const cookieParser = require('cookie-parser');

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
  res.sendFile(path.resolve('./views/login.html'))
})
app.get('/admin', isUserAuthenticated, (req, res) => {
  res.sendFile(path.resolve('./views/dashboard.html'))
})

app.use('/api', apiRouter)
app.use('/posts', postsRouter)

app.use(notfound)
app.use(errorMiddleware)
app.listen(port ?? 3000, () => {
  console.log(`Server running at http://localhost:${port}`)
})