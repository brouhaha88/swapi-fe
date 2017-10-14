import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import AppContainer from 'grommet/components/App';
import Article from 'grommet/components/Article';

import 'grommet/scss/vanilla/index.scss';

import { store, history } from '../config/redux';

import SearchHeader from './components/SearchHeader';
import Sitemap from './components/Sitemap';

import Search from './screens/Search';
import Films from './screens/Films';
import Home from './screens/Home';
import People from './screens/People';
import Planets from './screens/Planets';
import Species from './screens/Species';
import Starships from './screens/Starships';
import Vehicles from './screens/Vehicles';
import Error from '../common/screens/Error';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <AppContainer centered={false}>
            <Article>
              <SearchHeader />
              <Switch>
                <Route exact path="/" component={Home} />
                <Route strict path="/search/:type/:query" component={Search} />
                <Route path="/films" component={Films} />
                <Route path="/people" component={People} />
                <Route path="/planets" component={Planets} />
                <Route path="/species" component={Species} />
                <Route path="/starships" component={Starships} />
                <Route path="/vehicles" component={Vehicles} />
                <Route path="/:errorPage" component={Error} />
              </Switch>
              <Sitemap />
            </Article>
          </AppContainer>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
