const
  axios = require('axios')

class CorePlugin {
  constructor () {
    this.context = null;

    this.config = {
      tramwayDataUrl: 'http://data.montpellier3m.fr/sites/default/files/ressources/TAM_MMM_TpsReel.csv'
    };

    this.controllers = {
      'tramway': {
        'update': 'tramwayUpdateData'
      }
    };

    this.routes = [
      { verb: 'get', url: '/tramway/update', controller: 'tramway', action: 'update' }
    ];
 }

  init (customConfig, context) {
    this.config = Object.assign(this.config, customConfig);
    this.context = context;
  }

  async tramwayUpdateData() {
    try {
      const result = await axios.get(this.config.tramwayDataUrl) 

      const [header, ...columns] = result.data.replace(/\r/g, '').split('\n').map(line => line.split(';'))
      
      columns.reduce((acc, value) => {
        
      }, {})

      console.log(header)
      console.log(columns)
      return columns
    } catch (error) {
      console.log(error);
      return Promise.reject(error)
    }
  }

}

module.exports = CorePlugin;
