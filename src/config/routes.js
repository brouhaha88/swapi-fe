import App from '../client/App';
import Search from '../client/App/screens/Search';
import Films from '../client/App/screens/Films';
import Home from '../client/App/screens/Home';
import People from '../client/App/screens/People';
import Planets from '../client/App/screens/Planets';
import Species from '../client/App/screens/Species';
import Starships from '../client/App/screens/Starships';
import Vehicles from '../client/App/screens/Vehicles';
import ErrorPage from '../client/common/screens/Error';

export default [
  { component: App,
    routes: [
      { path: '/',
        exact: true,
        component: Home,
      },
      { path: '/search/:type/:query',
        component: Search,
      },
      { path: '/films',
        component: Films,
      },
      { path: '/people',
        component: People,
      },
      { path: '/planets',
        component: Planets,
      },
      { path: '/species',
        component: Species,
      },
      { path: '/starships',
        component: Starships,
      },
      { path: '/vehicles',
        component: Vehicles,
      },
      { path: '/:errorPage',
        component: ErrorPage,
      },
    ],
  },
];

if (module.hot) {
  module.hot.decline('../client');
}
