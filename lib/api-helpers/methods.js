const defaultCb = (req, res) => {
  //  res.setHeader('Allow', ['GET', 'PUT'])
  res.status(405).end(`Method ${method} Not Allowed`);
}

export default function(
  req,
  res,
  callbacks = {}
) {
  try {

    switch(req.method) {
      case 'POST':
        callbacks.post ? callbacks.post(req, res) : defaultCb(req, res)
      break;

      case 'GET':
        callbacks.get ? callbacks.get(req, res) : defaultCb(req, res)
      break;

      case 'DELETE':
        callbacks.del ? callbacks.del(req, res) : defaultCb(req, res)
      break;

      case 'PUT': 
        callbacks.put ? callbacks.put(req, res) : defaultCb(req, res)
      break;

      default:
        defaultCb()
        break;
      
    }
  } catch (e) {
    console.error('Internal server error', e)
    res.status(500).json({
      error: e
    })
  }
}