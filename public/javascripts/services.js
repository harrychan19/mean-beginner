/**
 * Created by laixiangran on 2016/3/18
 * homepage£ºhttp://www.cnblogs.com/laixiangran/
 */
meanApp.factory("Poll", ["$resource", function($resource) {
        return $resource("polls/:pollId", {}, {
            query: {method: "GET", params: {pollId: "polls"}, isArray: true}
        })
    }]);