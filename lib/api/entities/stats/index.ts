import { getDB } from '@lib/api/db'

export function findOneStats(options) {
  return getDB()
    .collection('stats')
    .findOne(options)
}

export function addStats(data) {
  return getDB()
    .collection('stats')
    .add(data)
}

export function updateOneStats(id, data) {
  return getDB()
    .collection('stats')
    .doc(id)
    .set(data)
}


export function deleteOneStats(options) {
  return getDB()
    .collection('stats')
    .remove(options, true)
}

export async function findStats(
  options = {}
) {
  return getDB()
    .collection('stats')
    .find(options)
}