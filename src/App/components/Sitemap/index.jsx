import React from 'react';
import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Footer from 'grommet/components/Footer';
import Menu from 'grommet/components/Menu';
import Paragraph from 'grommet/components/Paragraph';
import Title from 'grommet/components/Title';

import './index.scss';

class Sitemap extends React.Component {
  constructor(...args) {
    super(...args);

    this.copyrightYear = (new Date()).getUTCFullYear();
  }

  render() {
    return (
      <Footer
        className="swapi-sitemap"
        justify="between"
      >
        <Title>
          SWAPI
        </Title>
        <Box
          direction="row"
          align="center"
          pad={{ between: 'medium' }}
        >
          <Paragraph margin="none">
            infiman © {this.copyrightYear}
          </Paragraph>
          <Menu
            inline
            direction="row"
            size="small"
            dropAlign={{ right: 'right' }}
          >
            <Anchor
              reverse
              align="end"
              path={{ path: '/', index: true }}
            >
              Home
            </Anchor>
            <Anchor
              reverse
              align="end"
              path={{ path: '/films', index: true }}
            >
              Films
            </Anchor>
            <Anchor
              reverse
              align="end"
              path={{ path: '/people', index: true }}
            >
              People
            </Anchor>
            <Anchor
              reverse
              align="end"
              path={{ path: '/planets', index: true }}
            >
              Planets
            </Anchor>
            <Anchor
              reverse
              align="end"
              path={{ path: '/species', index: true }}
            >
              Species
            </Anchor>
            <Anchor
              reverse
              align="end"
              path={{ path: '/starships', index: true }}
            >
              Starships
            </Anchor>
            <Anchor
              reverse
              align="end"
              path={{ path: '/vehicles', index: true }}
            >
              Vehicles
            </Anchor>
          </Menu>
        </Box>
      </Footer>
    );
  }
}

export default Sitemap;
