import React from 'react';
import { connect } from 'react-redux';

import Section from 'grommet/components/Section';

class Resource extends React.Component {
  render() {
    return (
      <Section>
        {this.props.router.location.pathname}
      </Section>
    );
  }
}

const mapStateToProps = ({ router }) => ({ router });

const ConnectedResource = connect(mapStateToProps, () => ({}))(Resource);

export default ConnectedResource;
