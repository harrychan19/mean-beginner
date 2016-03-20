/**
 * Created by laixiangran on 2016/3/18.
 * homepage: http://www.cnblogs.com/laixiangran/
 */

meanApp.controller("PollListCtrl", [
    "$scope",
    "$location",
    "PollServer",
    function($scope, $location, PollServer) {
        $scope.polls = PollServer.queryPoll.queryAll();

        $scope.changePoll = function(pollId) {
            $scope.poll = PollServer.queryPoll.get({
                pollId: pollId
            });
        };

        $scope.addChoice = function() {
            $scope.poll.choices.push({
                text: ""
            });
        };

        $scope.updatePoll = function() {
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
                    var newPoll = new PollServer.updatePoll($scope.poll);
                    newPoll.$save(function(p, resp) {
                        if(!p.error) {
                            angular.element(".editModal").modal("hide");
                            $scope.polls = PollServer.queryPoll.queryAll();
                        } else {
                            alert("修改投票失败！");
                        }
                    });
                } else {
                    alert("你必须至少输入两个选项！");
                }
            } else {
                alert("你必须输入一个问题！");
            }
        };

        $scope.delPollById = function() {
            PollServer.deletePoll.get({pollId: $scope.poll._id}, function(data) {
                if (data) {
                    $scope.polls = PollServer.queryPoll.queryAll();
                    angular.element(".delModal").modal("hide");
                } else {
                    throw new Error(data);
                }
            });
        }
    }
]);

meanApp.controller("PollItemCtrl", [
    "$rootScope",
    "$scope",
    "PollServer",
    "socketServer",
    function($rootScope, $scope, PollServer, socketServer) {
        var pollId = $rootScope.$stateParams.pollId;

        $scope.val = 0;

        $scope.setStyle = function(val) {
            var proStyle = "progress-bar";
            if (val <= 30) {
                proStyle = "progress-bar progress-bar-success";
            } else if (val > 30 && val <= 60) {
                proStyle = "progress-bar progress-bar-warning";
            } else if (val > 60 && val <= 100) {
                proStyle = "progress-bar progress-bar-danger";
            }
            return proStyle;
        };

        $scope.poll = PollServer.queryPoll.get({
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
            console.log($scope.proStyle);
            var pollId = $scope.poll._id,
                choiceId = $scope.poll.userVote;
            if(choiceId) {
                var voteObj = {
                    poll_id: pollId,
                    choice: choiceId
                };
                socketServer.emit("send:vote", voteObj);
            } else {
                alert("你必须选择一项进行投票！");
            }
        };
    }
]);

meanApp.controller("PollNewCtrl", [
    "$scope",
    "$location",
    "PollServer",
    function($scope, $location, PollServer) {
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
                    var newPoll = new PollServer.queryPoll(poll);
                    newPoll.$save(function(p, resp) {
                        if(!p.error) {
                            $location.path("/polls");
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
    }
]);