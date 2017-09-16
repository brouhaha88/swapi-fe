import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from '../config/store';

import AppContainer from '../common/components/AppContainer';
import Article from '../common/components/Article';

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
        <BrowserRouter>
          <AppContainer>
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
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
