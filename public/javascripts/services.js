/**
 * Created by laixiangran on 2016/3/18
 * homepage£ºhttp://www.cnblogs.com/laixiangran/
 */

meanApp.factory("PollServer", ["$resource", function($resource) {
    return $resource("polls/:pollId", {}, {
        query: {
            method: "GET",
            params: {
                pollId: "polls"
            },
            isArray: true
        }
    })
}]).
factory("socketServer", ["$rootScope", function($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    }
}]);