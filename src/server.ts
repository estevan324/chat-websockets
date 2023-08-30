import express from 'express'
import http from 'http'
import path from 'path'
import { Server } from 'socket.io'

import router from './config/routes'

const app = express()
const server = http.createServer(app)
const serverSocket = new Server(server)

app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(router)

server.listen(3000, () => {
    console.log('Server is running on port 3000')
})

serverSocket.on('connection', (socket) => {

    socket.on('login', (nickname: string) => {
        console.log(`Client connected: ${nickname}`)
        serverSocket.emit('chat-message', `${nickname} has joined the chat!`)

        socket.data.nickname = nickname
    })

    socket.on('chat-message', (message: string) => {
        console.log(`Message received from client ${socket.id}: ${message}`)

        socket.broadcast.emit('chat-message', `${socket.data.nickname}: ${message}`)
    })

    socket.on('status', (status: string) => {
        socket.broadcast.emit('status', status)
    })
})