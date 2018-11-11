const
  tramwayStops = require('../../data/tramway_stops.json'),
  fs = require('fs'),
  path = require('path'),
  axios = require('axios'),
  moment = require('moment'),
  BaseController = require('./BaseController')

async function dump() {
  const result = await axios.get('http://data.montpellier3m.fr/sites/default/files/ressources/TAM_MMM_TpsReel.csv') 
  const fileName = `${Date.now().toString()}-tramway.csv`
  const filePath = path.join(__dirname, '../../data',fileName);
  console.log(filePath)
  fs.writeFileSync(filePath, JSON.stringify(result.data))
}

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
      { verb: 'get', url: '/stops', action: 'listStops' }
    ]

    setInterval(dump, 10 * 1000)
  }

  async listStops () {
    return tramwayStops
  }

  async update (request) {
    try {
      const result = await axios.get(this.config.tramwayDataUrl) 

      const [header, ...columns] = result.data.replace(/\r/g, '').split('\n').map(line => line.split(';'))
      
      const today = moment().startOf('day');
      const memo = {}

      const courses = columns.reduce((acc, course) => {        
        if (!tramwayStops[course[2]]) {
          if (course[2] && course[2].toString().length === 5 && course[2].toString()[0] === '4') {
            if (!memo[course[2]]) {
              memo[course[2]] =true
              console.log(`${course[2]} ${course[3]} does not exists`)
            }

          }
          return acc
        } else if (!acc[course[0]] && course[0]) {
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
      
      // const body = Object.entries(courses).map(([courseId, course]) => {
      //   return {
      //     _id: courseId,
      //     body: course
      //   }
      // }) 
      // console.log(body)
      // const response = await this.context.accessors.sdk.document.mCreateOrReplace(
      //   'montpellier',
      //   'tramway',
      //   body
      // )

      return columns
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
