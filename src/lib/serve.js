const express = require('express')
const http = require('http')
const app = express()
const serveIndex = require('serve-index')
const minimist = require('minimist')
const net = require('net')
const openBrowser = require('open')
const chalk = require('chalk')
const PORT = 9999

module.exports = async ({ name, options }) => {
    app.use('/', serveIndex('./'), express.static('./'))

    const server = http.createServer(app)

    const argv = minimist(process.argv.slice(3)) || {}
    const { p, port, o, open } = argv

    const serverPort = await portIsOccupied(p || port || PORT)
    const isOpen = o || open

    server.listen(serverPort, () => {
        isOpen && openBrowser(`http://localhost:${serverPort}`)
        console.log('   ' + chalk.green('服务已启动: ') + chalk.green.underline(`http://${getIPAdress()}:${serverPort}`))
    })

}
const portIsOccupied = (port) => {
    const server = net.createServer().listen(port)
    return new Promise((resolve, reject) => {
        server.on('listening', () => {
            server.close()
            resolve(port)
        })

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(portIsOccupied(port + 1))
            } else {
                reject(err)
            }
        })
    })
}

const getIPAdress = () => {
    var interfaces = require('os').networkInterfaces()
    for (var devName in interfaces) {
        var iface = interfaces[devName]
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i]
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address
            }
        }
    }
}
