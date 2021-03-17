module.exports = {
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 2000
    return config
  }
}