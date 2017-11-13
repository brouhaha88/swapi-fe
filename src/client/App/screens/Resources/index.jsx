import React from 'react';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';

import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import Tiles from 'grommet/components/Tiles';
import Headline from 'grommet/components/Headline';
import Meter from 'grommet/components/Meter';
import Value from 'grommet/components/Value';
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder';

// !!!!!!!
import SearchPane from '../Search/components/SearchPane';

import { fetchResources, fetchResourcesMore } from '../../../../ducks/resources';

class Resources extends React.Component {
  componentDidMount() {
    const { resources, match } = this.props;
    const { type: activeType } = match.params;

    if (!resources) {
      this.props.fetchResources({ activeType });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { pathname } = this.props.location;
    const { type: activeType } = nextProps.match.params;

    if (nextProps.location.pathname !== pathname) {
      nextProps.fetchResources({ activeType });
    }
  }

  get resourceTiles() {
    const { activeType, resources } = this.props;
    const { results, next, fetching } = resources || {};

    return (
      <Tiles
        fill
        onMore={next && !fetching ? () => this.props.fetchResourcesMore({ activeType }) : null}
      >
        {
          results.map(
            item => <SearchPane key={item.url} type={activeType} data={item} />,
          )
        }
      </Tiles>
    );
  }

  get placeholder() {
    const { activeType, fetching } = this.props;

    return fetching ?
      <ListPlaceholder /> :
      <Headline align="center">
        {`Cannot find "${activeType}" collection. :(`}
      </Headline>;
  }

  get meter() {
    const { activeType, resources } = this.props;
    const { results, count } = resources || {};

    return count ? (
      <Box align="center">
        <Meter value={(results.length * 100) / count} />
        <Value
          value={results.length}
          units={activeType}
          align="center"
        />
      </Box>
    ) :
      null;
  }

  render() {
    const { resources, route: { routes } } = this.props;
    const { count } = resources || {};
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
  resources,
  resources: {
    activeType,
    fetching,
  },
}, {
  match: {
    params,
  },
}) => ({
  fetching,
  activeType,
  resources: resources[params.type],
});

const mapDispatchToProps = dispatch => ({
  fetchResources: payload => dispatch(fetchResources(payload)),
  fetchResourcesMore: payload => dispatch(fetchResourcesMore(payload)),
});

const ConnectedResources = connect(mapStateToProps, mapDispatchToProps)(Resources);

ConnectedResources.fetchData = (store, payload) => store.dispatch(fetchResources(payload));

export default ConnectedResources;
