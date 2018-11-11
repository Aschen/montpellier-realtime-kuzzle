const
  tramwayStops = require('../../data/tramway_stops.json'),
  fs = require('fs'),
  axios = require('axios'),
  moment = require('moment'),
  BaseController = require('./BaseController')

/**
 * @class TramwayController
 * @extends BaseController
 */
class TramwayController extends BaseController {
  constructor (context, config) {
    super(context, config)

    this.config = {
      tramwayDataUrl: 'http://data.montpellier3m.fr/sites/default/files/ressources/TAM_MMM_TpsReel.csv'
    };

    this.name = 'tramway'

    this.actions = [
      'update',
      'listStops'
    ]

    this.routes = [
      { verb: 'get', url: '/update', action: 'update' },
      { verb: 'get', url: '/stops', action: 'listStops' },
    ]

//    this.stops = JSON.parse(fs.readFileSync('../../stops.json'))
  }

  async listStops () {
    return tramwayStops
  }

  async update (request) {
    try {
      const result = await axios.get(this.config.tramwayDataUrl) 

      const [header, ...columns] = result.data.replace(/\r/g, '').split('\n').map(line => line.split(';'))
      
      //course	   stop_code stop_id	stop_name	route_short_name	trip_headsign	direction_id	departure_time	is_theorical	delay_sec	dest_ar_code
      const today = moment().startOf('day');

      const data = columns.reduce((acc, course) => {
        if (!acc[course[0]] && course[0]) {
          return Object.assign(acc, {
            [course[0]]: {
              stopName: course[3],
              stopId: course[2],
              direction: course[6],
              directionName: course[5],
              departureTime: course[7],
              departureTimestamp: this._getTimestamp(today, course[7])           
            }
          })  
        } else if (acc[course[0]] && acc[course[0]].departureTime > course[7]) {
          return Object.assign(acc, {
            [course[0]]: {
              stopName: course[3],
              stopId: course[2],
              direction: course[6],
              directionName: course[5],
              departureTime: course[7],
              departureTimestamp: this._getTimestamp(today, course[7])                  
            }
          })  
        } else {
          return acc
        }
      }, {})
      
      return data
    } catch (error) {
      console.log(error);
      return Promise.reject(error)
    }
  }

  _getTimestamp(today, timeString) {
    const [h, m, s] = timeString.split(':')

    return today.hours(h).minutes(m).seconds(s).unix()
  }
}

module.exports = TramwayController
