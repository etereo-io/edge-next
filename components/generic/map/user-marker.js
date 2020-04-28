import { Circle, Marker } from 'react-google-maps';
import React, { Component, Fragment } from 'react';

class UserMarker extends Component {

      constructor(props) {
        super(props);
        const { person: { id = null, position = null }, channel = null } = this.props;

        this.id = id;
        this.channel = channel;
        this.state = { position };
      }

      componentDidMount() {
        this.channel && this.channel.bind('transit', ({ person = {} }) => {
          const { id, position } = person;
          (id === this.id) && this.setState({ position });
        });
      }

      render() {

        const { radius } = this.props;
        const { position } = this.state;
        const regionOptions = { fillOpacity: 0.1, strokeWidth: 1, strokeOpacity: 0.2 };

        const MARKER_SIZE = new google.maps.Size(50, 70);
        const MARKER_ICON = 'https://i.imgur.com/Rhv5xQh.png';

        return <Fragment>
          <Marker position={position} title="You" options={{ icon: { url: MARKER_ICON, scaledSize: MARKER_SIZE } }} />
          <Circle center={position} radius={radius} options={regionOptions} />
        </Fragment>

      }
    };

    export default UserMarker;