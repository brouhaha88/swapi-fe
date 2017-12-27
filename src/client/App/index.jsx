import React from 'react';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import AppContainer from 'grommet/components/App';

import { fetchResourceTypes } from '../../ducks/metadata';
import { push } from '../../ducks/router';

import SearchHeader from './components/SearchHeader';
import SitemapFooter from './components/SitemapFooter';

import favicon from './assets/fav.ico';
import './assets/index.sss';

class App extends React.Component {
  componentDidMount() {
    const { metadata, fetchResourceTypes: dispatchFetch } = this.props;

    if (!metadata.resourceTypes.length) dispatchFetch();
  }

  render() {
    const { metadata, metadata: { app: { title, description } }, navigate, route } = this.props;

    return (
      <AppContainer centered={false}>
        <Helmet>
          <title>{`${title} - ${description}`}</title>
          <link rel="icon" href={favicon} />
        </Helmet>
        <SearchHeader
          title={title}
          data={metadata}
          onUpdate={navigate}
        />
        {renderRoutes(route.routes)}
        <SitemapFooter
          data={metadata}
        />
      </AppContainer>
    );
  }
}

const mapStateToProps = ({ metadata }) => ({ metadata });

const mapDispatchToProps = dispatch => ({
  fetchResourceTypes: payload => dispatch(fetchResourceTypes(payload)),
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

ConnectedApp.fetchData = (store, payload) => store.dispatch(fetchResourceTypes(payload));

export default ConnectedApp;
