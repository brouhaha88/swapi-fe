import App from '../client/App';
import Home from '../client/App/screens/Home';
import Search from '../client/App/screens/Search';
import Resources from '../client/App/screens/Resources';
import Resource from '../client/App/screens/Resources/screens/Resource';
import Error from '../client/common/screens/Error';

export default [{
  component: App,
  routes: [{
    path: '/',
    exact: true,
    component: Home,
  }, {
    path: '/search',
    component: Search,
  }, {
    path: '/404',
    component: Error,
  }, {
    path: '/:type',
    component: Resources,
    routes: [{
      path: '/:type/:id',
      component: Resource,
    }],
  }],
}];
