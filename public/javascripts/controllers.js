/**
 * Created by laixiangran on 2016/3/18.
 * homepage: http://www.cnblogs.com/laixiangran/
 */

meanApp.controller("PollListCtrl", ["$scope", function($scope) {
    $scope.polls = [{
        id: "1",
        question: '我帅吗？',
        choices: [{ text: '非常帅' }, { text: '很帅' }, { text: '一般帅' }]
    }];
}]);

meanApp.controller("PollItemCtrl", ["$scope", function($scope) {
    $scope.poll = {};
    $scope.vote = function() {};
}]);

meanApp.controller("PollNewCtrl", ["$scope", function($scope) {
    $scope.poll = {
        question: '',
        choices: [{ text: '' }, { text: '' }, { text: '' }]
    };
    $scope.addChoice = function() {
        $scope.poll.choices.push({ text: '' });
    };
    $scope.createPoll = function() {};
}]);