/**
 * Created by laixiangran on 2016/3/18.
 * homepage: http://www.cnblogs.com/laixiangran/
 */

meanApp.controller("PollListCtrl", ["$scope", "PollServer",
    function($scope, PollServer) {
        $scope.polls = PollServer.query();
}]);

meanApp.controller("PollItemCtrl", ["$rootScope", "$scope", "PollServer", "socketServer",
    function($rootScope, $scope, PollServer, socketServer) {
        var pollId = $rootScope.$stateParams.pollId;

        $scope.poll = PollServer.get({
            pollId: pollId
        });

        socketServer.on("myvote", function(data) {
            if(data._id === pollId) {
                $scope.poll = data;
            }
        });

        socketServer.on("vote", function(data) {
            if(data._id === pollId) {
                $scope.poll.choices = data.choices;
                $scope.poll.totalVotes = data.totalVotes;
            }
        });

        $scope.vote = function() {
            var pollId = $scope.poll._id,
                choiceId = $scope.poll.userVote;
            if(choiceId) {
                var voteObj = {
                    poll_id: pollId,
                    choice: choiceId
                };
                socketServer.emit("send:vote", voteObj);
            } else {
                alert("You must select an option to vote for");
            }
        };
}]);

meanApp.controller("PollNewCtrl", ["$scope", "$location", "PollServer", function($scope, $location, PollServer) {
    $scope.poll = {
        question: "",
        choices: [{text: ""}, {text: ""}, {text: ""}]
    };

    $scope.addChoice = function() {
        $scope.poll.choices.push({
            text: ""
        });
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
                var newPoll = new PollServer(poll);
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