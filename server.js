const express = require('express')
const mongoose = require('mongoose')
const HashUrl = require('./models/hashUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlhashing', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const hashUrls = await HashUrl.find()
  res.render('index', { hashUrls: hashUrls })
})

app.post('/hashUrls', async (req, res) => {
  await HashUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const hashUrl = await HashUrl.findOne({ hash : req.params.shortUrl })
  if (hashUrl == null) return res.sendStatus(404)

  hashUrl.clicks++
  hashUrl.save()

  res.redirect(hashUrl.full)
})

app.listen(process.env.PORT || 5000);