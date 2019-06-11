const stopSignals = {
  SIGHUP: 1,
  SIGINT: 2,
  SIGQUIT: 3,
  SIGTERM: 15
}

const handleStopSignal = (server, signal) => {
  process.on(signal, async () => {
    console.log(`Process received a ${signal} signal`)
    await server.stop()

    const code = stopSignals[signal]
    console.log(`Server stopped by ${signal} with code ${code}`)
    process.exit(128 + code)
  })
}

module.exports = {
  plugin: {
    name: 'graceful-stop',
    register: (server) => {
      Object.keys(stopSignals).forEach(handleStopSignal.bind(this, server))
    }
  }
}
