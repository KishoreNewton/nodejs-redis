const express = require('express')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const redis = require('redis')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))