import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps'

import { Fragment } from 'react'
import PersonMarker from './person-marker'
import UserMarker from './user-marker'

function MapContainer(props) {
  const withinRegion = (position, radius, point) => {
    const to = new google.maps.LatLng(position.lat, position.lng)
    const distance = google.maps.geometry.spherical.computeDistanceBetween
    const from = new google.maps.LatLng(point.lat, point.lng)
    return distance(from, to) <= radius
  }

  const { person, radius, people, channel } = props
  const userPosition = person.position

  return (
    <GoogleMap
      defaultZoom={props.defaultZoom}
      defaultCenter={props.defaultCenter}
    >
      <Fragment>
        {people.map((p, index) => {
          const props = { key: index, radius, person: p, channel }
          const isWithinRegion = withinRegion(userPosition, radius, p.position)

          return p.id === person.id ? (
            <UserMarker {...props} />
          ) : (
            <PersonMarker
              user={props.person}
              withinRegion={isWithinRegion}
              {...props}
            />
          )
        })}
      </Fragment>
    </GoogleMap>
  )
}

export default withScriptjs(withGoogleMap(MapContainer))
