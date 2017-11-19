import React from 'react';
import universal from 'react-universal-component';

const initComponent = component => universal(() => component, {
  loading: <span>Loading...</span>,
  error: <span>Error...</span>,
});

export default [{
  component: initComponent(import('../client/App')),
  routes: [{
    path: '/',
    exact: true,
    component: initComponent(import('../client/App/screens/Home')),
  }, {
    path: '/search',
    component: initComponent(import('../client/App/screens/Search')),
  }, {
    path: '/404',
    component: initComponent(import('../client/common/screens/Error')),
  }, {
    path: '/:type',
    component: initComponent(import('../client/App/screens/Resources')),
    routes: [{
      path: '/:type/:id',
      component: initComponent(import('../client/App/screens/Resources/screens/Resource')),
    }],
  }],
}];
