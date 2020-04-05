import db from '../db'

export function findOneContent(type, options) {

}

export function addContent(type, data, options) {
  return db.collection(type)
    .add(data)
}

export function updateContent(type, data, options) {

}

export function findContent(type, options) {
  return db.collection(type)
    .get()
}

export function deleteContent(type, options) {

}