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

export default connect(mapStateToProps, () => ({}))(Resource);
