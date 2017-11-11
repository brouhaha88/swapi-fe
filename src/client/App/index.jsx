import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { renderRoutes } from 'react-router-config';
import AppContainer from 'grommet/components/App';

import {
  fetchSearchTypes,
} from '../../ducks/metadata';

import SearchHeader from './components/SearchHeader';
import Sitemap from './components/Sitemap';

import './index.scss';

class App extends React.Component {
  componentDidMount() {
    if (!this.props.metadata.searchTypes.length) this.props.fetchSearchTypes();
  }

  render() {
    return (
      <AppContainer centered={false}>
        <SearchHeader
          data={this.props.metadata}
          onUpdate={this.props.startSearch}
        />
        {renderRoutes(this.props.route.routes)}
        <Sitemap />
      </AppContainer>
    );
  }
}

function mapStateToProps({ metadata }) {
  return {
    metadata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSearchTypes: payload => dispatch(fetchSearchTypes(payload)),
    startSearch: (payload) => {
      const { type, query } = payload;
      const searchPath = `/search?t=${type}&q=${query}`;

      return dispatch(push(searchPath));
    },
  };
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

ConnectedApp.fetchData = (store, payload) => store.dispatch(fetchSearchTypes(payload));

export default ConnectedApp;
