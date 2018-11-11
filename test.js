const fs = require('fs-extra')
const { Kuzzle } = require('kuzzle-sdk');

const kuzzle = new Kuzzle('websocket', { host: 'localhost', port: 7512 });

function callback (notification) {
  console.log(notification);
}

(async () => {
  try {
    await kuzzle.connect();

    const request = {
      controller: 'montpellier-realtime/tramway',
      action: 'listStops'
    }

    const response = await kuzzle.query(request)

    console.log(response.result)


    // await fs.writeFile('rt-courses.json', JSON.stringify(result.result))
  } catch (error) {
    console.log(error);
  } finally {
    kuzzle.disconnect()
  }
})()
