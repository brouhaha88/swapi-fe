import React from 'react';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import AppContainer from 'grommet/components/App';

import { fetchSearchTypes } from '../../ducks/metadata';
import { push } from '../../ducks/router';

import SearchHeader from './components/SearchHeader';
import SitemapFooter from './components/SitemapFooter';

import favicon from './assets/fav.ico';
import './assets/index.scss';

class App extends React.Component {
  componentDidMount() {
    if (!this.props.metadata.searchTypes.length) this.props.fetchSearchTypes();
  }

  render() {
    return (
      <AppContainer centered={false}>
        <Helmet>
          <title>SWAPI - The Star Wars FE</title>
          <link rel="icon" href={favicon} />
        </Helmet>
        <SearchHeader
          data={this.props.metadata}
          onUpdate={this.props.navigate}
        />
        {renderRoutes(this.props.route.routes)}
        <SitemapFooter
          data={this.props.metadata}
        />
      </AppContainer>
    );
  }
}

const mapStateToProps = ({ metadata }) => ({ metadata });

const mapDispatchToProps = dispatch => ({
  fetchSearchTypes: payload => dispatch(fetchSearchTypes(payload)),
  navigate: (payload) => {
    const { type, query } = payload;
    let searchPath = `/${type}`;

    if (query) {
      searchPath = `${searchPath}?q=${query}`;
    }

    return dispatch(push(searchPath));
  },
});

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

ConnectedApp.fetchData = (store, payload) => store.dispatch(fetchSearchTypes(payload));

export default ConnectedApp;
