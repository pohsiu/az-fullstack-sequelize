import React from 'react';
import { Switch } from 'react-router';
import EnhancedRoute from '~/components/routes/EnhancedRoute';
import PrivateRoute from '~/containers/routes/PrivateRoute';
import withRouteEvents from '~/components/withRouteEvents';

import MainFrame from '~/containers/MainFrame';
import Home from '~/containers/Home';
import SubContent01 from '~/containers/Home/SubContent01';
import SubContent02 from '~/containers/Home/SubContent02';

import Test from '~/containers/Test';
import TestContent from '~/containers/Test/TestContent';
import testCase00 from '~/test-cases/test-case-00';
import testCase01 from '~/test-cases/test-case-01';

import AsyncPage from '~/containers/AsyncPage';
import Login from '~/containers/Login';
import InjectorTest from '~/containers/InjectorTest';

import getListHierarchy from '~/containers/MainFrame/getListHierarchy';

let testCases = [testCase00, testCase01];
let getTestCaseRoutes = () => testCases.map((testCase, i) => {
  i = ('0'.repeat(3) + i).slice(-3);
  return {
    name: `case${i}`,
    path: `/test/case${i}`,
    component: (props) => (<TestContent testCase={testCase}></TestContent>),
    navbar: {
      title: `Case ${i}`,
    },
  }
});

export let routesDefine = {
  name: 'root',
  component: props => props.routeView, // or props => props.routeViews.default
  routeViews: [{
    switch: true,
    name: 'default',
    routes: [{
      name: 'redirect',
      path: '/',
      component: withRouteEvents({
        onEnter: ({history}) => {
          console.log('On enter root');
          history.replace({ pathname: '/home' });
        },
        onLeave: () => {
          console.log('On leave root');
        },
      })(null),
      exact: true,
    },
    {
      name: 'async',
      path: '/async',
      component: AsyncPage,
    },
    {
      name: 'injector-test',
      path: '/injector-test',
      routeClass: PrivateRoute,
      component: InjectorTest,
    },
    {
      name: 'login',
      path: '/login',
      component: Login,
    },
    {
      name: 'main',
      path: '/',
      routeClass: PrivateRoute,
      component: MainFrame,
      routeViews: [{
        switch: true,
        name: 'default',
        routes: [{
          name: 'home',
          path: '/home',
          component: Home, 
          // navbar: {
          //   title: 'Home',
          //   level: 0,
          //   // level: currentLevel => (currentLevel ? (currentLevel - 1) : 0),
          // },
          navbar: true,
          routeViews: [{
            routes: [{
              name: 'home-index',
              path: '/home',
              component: withRouteEvents({
                onEnter: ({history}) => {
                  history.replace({ pathname: '/home/sub01' });
                },
              })(null),
              exact: true,
            },
            {
              name: 'sub01',
              path: '/home/sub01',
              component: SubContent01,
              navbar: {
                title: 'Sub 01',
              },
            },
            {
              name: 'sub02',
              path: '/home/sub02',
              component: SubContent02,
              navbar: {
                title: 'Sub 02',
              },
            }],
          }],
        },
        {
          name: 'test',
          path: '/test',
          component: Test, 
          navbar: true,
          routeViews: [{
            routes: [{
              name: 'test-index',
              path: '/test',
              component: withRouteEvents({
                onEnter: ({history}) => {
                  history.replace({ pathname: '/test/case001' });
                },
              })(null),
              exact: true,
            },
            ...getTestCaseRoutes(),
            ],
          }],
        },
        {
          name: 'async-in-main',
          path: '/async-in-main',
          component: AsyncPage,
        }],
      }],
    }],
  }],
};

getListHierarchy(routesDefine);

function createRouteViewsFromDefine(childViewsDefine){
  let result = {};
  childViewsDefine.map(childViewDefine => {
    let switchChildren = childViewDefine.switch;
    let name = childViewDefine.name || 'default';
    result[name] = childViewDefine.routes.map(routeDefine => {
      return createRouteFromDefine(routeDefine);
    });
    if(switchChildren){
      result[name] = (
        <Switch>
          {result[name]}
        </Switch>
      );
    }
  });
  return result;
}

function createRouteFromDefine(routeDefine){
  let { name, routeClass, routeViews, ...rest } = routeDefine;
  let Route = routeDefine.routeClass || EnhancedRoute;
  routeViews = (routeViews && createRouteViewsFromDefine(routeViews)) || {};
  let routeView = routeViews.default;
  return (
    <Route key={name} {...rest} routeName={name} routeView={routeView} routeViews={routeViews}/>
  );
}

export default () => {
  return createRouteFromDefine(routesDefine);
}

