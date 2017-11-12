import React from 'react';
import { connect } from 'react-redux';
import Box from 'grommet/components/Box';
import Headline from 'grommet/components/Headline';
import Meter from 'grommet/components/Meter';
import Section from 'grommet/components/Section';
import Tiles from 'grommet/components/Tiles';
import Value from 'grommet/components/Value';
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder';

import { startSearch } from '../../../../ducks/search';

import SearchPane from './components/SearchPane';

class Search extends React.Component {
  componentDidMount() {
    if (!this.props.search.results.length) this.props.startSearch();
  }

  componentWillReceiveProps(nextProps) {
    const { search } = this.props.location;

    if (nextProps.location.search !== search) {
      this.props.startSearch();
    }
  }

  get searchTiles() {
    const { t, results } = this.props.search;

    return (
      <Tiles fill>
        {
          results.map(
            item => <SearchPane key={item.url} type={t} data={item} />,
          )
        }
      </Tiles>
    );
  }

  get placeHolder() {
    const { t, q, fetching } = this.props.search;

    return fetching ?
      <ListPlaceholder /> :
      <Headline align="center">
        {`Cannot find "${q}" in ${t} collection. :(`}
      </Headline>;
  }

  get meter() {
    const { results, count, t } = this.props.search;

    return count ? (
      <Box align="center">
        <Meter value={(results.length * 100) / count} />
        <Value
          value={results.length}
          units={t}
          align="center"
        />
      </Box>
    ) :
      null;
  }

  render() {
    const { count } = this.props.search;

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

function mapStateToProps({ search }) {
  return {
    search,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    startSearch: payload => dispatch(startSearch(payload)),
  };
}

const ConnectedSearch = connect(mapStateToProps, mapDispatchToProps)(Search);

ConnectedSearch.fetchData = (store, payload) => store.dispatch(startSearch(payload));

export default ConnectedSearch;
