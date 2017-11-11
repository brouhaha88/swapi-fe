import React from 'react';
import Box from 'grommet/components/Box';
import Headline from 'grommet/components/Headline';
import Section from 'grommet/components/Section';

class Error extends React.Component {
  render() {
    return (
      <Section>
        <Box align="center">
          <Headline align="center">
            {`Oops! We cannot find "${this.props.location.pathname}"`}
          </Headline>
        </Box>
      </Section>
    );
  }
}

export default Error;
