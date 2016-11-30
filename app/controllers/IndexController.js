/*global angular*/

import * as service from '../services/service';
import * as queries from '../services/queries';
import * as _ from 'lodash';

export default function ($scope) {
    var vm = this;
    vm.environmentFilter = '';
    vm.original = [];
    vm.contract = '';
    vm.textFilter = '';
    vm.jviewer = {
        options: {
            mode: 'code'
        }
    };
    vm.jviewerresults = {
        options: {
            mode: 'code'
        }
    };

    vm.standardQueries = queries.standardQueries();

    vm.dslQueryParsed = queries.getDsl();

    vm.environment = 'http://prelive-search.dezrez.com:9200/';
    vm.type = '_search';

    vm.switchEnvironment = () => {
        vm.getAliases();
    };

    vm.getAliases = () => {
        service.request(vm.environment, 'GET', '_aliases').end((err, {
            body
        }) => {
            vm.aliases = _.map(body, (k) => {
                return _.first(_.keys(k.aliases));
            }).filter((alias) => {
                return alias;
            });
            vm.alias = _.first(vm.aliases);
            vm.original = angular.copy(vm.aliases);
            $scope.$apply();
            vm.getMappings();
        });
    };

    vm.filter = () => {
        vm.aliases = vm.original;
        if (vm.textFilter) {
            vm.aliases = _.filter(vm.aliases, (alias) => {
                return alias.match(vm.textFilter);
            });
            vm.alias = _.first(vm.aliases);
            if (vm.alias) {
                vm.getMappings();
            }
        }
        vm.alias = _.first(vm.aliases);
    };


    vm.getMappings = () => {
        vm.contracts = [];
        service.request(vm.environment, 'GET', vm.alias).end((err, {
            body
        }) => {
            vm.contracts = _.sortBy(_.keys(body[_.first(_.keys(body))].mappings));
            vm.contract = _.first(vm.contracts);
            $scope.$apply();
        });
    };

    vm.loadTree = () => {
        try {
            vm.dslQueryParsed = JSON.parse(vm.dslQuery);
        } catch (e) {
            alert('Invalid JSON');
        }
    };

    vm.changeOptions = () => {
        vm.jviewer.options.mode = vm.jviewer.options.mode == 'tree' ? 'code' : 'tree';
    };

    vm.changeOptionsResults = () => {
        vm.jviewerresults.options.mode = vm.jviewerresults.options.mode == 'tree' ? 'code' : 'tree';
    };

    vm.getMapping = () => {
        service.request(vm.environment, 'GET', vm.alias + '/' + vm.contract + '/_mapping').end((err, data) => {
            vm.mapping = data.body;
            $scope.$apply();
        });
    };

    vm.handleStandardQueryChange = (query) => {
        vm.dslQueryParsed = query.data;
    };

    vm.getContract = () => {
        if (vm.alias && vm.contract && vm.contractId) {
            if (vm.parentId) {
                service.request(vm.environment, 'GET', vm.alias + '/' + vm.contract + '/' + vm.contractId + '?parentId=' + vm.parentId).end((err, data) => {
                    vm.dataContract = data.body._source;
                    $scope.$apply();
                });
            } else {
                service.request(vm.environment, 'GET', vm.alias + '/' + vm.contract + '/' + vm.contractId).end((err, data) => {
                    vm.dataContract = {
                        detect_noop: false,
                        doc: data.body._source
                    };
                    $scope.$apply();
                });
            }
        } else {
            alert('Need all data...');
        }
    };

    vm.updateContract = () => {
        if (vm.alias && vm.contract && vm.contractId) {
            if (vm.parentId) {
                service.request(vm.environment, 'PUT', vm.environment, 'GET', vm.alias + '/' + vm.contract + '/' + vm.contractId + '?parentId=' + vm.parentId, null, vm.dataContract).end(() => {
                    $scope.$apply();
                });
            } else {
                service.request(vm.environment, 'POST', vm.alias + '/' + vm.contract + '/' + vm.contractId + '/_update', null, vm.dataContract).end(() => {
                    alert('Contract Updated!');
                    $scope.$apply();
                });
            }
        } else {
            alert('Need all data...');
        }
    };

    vm.saveDSL = () => {
        sessionStorage.setItem('ES-DSL-QUERY', JSON.stringify(vm.dslQueryParsed));
    };

    vm.search = () => {
        if (vm.alias && vm.contract && vm.dslQueryParsed) {

            if (vm.type === '_search') {
                service.request(vm.environment, 'POST', vm.alias + '/' + vm.contract + '/_search', null, vm.dslQueryParsed).end((err, data) => {
                    vm.results = data.body;
                    $scope.$apply();
                });
            } else {
                service.request(vm.environment, 'GET', vm.alias + '/' + vm.contract + '/_mapping').end((err, data) => {
                    vm.results = data.body;
                    $scope.$apply();
                });
            }
        }
    };
}