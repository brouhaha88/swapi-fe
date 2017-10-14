import React from 'react';
import { renderRoutes } from 'react-router-config';
import AppContainer from 'grommet/components/App';
import Article from 'grommet/components/Article';

import 'grommet/scss/vanilla/index.scss';

import SearchHeader from './components/SearchHeader';
import Sitemap from './components/Sitemap';

class App extends React.Component {
  render() {
    return (
      <AppContainer centered={false}>
        <Article>
          <SearchHeader />
          {renderRoutes(this.props.route.routes)}
          <Sitemap />
        </Article>
      </AppContainer>
    );
  }
}

export default App;
