import React from 'react';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import AppContainer from 'grommet/components/App';

import {
  updateSearchType,
  updateSearchQuery,
  fetchSwapiTypes,
} from '../../ducks/search';

import SearchHeader from './components/SearchHeader';
import Sitemap from './components/Sitemap';

import './index.scss';

class App extends React.Component {
  componentDidMount() {
    if (!this.props.search.types.length) this.props.fetchSwapiTypes();
  }

  render() {
    return (
      <AppContainer centered={false}>
        <SearchHeader
          data={this.props.search}
          onTypeUpdate={this.props.updateSearchType}
          onQueryUpdate={this.props.updateSearchQuery}
        />
        {renderRoutes(this.props.route.routes)}
        <Sitemap />
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

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

ConnectedApp.fetchData = (store, payload) => store.dispatch(fetchSwapiTypes(payload));

export default ConnectedApp;
