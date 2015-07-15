app.controller('usercontroller', ['$scope', 'userservice', function ($scope, userservice) {
    $scope.onFileSelect=function($files){
        $scope.image=$files;
    }
    $scope.getValues = function () {
        userservice.getValues().then(function (response) {
        debugger;
        $scope.contactList = response.data;
    }, function (error) { 
        alert(error);
    });
    };

     $scope.edit = function (item) {
         userservice.edit(item._id).then(function (response) {
             debugger;
           
         }, function (error) {
             alert(error);
         });
         $scope.getValues();
        // $scope.user = item;
   
    };
     $scope.delUsr = function (item)
     {
         userservice.delUsr(item).then(function (response) {
             debugger;
             $scope.getValues();
         }, function (error) {
             alert(error);
         });
     }
    $scope.image=null;

    //$scope.getValues();
    $scope.addContact = function () {
        userservice.addValues($scope.user).then(function (response) {
        debugger;
   //   $scope.getValues();
    }, function (error) { 
        alert(error);
    });
    };

    $scope.signin = function () {
        userservice.signin($scope.login).then(function (response) {
            debugger;
          
        }, function (error) {
            alert(error);
        });
    };

    $scope.register = function () {
        userservice.register($scope.register,$scope.image).then(function (response) {
            debugger;

        }, function (error) {
            alert(error);
        });
    };

}]);