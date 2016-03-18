/**
 * Created by laixiangran on 2016/3/18.
 * homepage: http://www.cnblogs.com/laixiangran/
 */

meanApp.controller("PollListCtrl", ["$scope", "Poll", function($scope, Poll) {
    $scope.polls = Poll.query();
}]);

meanApp.controller("PollItemCtrl", ["$rootScope", "$scope", "Poll", function($rootScope, $scope, Poll) {
    $scope.poll = Poll.get({pollId: $rootScope.$stateParams.pollId});
    $scope.vote = function() {};
}]);

meanApp.controller("PollNewCtrl", ["$scope", "$location", "Poll", function($scope, $location, Poll) {
    $scope.poll = {
        question: "",
        choices: [ { text: "" }, { text: "" }, { text: "" }]
    };
    $scope.addChoice = function() {
        $scope.poll.choices.push({ text: "" });
    };
    $scope.createPoll = function() {
        var poll = $scope.poll;
        if(poll.question.length > 0) {
            var choiceCount = 0;
            for(var i = 0, ln = poll.choices.length; i < ln; i++) {
                var choice = poll.choices[i];
                if(choice.text.length > 0) {
                    choiceCount++
                }
            }
            if(choiceCount > 1) {
                var newPoll = new Poll(poll);
                newPoll.$save(function(p, resp) {
                    if(!p.error) {
                        $location.path("polls");
                    } else {
                        alert("创建新投票失败！");
                    }
                });
            } else {
                alert("你必须至少输入两个选项！");
            }
        } else {
            alert("你必须输入一个问题！");
        }
    };
}]);