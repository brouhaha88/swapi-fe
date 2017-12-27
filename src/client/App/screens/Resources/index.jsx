import qs from 'qs';

import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { renderRoutes } from 'react-router-config';

import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import Tiles from 'grommet/components/Tiles';
import Headline from 'grommet/components/Headline';
import Meter from 'grommet/components/Meter';
import Value from 'grommet/components/Value';
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder';

import ResourcePane from './components/ResourcePane';

import { fetchResources, searchResources, fetchResourcesMore } from '../../../../ducks/resources';

class Resources extends React.Component {
  componentDidMount() {
    const { q: query } = qs.parse(this.props.router.location.search, { ignoreQueryPrefix: true });

    if (query) {
      this.props.searchResources();
    } else {
      this.props.fetchResources();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { pathname, search } = this.props.router.location;
    const { q: query } = qs.parse(this.props.router.location.search, { ignoreQueryPrefix: true });

    if (
      nextProps.router.location.pathname !== pathname ||
      nextProps.router.location.search !== search
    ) {
      if (query) {
        nextProps.searchResources();
      } else {
        nextProps.fetchResources();
      }
    }
  }

  get resourceTiles() {
    const { resources, activeType } = this.props;
    const { results, next, fetching } = resources || {};

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
            item => <ResourcePane key={item.url} type={activeType} data={item} />,
          )
        }
      </Tiles>
    );
  }

  get placeholder() {
    const { fetching, activeType } = this.props;

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
    const { results, count } = resources || {};

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
    const { resources, route: { routes }, router: { location: { pathname } } } = this.props;
    const { count } = resources || {};

    if (resources && resources.error) {
      return <Redirect to={`/404?path=${pathname}`} />;
    }

    return (
      <Section>
        <Box align="center">
          {
            count
              ? this.resourceTiles
              : this.placeholder
          }
        </Box>
        {this.meter}
        {renderRoutes(routes)}
      </Section>
    );
  }
}

const mapStateToProps = ({
  router,
  resources,
  resources: {
    fetching,
  },
}) => {
  const activeType = router.location.pathname.replace('/', '');

  return {
    router,
    fetching,
    activeType,
    resources: resources[activeType],
  };
};

const mapDispatchToProps = dispatch => ({
  fetchResources: payload => dispatch(fetchResources(payload)),
  searchResources: payload => dispatch(searchResources(payload)),
  fetchResourcesMore: payload => dispatch(fetchResourcesMore(payload)),
});

const ConnectedResources = connect(mapStateToProps, mapDispatchToProps)(Resources);

ConnectedResources.fetchData = (store, payload) => store.dispatch(fetchResources(payload));

export default ConnectedResources;
