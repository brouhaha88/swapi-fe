import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { renderRoutes } from 'react-router-config';

import Columns from 'grommet/components/Columns';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import Tiles from 'grommet/components/Tiles';
import Headline from 'grommet/components/Headline';
import Meter from 'grommet/components/Meter';
import Value from 'grommet/components/Value';
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder';

import ResourcePane from './components/ResourcePane';

import {
  push,
  getRouterLocationPathname,
  getRouterLocationSearch,
  getTypeFromRouterLocationPathname,
} from '../../../../ducks/router';
import {
  fetchOrSearchResources,
  fetchResourcesMore,
  getResourcesByType,
  getFetchingFromResourcesByType,
} from '../../../../ducks/resources';
import { fetchResourceSchemas } from '../../../../ducks/metadata/resourceSchemas';

class Resources extends React.Component {
  componentDidMount() {
    const {
      resources,
      fetchOrSearchResources: dispatchFetchFirst,
      fetchResourceSchemas: dispatchFetchSecond,
    } = this.props;

    if (!resources.results || !resources.results.length) {
      dispatchFetchFirst().then(() => dispatchFetchSecond());
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      activeType,
      locationSearch,
    } = this.props;
    const {
      fetchOrSearchResources: dispatchFetchFirst,
      fetchResourceSchemas: dispatchFetchSecond,
    } = nextProps;

    if (
      nextProps.activeType !== activeType ||
      nextProps.locationSearch !== locationSearch
    ) {
      dispatchFetchFirst().then(() => dispatchFetchSecond());
    }
  }

  get resourceTiles() {
    const { resources, activeType, fetching, navigate } = this.props;
    const { results, next } = resources;

    return (
      <Tiles
        fill
        onMore={
          next && !fetching
            ? () => this.props.fetchResourcesMore()
            : null
        }
      >
        {
          results.map(
            item => (
              <ResourcePane
                key={item.url}
                type={activeType}
                data={item}
                onClick={navigate}
              />
            ),
          )
        }
      </Tiles>
    );
  }

  get placeholder() {
    const { activeType, fetching } = this.props;

    return fetching
      ? <ListPlaceholder />
      : (
        <Headline align="center">
          {`Cannot find ${activeType} collection. :(`}
        </Headline>
      );
  }

  get meter() {
    const { resources, activeType } = this.props;
    const { results, count } = resources;

    return count
      ? (
        <Box align="center">
          <Meter value={(results.length * 100) / count} />
          <Value
            value={results.length}
            units={activeType}
            align="center"
          />
        </Box>
      )
      : null;
  }

  render() {
    const { resources, route, locationPathname, fetching } = this.props;
    const { routes } = route;
    const { count } = resources;

    if (resources && resources.error) {
      return <Redirect to={`/404?path=${locationPathname}`} />;
    }

    return (
      <Section>
        <Columns>
          <Box>
            {
              count
                ? this.resourceTiles
                : this.placeholder
            }
            {this.meter}
          </Box>
          <Box>
            {
              fetching
                ? null
                : renderRoutes(routes)
            }
          </Box>
        </Columns>
      </Section>
    );
  }
}

const mapStateToProps = (state) => {
  const activeType = getTypeFromRouterLocationPathname(state);

  return {
    activeType,
    locationSearch: getRouterLocationSearch(state),
    locationPathname: getRouterLocationPathname(state),
    fetching: getFetchingFromResourcesByType(state, activeType),
    resources: getResourcesByType(state, activeType),
  };
};

const mapDispatchToProps = dispatch => ({
  fetchOrSearchResources: payload => dispatch(fetchOrSearchResources(payload)),
  fetchResourcesMore: payload => dispatch(fetchResourcesMore(payload)),
  fetchResourceSchemas: payload => dispatch(fetchResourceSchemas(payload)),
  navigate: (payload) => {
    const { id, type } = payload;
    const path = `${type}/${btoa(id)}`;

    return dispatch(push(path));
  },
});

const ConnectedResources = connect(mapStateToProps, mapDispatchToProps)(Resources);

ConnectedResources.fetchData = (store, payload) =>
  store.dispatch(fetchOrSearchResources(payload)).then(() =>
    store.dispatch(fetchResourceSchemas()),
  );

export default ConnectedResources;
