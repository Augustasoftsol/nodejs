app.service('userservice', function ($http,$upload) {
    return {
        getValues: getValues,
        addValues: addValues,
        edit: edit,
        delUsr: delUsr,
        signin: signin,
        register: register
    };
    function getValues() {
        //var url = urlService.getApiUrl();
        return $http.get('/contactlist1').then(function (success) { return success; }, function (error) { return error; })
    }
    function edit(id) {
        //var url = urlService.getApiUrl();
        return $http.get('/getbyid?id='+id).then(function (success) { return success; }, function (error) { return error; })
    }
    function addValues(modal) {
        //var url = urlService.getApiUrl();
        if (modal._id != null)
            return $http.put('/contactlist1', modal).then(function (success) { debugger; return success; }, function (error) { return error; })
        else
            modal.token='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImRmZ2RmZyIsInBhc3N3b3JkIjoiMzQ1MzQiLCJlbWFpbCI6ImdkZmdAZnNkZnMuc2ZzZGZzIiwiZmlyc3ROYW1lIjoic2ZzZGZzZGYiLCJsYXN0TmFtZSI6InNkZnNkZiIsIl9pZCI6IjU1ODJiZGRjOTc4N2JhYWMyNDM1Nzc0YiIsImlhdCI6MTQzNDk3MjY3MCwiZXhwIjoxNDM1MDU5MDcwfQ.JGgwxNAgliqEotDh4MQxXXtxe81s1MrInhbTFV4ZdR4';
            return $http.post('/contactlist1', modal).then(function (success) { debugger; return success; }, function (error) { return error; })
        //return console.log(modal);
    }

    function delUsr(item)
    {
        return $http.post('/contactList2', item).then(function (success) { return success }, function (error) { return error; })
    }

    function signin(item) {
        return $http.post('/login', item).then(function (success) { return success }, function (error) { return error; })
    }
    function register(item,files) {

       // return $http.post('/signup', item).then(function (success) { return success }, function (error) { return error; })

     return   $upload.upload({

         url: 'signup',
         headers: {'myHeaderKey': 'myHeaderVal'},
         data: {
             companyName: 'title text',
             companyPhone:'9874563215',
             description: 'Development and Testing Company',
             contactFirstName:'Rama raj',
             contactLastName:'Surya',
             contactEmail:'Krishnakumar.vee@gmail.com',
             contactPhone:'6541263541',
             username:'krishvii',
                 password:'1234567'
         },
         /*
          formDataAppender: function(fd, key, val) {
          if (angular.isArray(val)) {
          angular.forEach(val, function(v) {
          fd.append(key, v);
          });
          } else {
          fd.append(key, val);
          }
          },
          */
         file:files!=null?files[0]:null,
         fileFormDataName: 'myFile'

        // url: '/upload',// webapi url
         //method: "POST",
        // headers: { 'Content-Type': 'application/json' },
         //data: item,
         //file:files,
         //fileFormDataName: 'files'
        // dataType:'json'
     }).success(function (response) {
         return  response;
     }).error(function (response) {
        return response;
     });
    }
});