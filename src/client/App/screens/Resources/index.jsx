import React from 'react';

import { renderRoutes } from 'react-router-config';

import Section from 'grommet/components/Section';

class Resources extends React.Component {
  render() {
    return (
      <Section>
        {this.props.location.pathname}
        {renderRoutes(this.props.route.routes)}
      </Section>
    );
  }
}

export default Resources;
