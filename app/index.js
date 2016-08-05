import * as routes from './routes/routes';
import angular from 'angular';
import IndexController from './controllers/IndexController';
import ngRoute from 'angular-route';
import routesProvider from './routes/routesProvider';
import uiRouter from 'angular-ui-router';

angular.module('app', [ngRoute, uiRouter, 'ng.jsoneditor'])
    .controller("IndexController", IndexController)
    .provider('routesProvider', routesProvider)
    .run(bootstrap)
    .config(['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode(true);
    }]);;

function bootstrap(routesProvider) {
	sessionStorage.clear();
    routesProvider.configureStates(routes.routes);
}
