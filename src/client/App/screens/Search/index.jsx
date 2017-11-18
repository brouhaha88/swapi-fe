import React from 'react';
import { connect } from 'react-redux';
import Box from 'grommet/components/Box';
import Headline from 'grommet/components/Headline';
import Meter from 'grommet/components/Meter';
import Section from 'grommet/components/Section';
import Tiles from 'grommet/components/Tiles';
import Value from 'grommet/components/Value';
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder';

import { startSearch, startSearchMore } from '../../../../ducks/search';

import SearchPane from './components/SearchPane';

class Search extends React.Component {
  componentDidMount() {
    if (!this.props.search.results.length) this.props.startSearch();
  }

  componentWillReceiveProps(nextProps) {
    const { search } = this.props.location;

    if (nextProps.location.search !== search) {
      nextProps.startSearch();
    }
  }

  get searchTiles() {
    const { type, results, next, fetching } = this.props.search;

    return (
      <Tiles
        fill
        onMore={
          next && !fetching
            ? () => this.props.startSearchMore()
            : null
        }
      >
        {
          results.map(
            item => <SearchPane key={item.url} type={type} data={item} />,
          )
        }
      </Tiles>
    );
  }

  get placeholder() {
    const { type, query, fetching } = this.props.search;

    return fetching
      ? <ListPlaceholder />
      : (
        <Headline align="center">
          {`Cannot find "${query}" in ${type} collection. :(`}
        </Headline>
      );
  }

  get meter() {
    const { results, count, type } = this.props.search;

    return count
      ? (
        <Box align="center">
          <Meter value={(results.length * 100) / count} />
          <Value
            value={results.length}
            units={type}
            align="center"
          />
        </Box>
      )
      : null;
  }

  render() {
    const { count } = this.props.search;

    return (
      <Section>
        <Box align="center">
          {
            count
              ? this.searchTiles
              : this.placeholder
          }
        </Box>
        {this.meter}
      </Section>
    );
  }
}

const mapStateToProps = ({ search }) => ({ search });

const mapDispatchToProps = dispatch => ({
  startSearch: payload => dispatch(startSearch(payload)),
  startSearchMore: payload => dispatch(startSearchMore(payload)),
});

const ConnectedSearch = connect(mapStateToProps, mapDispatchToProps)(Search);

ConnectedSearch.fetchData = (store, payload) => store.dispatch(startSearch(payload));

export default ConnectedSearch;
