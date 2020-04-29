import React, { Component } from 'react';

import { Marker } from 'react-google-maps';

const BLACK_MARKER = 'https://i.imgur.com/8dOrls4.png?2';
const GREEN_MARKER = 'https://i.imgur.com/9v6uW8U.png';

class PersonMarker extends Component {

  constructor(props) {
    super(props);

    const {
      user: { id: userID, position: userPosition },
      person: { id = null, position = null },
      channel = null
    } = this.props;

    this.id = id;
    this.userID = userID;
    this.channel = channel;

    this.state = { position, userPosition };
  }

  componentDidMount() {
    this.channel && this.channel.bind('transit', ({ person = {} }) => {
      const { id, position } = person;
      (id === this.id) && this.setState({ position });
      (id === this.userID) && this.setState({ userPosition: position });
    });
  }

  render() {
    const { position } = this.state;
    const { person: { name }, withinRegion  } = this.props;

    const MARKER_SIZE = new google.maps.Size(25, 35);
    const MARKER_ICON = withinRegion ? GREEN_MARKER : BLACK_MARKER;

    return <Marker position={position} title={name} options={{ icon: { url: MARKER_ICON, scaledSize: MARKER_SIZE } }} />
  }

};

export default PersonMarker;