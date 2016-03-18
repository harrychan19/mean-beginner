/**
 * Created by laixiangran on 2016/3/18.
 * homepage: http://www.cnblogs.com/laixiangran/
 */

var meanApp = angular.module("meanApp", ["ui.router", "ngResource"]);

meanApp.run(["$rootScope",
    "$state",
    "$stateParams",
    function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }
]);

meanApp.config(["$stateProvider",
    "$urlRouterProvider",
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/polls");
        $stateProvider
            .state("new", {
                url: "/new",
                templateUrl: "/partials/new.html",
                controller: "PollNewCtrl"
            })
            .state("poll", {
                url: "/poll/:pollId",
                templateUrl: "/partials/item.html",
                controller: "PollItemCtrl"
            })
            .state("polls", {
                url: "/polls",
                templateUrl: "/partials/list.html",
                controller: "PollListCtrl"
            });
    }
]);