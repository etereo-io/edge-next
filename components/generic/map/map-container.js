import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps';
import React, { Component, Fragment } from 'react';

import PersonMarker from './person-marker';
import UserMarker from './user-marker';

class MapContainer extends Component {

  withinRegion = (position, radius) => {
    const to = new google.maps.LatLng(position.lat, position.lng);
    const distance = google.maps.geometry.spherical.computeDistanceBetween;
    return point => {
      const from = new google.maps.LatLng(point.lat, point.lng);
      return distance(from, to) <= radius;
    }
  }

  render() {
    const { person: { id, position }, radius, people, channel } = this.props;

    return (
      <GoogleMap ref={elem => this.map = elem} zoom={15} center={position}>
        <Fragment>
          { people.map((person, index) => {

            const props = { key: index, radius, person, channel };
            const withinRegion = point => (position, radius) => this.withinRegion(position, radius)(point);

            return (person.id === id)
              ? <UserMarker {...props} />
              : <PersonMarker user={this.props.person} withinRegion={withinRegion} {...props} />

          }) }
        </Fragment>
      </GoogleMap>
    );
  }

};

export default withScriptjs(withGoogleMap(MapContainer));