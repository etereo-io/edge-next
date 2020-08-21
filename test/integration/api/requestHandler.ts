import { createMocks } from 'node-mocks-http';

export default async function(handler, reqOptions ) {
  return new Promise(async (resolve, reject) => {
    const {
      req,
      res
    } = createMocks(reqOptions, {
      eventEmitter: require('events').EventEmitter
    });
    res.on('end', function() {
      resolve({
        statusCode: res.statusCode,
        body: res._getJSONData()
      })
    })
    
    try {
      await handler(req, res)
    } catch(e) {
      console.error(e)
      reject(e)
    }
  

  })
}