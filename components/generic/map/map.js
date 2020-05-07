import { Fragment } from 'react'
import MapContainer from './map-container'

const API_KEY = process.env.NEXT_PUBLIC_GMAPS_API_KEY
const MAP_URL = `https://maps.googleapis.com/maps/api/js?${
  API_KEY ? 'key=' + API_KEY + '&' : ''
}v=3.exp&libraries=geometry`

function Map(props) {
  const containerStyles = {
    height: '400px',
    width: '100%',
    position: 'relative',
  }
  const loadingStyles = {
    height: '100%',
  }

  const defaultCenter = {
    lat: 37.774568,
    lng: -122.427324,
  }

  const defaultZoom = 14

  const people = [
    {
      position: {
        lat: 37.774568,
        lng: -122.427324,
      },
      id: 'me',
    },
    {
      position: {
        lat: 37.777011,
        lng: -122.442441,
      },
      id: '1',
    },
    {
      position: {
        lat: 37.766155,
        lng: -122.423202,
      },
      id: '2',
    },
    {
      position: {
        lat: 37.765613,
        lng: -122.428012,
      },
      id: '3',
    },
    {
      position: {
        lat: 37.769683,
        lng: -122.435913,
      },
      id: '4',
    },
    {
      position: {
        lat: 37.796275,
        lng: -122.423202,
      },
      id: '5',
    },
  ]

  const person = {
    id: 'me',
    position: {
      lat: 37.774568,
      lng: -122.427324,
    },
  }

  const radius = 1500

  return (
    <MapContainer
      googleMapURL={MAP_URL}
      loadingElement={<div style={loadingStyles} />}
      containerElement={<div style={containerStyles} />}
      mapElement={<div style={loadingStyles} />}
      person={person}
      people={people}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
      radius={radius}
      {...props}
    />
  )
}

export default Map
