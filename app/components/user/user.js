/**
 *  User js
 */
var userApp = angular.module('userApp', []);

/**
 *  range filter
 *  return from 1 to total number array 
 */
userApp.filter('range', function() {
    return function(input, total) {
      total = parseInt(total);
  
      for (var i = 1; i <= total; i++) {
        input.push(i);
      }
  
      return input;
    };
  });

/**
*  user app controller : userCtrl 
*/
userApp.controller('userCtrl', function($scope, $http)
{
    $scope.pageIndex = 1;   //page no. 
    $scope.pageSize = 10;   //row number of page
    $scope.total = 0;       //total number of data
    $scope.totalPages = 1;  //total number og page
    $scope.dataSource = []; //data source

    $scope.key;             //search key word
    $scope.name;            //user name
    $scope.phone;           //user phone
    $scope.address;         //user address
    $scope.editId;          //edit userId
    $scope.title;           //modal title

    $scope.nameErr = null;  //error message of name
    $scope.phoneErr = null; //error message of phone
    $scope.keyErr = null;   //error message of search key word

    /**
     * init funciton
     * load first page users
     */
    $scope.init = function() {
        var url = getUsersUrl +　'/' + $scope.pageIndex + '/' + $scope.pageSize;
        $http.get(url).then((result) => {
            if(result.status === 200) {
                var customerResult = result.data;
                if(customerResult.statusCode === 0) {
                    var pageResult = customerResult.data;
                    $scope.dataSource = pageResult.data;
                    $scope.total = pageResult.total;
                    $scope.totalPages = Math.ceil($scope.total / $scope.pageSize);
                }
            }
        });
    }


    /**
     * search user by key word (phone)
     */
    $scope.search = function() {
        var errMessage = $scope.checkPhone($scope.key);
        if(errMessage) {
            $scope.keyErr = errMessage;
            return;
        }

        var url = searchUserUrl + '/' + $scope.key;
        $http.get(url).then((result) => {
            if(result.status === 200) {
                var customerResult = result.data;
                if(customerResult.statusCode === 0) {
                    $scope.dataSource = [customerResult.data];
                    $scope.total = 1;
                    $scope.pageIndex = 1;
                    $scope.totalPages = 1;
                } else {
                    $scope.handleFail(customerResult.description);
                }
            } else {
    
            }
        });
    }

    /**
     * remove user by id
     * 
     * @param {number} id 
     */
    $scope.removeUser = function(id) {
        var url = delUserUrl + '/' + id;
        $http.delete(url).then((result) => {
            if(result.status === 200) {
                var customerResult = result.data;
                if(customerResult.statusCode === 0) {
                    $scope.total --;
                    $scope.dataSource = $scope.dataSource.filter(item => item.id !== id);
                    $scope.totalPages = Math.ceil($scope.total / $scope.pageSize);
                    var message = 'User has been successfully deleted!';
                    $scope.handleSuccess(message);
                } else {
                    $scope.handleFail(customerResult.description);
                }
            } else {
                $scope.handleFail('System error, Please try again later');

            }
        });
    }

    /**
     * page change function
     * 
     * @param {number}} pageIndex 
     */
    $scope.pageChange = function(pageIndex) {
        $scope.pageIndex = pageIndex;
        $scope.init();
    }

    /**
     *  show add user modal
     */
    $scope.addUser = function() {
        $scope.title = 'Add User'; 
        $scope.editId = null;
        $scope.name = null;
        $scope.phone = null;
        $scope.address = null;

        $('#userFormModal').modal('show');
    }

    /**
     * show edit user modal
     * 
     * @param {edit user} user 
     */
    $scope.editUser = function(user) {
        $scope.title = 'Edit User';
        $scope.editId = user.id;
        $scope.name = user.name;
        $scope.phone = user.phone;
        $scope.address = user.address;

        $('#userFormModal').modal('show');

    }

    /**
     * save user function
     */
    $scope.save = function() {
        var data = {
            name: $scope.name,
            phone: $scope.phone,
            address: $scope.address,
            id: $scope.editId
        }

        if(!$scope.name) {
            $scope.nameErr = 'You must enter a value'
            return;
        } else {
            $scope.nameErr = null;
        }

        var errMessage = $scope.checkPhone($scope.phone);
        if(errMessage) {
            $scope.phoneErr = errMessage;
            return;
        } else {
            $scope.phoneErr = null;
        }

        if(!$scope.editId) {    //add User
            var addUrl = addUserUrl;
            $http.put(addUrl, JSON.stringify(data)).then((result) => {
                if(result.status === 200) {
                    var customerResult = result.data;
                    if(customerResult.statusCode === 0) {
                        $scope.dataSource = [customerResult.data, ...this.dataSource];
                        $scope.total ++;
                        $scope.totalPages = Math.ceil($scope.total / $scope.pageSize);
                        $('#userFormModal').modal('hide');
                        $scope.handleSuccess('User created successfully!');
                    } else {
                        $scope.handleFail(customerResult.description);
                    }
                } else {
                    $scope.handleFail('System error, Please try again later');
                }
            });
        } else {                //edit User
            var editUrl = updateUrl;
            $http.post(editUrl, JSON.stringify(data)).then((result) => {
                if(result.status === 200) {
                    var customerResult = result.data;
                    if(customerResult.statusCode === 0) {
                        const newData = [];

                        $scope.dataSource.forEach(item => {
                            if (item.id === data.id) {
                                newData.push(data);
                            } else {
                                newData.push(item);
                            }
                        });
                        $scope.dataSource = newData;
                        $('#userFormModal').modal('hide'); 
                        $scope.handleSuccess('User edited successfully!');
                    } else {
                        $scope.handleFail(customerResult.description);
                    }
                } else {
                    $scope.handleFail('System error, Please try again later');
                }
            });
        }
    }

    /**
     * check phone format
     * 
     * @param {number} phone 
     */
    $scope.checkPhone = function(phone) {
        var message = null;
        var re = /^\+?[1-9][0-9]*$/;
        if(!phone) {
            message = 'You must enter a value';
        } else if (!re.test(phone)){
            message = 'Invalid phone number';
        }
        return message;
    }

    /**
     * handle success result
     * 
     * @param {string} message 
     */
    $scope.handleSuccess = function(message) {
        toastr.success(message);
    }

    /**
     * handle fail result
     * 
     * @param {string} message 
     */
    $scope.handleFail = function(message) {
        toastr.error(message);
    }

});