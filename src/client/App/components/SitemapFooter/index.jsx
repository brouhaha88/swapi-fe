import React from 'react';
import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Footer from 'grommet/components/Footer';
import Menu from 'grommet/components/Menu';
import Paragraph from 'grommet/components/Paragraph';
import Title from 'grommet/components/Title';

import './assets/index.scss';

class SitemapFooter extends React.Component {
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
              className="swapi-sitemap-anchor"
            >
              home
            </Anchor>
            {
              this.props.data.searchTypes.map(type => (
                <Anchor
                  reverse
                  align="end"
                  path={{ path: `/${type}`, index: true }}
                  className="swapi-sitemap-anchor"
                >
                  {type}
                </Anchor>
              ))
            }
          </Menu>
        </Box>
      </Footer>
    );
  }
}

export default SitemapFooter;
