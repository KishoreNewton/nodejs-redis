const express = require('express')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const redis = require('redis')

const app = express()

const client = redis.createClient()
client.on('connect', () => {
    console.log('redis server connected')
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    const title = 'Task List'
    client.lrange('tasks', 0, -1, (err, reply) => {
        res.render('index', {
            title,
            tasks: reply
        })
    })
})

app.post('/task/add', (req, res) => {
    const { task } = req.body
    client.rpush('tasks', task, (err, reply) => {
        if(err) throw new Error('Something went wrong')
        console.log('Task added successfully')
        res.redirect('/')
    })
})

app.post('/task/delete', (req, res) => {
    const tasksToDel = req.body.tasks
    client.lrange('tasks', 0 , -1, (err, tasks) => {
        for(let i = 0; i < tasks.length; i++) {
            if(tasksToDel.indexOf(tasks[i]) > -1) {
                client.lrem('tasks', 0, tasks[i], () => {
                    if(err) throw new Error('Something went wrong')
                })
            }
        }
        res.redirect('/')
    })
})

app.listen(3000, () => {
    console.log('Server started on port 3000')
})

module.exports = app