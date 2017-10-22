import React from 'react';
import Box from 'grommet/components/Box';
import Headline from 'grommet/components/Headline';
import Hero from 'grommet/components/Hero';
import Image from 'grommet/components/Image';

import TypeAhead from './components/TypeAhead';

import hero from './assets/hero.jpg';

class Home extends React.Component {
  render() {
    return (
      <Hero
        background={
          <Image
            src={hero}
            fit="cover"
            full
          />
        }
        backgroundColorIndex="dark"
        size="large"
      >
        <Box>
          <Headline
            margin="none"
            size="xlarge"
            strong
          >
            <TypeAhead sentence="FEEL THE FORCE" />
          </Headline>
        </Box>
      </Hero>
    );
  }
}

export default Home;
