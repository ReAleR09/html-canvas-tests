const path = require('path');

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'dist'),
    prefix: '/', // optional: default '/'
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()