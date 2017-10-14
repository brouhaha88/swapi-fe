import App from '../App';
import Search from '../App/screens/Search';
import Films from '../App/screens/Films';
import Home from '../App/screens/Home';
import People from '../App/screens/People';
import Planets from '../App/screens/Planets';
import Species from '../App/screens/Species';
import Starships from '../App/screens/Starships';
import Vehicles from '../App/screens/Vehicles';
import ErrorPage from '../common/screens/Error';

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
