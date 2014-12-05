angular
    .module('dpdFeeder', [])
    .controller('SettingsCtrl', function ($scope) {
        // defaults
        $scope.error = '';

        var editor = ace.edit('prop-json');
        editor.setTheme('ace/theme/deployd');
        editor.getSession().setMode('ace/mode/json');

        function IsJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

        $scope.clearForm = function () {
            $scope.error = '';
            $scope.resource = '';
            $scope.clear = false;
            editor.setValue('');
        };

        $scope.submit = function () {

            $scope.error = '';
            $scope.success = false;

            var jsonData = editor.getValue();

            if(IsJsonString(jsonData)) {
                var parsedJSON = JSON.parse(jsonData);
            } else {
                $scope.error = 'Your json is invalid';
            }

            if(parsedJSON) {
                if($scope.clear) {
                    dpd($scope.resource).get(function(result,error){
                        var remaining = result.length;
                        if(result.length > 0) {
                            result.forEach(function(entry) {
                                dpd($scope.resource).del(entry.id,function(){
                                    remaining--;
                                    if (remaining === 0) {
                                        //Clearing done
                                        fillData(parsedJSON);
                                    }
                                });
                            });
                        } else {
                            fillData(parsedJSON);
                        }

                    });
                } else {
                    fillData(parsedJSON);
                }
            }

            function fillData(data) {
                var successCount = 0;

                for (var i=0,  tot=data.length; i < tot; i++) {

                    dpd($scope.resource).post(data[i], function(result, error) {

                        if(result !== null ) {
                            successCount++;

                            if(successCount === tot) {
                                $scope.success = true;
                                $scope.$apply();
                            }
                        }
                        if(error) {
                            $scope.error = error.message;
                            $scope.$apply();
                        }
                    });
                }
            }
        }
    });