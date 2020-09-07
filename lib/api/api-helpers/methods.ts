import { NextApiRequest, NextApiResponse } from 'next'

const defaultCb = (req, res) => {
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}

export enum METHODS {
  'GET' = 'GET',
  'POST' = 'POST',
  'PUT' = 'PUT',
  'DELETE' = 'DELETE',
}

export function getAction(method: METHODS): string {
  // TODO: See how to handle actions for updating documents from other users
  switch (method) {
    case METHODS.GET:
      return 'read'
    case METHODS.POST:
      return 'create'
    case METHODS.PUT:
      return 'update'
    case METHODS.DELETE:
      return 'delete'
    default:
      return ''
  }
}

type CALLBACK_KEY = Partial<'post' | 'get' | 'del' | 'put'>

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U]

export default async function(
  req: NextApiRequest,
  res: NextApiResponse,
  callbacks: AtLeastOne<
    { [key in CALLBACK_KEY]: (...args: any[]) => Promise<any> | void }
  >
) {
  try {
    switch (req.method as METHODS) {
      case METHODS.POST:
        callbacks.post ? await callbacks.post(req, res) : defaultCb(req, res)
        break

      case METHODS.GET:
        callbacks.get ? await callbacks.get(req, res) : defaultCb(req, res)
        break

      case METHODS.DELETE:
        callbacks.del ? await callbacks.del(req, res) : defaultCb(req, res)
        break

      case METHODS.PUT:
        callbacks.put ? await callbacks.put(req, res) : defaultCb(req, res)
        break

      default:
        defaultCb(req, res)
        break
    }
  } catch (e) {
    console.error('Internal server error', e)
    res.status(500).json({
      error: e,
    })
  }
}
