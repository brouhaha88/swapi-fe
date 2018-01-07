import React from 'react';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import AppContainer from 'grommet/components/App';

import SearchHeader from './components/SearchHeader';
import SitemapFooter from './components/SitemapFooter';

import { getMetadataAppName, getMetadataAppDescription } from '../../ducks/metadata/app';
import {
  fetchResourceTypes,
  getMetadataResourceTypesKeys,
  getMetadataResourceTypesFetching,
  getMetadataResourceTypesError,
} from '../../ducks/metadata/resourceTypes';
import { push } from '../../ducks/router';

import favicon from './assets/fav.ico';
import './assets/index.sss';

class App extends React.Component {
  componentDidMount() {
    const { resourceTypesKeys, fetchResourceTypes: dispatchFetch } = this.props;

    if (!resourceTypesKeys.length) dispatchFetch();
  }

  render() {
    const {
      name,
      description,
      resourceTypesKeys,
      resourceTypesFetching,
      resourceTypesError,
      navigate,
      route,
    } = this.props;

    return (
      <AppContainer centered={false}>
        <Helmet>
          <title>{`${name} - ${description}`}</title>
          <link rel="icon" href={favicon} />
        </Helmet>
        <SearchHeader
          appName={name}
          appTypes={resourceTypesKeys}
          fetching={resourceTypesFetching}
          error={resourceTypesError}
          onUpdate={navigate}
        />
        {renderRoutes(route.routes)}
        <SitemapFooter
          appName={name}
          appTypes={resourceTypesKeys}
        />
      </AppContainer>
    );
  }
}

const mapStateToProps = state => ({
  name: getMetadataAppName(state),
  description: getMetadataAppDescription(state),
  resourceTypesKeys: getMetadataResourceTypesKeys(state),
  resourceTypesFetching: getMetadataResourceTypesFetching(state),
  resourceTypesError: getMetadataResourceTypesError(state),
});

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
