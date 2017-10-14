import React from 'react';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import AppContainer from 'grommet/components/App';
import Article from 'grommet/components/Article';

import 'grommet/scss/vanilla/index.scss';

import {
  updateSearchType,
  updateSearchQuery,
  fetchSwapiTypes,
} from '../ducks/search';

import SearchHeader from './components/SearchHeader';
import Sitemap from './components/Sitemap';

class App extends React.Component {
  componentWillMount() {
    this.props.fetchSwapiTypes();
  }

  render() {
    return (
      <AppContainer centered={false}>
        <Article>
          <SearchHeader
            data={this.props.search}
            onTypeUpdate={this.props.updateSearchType}
            onQueryUpdate={this.props.updateSearchQuery}
          />
          {renderRoutes(this.props.route.routes)}
          <Sitemap />
        </Article>
      </AppContainer>
    );
  }
}

function mapStateToProps({ search }) {
  return {
    search,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSwapiTypes: payload => dispatch(fetchSwapiTypes(payload)),
    updateSearchType: payload => dispatch(updateSearchType(payload)),
    updateSearchQuery: payload => dispatch(updateSearchQuery(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
