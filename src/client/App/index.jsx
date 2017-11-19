import React from 'react';
import universal from 'react-universal-component';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import AppContainer from 'grommet/components/App';

import { fetchSearchTypes } from '../../ducks/metadata';
import { push } from '../../ducks/router';

import SearchHeader from './components/SearchHeader';

import favicon from './assets/fav.ico';
import './assets/index.scss';

const UniversalComponent = universal(props => import(`./${props.page}`), {
  minDelay: 1200,
  loading: <span>Loading...</span>,
  error: <span>Error...</span>,
})

class App extends React.Component {
  componentDidMount() {
    if (!this.props.metadata.searchTypes.length) this.props.fetchSearchTypes();
  }

  render() {
    return (
      <AppContainer centered={false}>
        <Helmet>
          <meta charset="utf-8" />
          <title>SWAPI - The Star Wars FE</title>
          <link rel="icon" href={favicon} />
        </Helmet>
        <SearchHeader
          data={this.props.metadata}
          onUpdate={this.props.goToSearch}
        />
        {renderRoutes(this.props.route.routes)}
        <UniversalComponent page="components/SitemapFooter" />
      </AppContainer>
    );
  }
}

const mapStateToProps = ({ metadata }) => ({ metadata });

const mapDispatchToProps = dispatch => ({
  fetchSearchTypes: payload => dispatch(fetchSearchTypes(payload)),
  goToSearch: (payload) => {
    const { type, query } = payload;
    const searchPath = `/search?t=${type}&q=${query}`;

    return dispatch(push(searchPath));
  },
});

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

ConnectedApp.fetchData = (store, payload) => store.dispatch(fetchSearchTypes(payload));

export default ConnectedApp;
