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
      action: 'update'
    }

    const result = await kuzzle.query(request)
    await fs.writeFile('rt-courses.json', JSON.stringify(result.result))
  } catch (error) {
    console.log(error);
  } finally {
    kuzzle.disconnect()
  }
})()
