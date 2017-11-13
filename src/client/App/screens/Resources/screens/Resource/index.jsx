import React from 'react';

import Section from 'grommet/components/Section';

class Resource extends React.Component {
  render() {
    return (
      <Section>
        {this.props.location.pathname}
      </Section>
    );
  }
}

export default Resource;
