import angular from 'angular';
import IndexController from './controllers/IndexController';
import ngRoute from 'angular-route';
import uiRouter from 'angular-ui-router';

angular.module('app', [ngRoute, uiRouter, 'ng.jsoneditor'])
    .controller("IndexController", IndexController);
