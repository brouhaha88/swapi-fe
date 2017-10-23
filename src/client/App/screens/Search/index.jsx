import React from 'react';
import { connect } from 'react-redux';
import Box from 'grommet/components/Box';
import Headline from 'grommet/components/Headline';
import Meter from 'grommet/components/Meter';
import Section from 'grommet/components/Section';
import Tiles from 'grommet/components/Tiles';
import Value from 'grommet/components/Value';
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder';

import { searchSwapi } from '../../../../ducks/searchResults';

import SearchPane from './components/SearchPane';

class Search extends React.Component {
  componentDidMount() {
    if (!this.props.searchResults.results.length) this.props.searchSwapi();
  }

  componentWillReceiveProps(nextProps) {
    const { type, query } = this.props.search;

    if (nextProps.search.type !== type || nextProps.search.query !== query) {
      this.props.searchSwapi();
    }
  }

  get searchTiles() {
    const { type } = this.props.search;
    const { results } = this.props.searchResults;

    return (
      <Tiles fill>
        {
          results.map(
            item => <SearchPane key={item.url} type={type} data={item} />,
          )
        }
      </Tiles>
    );
  }

  get placeHolder() {
    const { type, query } = this.props.search;
    const { fetching } = this.props.searchResults;

    return fetching ?
      <ListPlaceholder /> :
      <Headline align="center">
        {`Cannot find "${query}" in ${type} collection. :(`}
      </Headline>;
  }

  get meter() {
    const { type } = this.props.search;
    const { results, count } = this.props.searchResults;

    return count ? (
      <Box align="center">
        <Meter value={(results.length * 100) / count} />
        <Value
          value={results.length}
          units={type}
          align="center"
        />
      </Box>
    ) :
      null;
  }

  render() {
    const { count } = this.props.searchResults;

    return (
      <Section>
        <Box align="center">
          {
            count
              ? this.searchTiles
              : this.placeHolder
          }
        </Box>
        {this.meter}
      </Section>
    );
  }
}

function mapStateToProps({ searchResults, search }) {
  return {
    search,
    searchResults,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchSwapi: payload => dispatch(searchSwapi(payload)),
  };
}

const ConnectedSearch = connect(mapStateToProps, mapDispatchToProps)(Search);

ConnectedSearch.fetchData = (store, payload) => store.dispatch(searchSwapi(payload));

export default ConnectedSearch;
