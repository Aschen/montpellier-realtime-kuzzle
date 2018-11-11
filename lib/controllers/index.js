const
  TramwayController = require('./TramwayController')

/**
 * @param {KuzzlePluginContext} context
 * @param {object} config
 * @returns {ControllerImplementations}
 */
module.exports = (context, config) => ({
  tramway: new TramwayController(context, config)
})
