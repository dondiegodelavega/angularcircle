'use strict';

/**
 * @ngdoc function
 * @name myAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the myAppApp
 */
angular.module('myAppApp')

  .controller('templateCtrl', function ($scope, $http, $route) {
      var templateName = $route.current.$$route.templateName; // to get the template name

      $http.get('plans.json').success(onPlansSuccess); // get plans // TODO: allow origin error fix
      //$http.get('https://staging.circles.asia/plans.json').success(onPlansSuccess);
      function onPlansSuccess(data){
          sortPlans(data[0]['plans']);
          if(templateName == 'template3'){
              initPieSliders();
          }else{
              initLineSliders(templateName == 'template2');
          }
          setBasicChartTexts();
      }

      // to get usefull data and sort them based on value
      function sortPlans(data){
          $scope.baseInfo = [];
          $scope.dataInfo = [];
          $scope.voiceInfo = [];
          $scope.smsInfo = [];

          $scope.selectedDataIndex = 0;
          $scope.selectedVoiceIndex = 0;
          $scope.selectedSmsIndex = 0;

          for(var i=0; i< data.components.length; i++){
              if(data.components[i]['component_type']== 'Data'){
                  $scope.dataInfo.push(data.components[i]);
              }else if(data.components[i]['component_type']== 'Voice'){
                  $scope.voiceInfo.push(data.components[i]);
              }else{
                  $scope.smsInfo.push(data['components'][i]);
              }
          }
          $scope.dataInfo.sort(sortBy('value', false, parseInt));
          $scope.voiceInfo.sort(sortBy('value', false, parseInt));
          $scope.smsInfo.sort(sortBy('value', false, parseInt));
          delete data.components;
          $scope.baseInfo =  data;
      }

      // helper function to sort elemts of array by fild name
      function sortBy(field, reverse, primer){
          var key = primer ?
              function(x) {return primer(x[field])} :
              function(x) {return x[field]};
          reverse = !reverse ? 1 : -1;
          return function (a, b) {
              return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
          }
      }

      // init line sliders
      function initLineSliders(vertical){
          $scope.sliderData = {
              id:'Data',
              value: $scope.selectedDataIndex ,
              options: {
                  floor: $scope.baseInfo['increment_data_min'],
                  ceil: $scope.baseInfo['increment_data_max'],
                  showSelectionBar: true,
                  showTicksValues: true,
                  vertical : vertical,
                  ticksValuesTooltip: function (v) {
                      return 'Tooltip for ' + v;
                  },
                  stepsArray:getStepString($scope.dataInfo, 'data'),
                  onChange : function(sliderId, modelValue, highValue){
                      $scope.selectedDataIndex = modelValue;
                      setTxtValues();
                  }
              }
          };

          $scope.sliderVoice = {
              value: $scope.selectedVoiceIndex,
              options: {
                  floor: $scope.baseInfo['increment_voice_min'],
                  ceil: $scope.baseInfo['increment_voice_max'],
                  showSelectionBar: true,
                  showTicksValues: true,
                  vertical : vertical,
                  ticksValuesTooltip: function (v) {
                      return 'Tooltip for ' + v;
                  },
                  stepsArray:getStepString($scope.voiceInfo, 'voice'),
                  onChange : function(sliderId, modelValue, highValue){
                      $scope.selectedVoiceIndex = modelValue;
                      setTxtValues();
                  }
              }
          };

          $scope.sliderSms = {
              value: $scope.selectedSmsIndex,
              options: {
                  floor: $scope.baseInfo['increment_sms_min'],
                  ceil: $scope.baseInfo['increment_sms_max'],
                  showSelectionBar: true,
                  showTicksValues: true,
                  vertical : vertical,
                  ticksValuesTooltip: function (v) {
                      return 'Tooltip for ' + v;
                  },
                  stepsArray: getStepString($scope.smsInfo , 'sms'),
                  onChange : function(sliderId, modelValue, highValue){
                      $scope.selectedSmsIndex = modelValue;
                      setTxtValues();
                  }
              }
          };
      }

      // to get the steps for the line sliders
      function getStepString(arr, type){
          var result = "";
          if(type == 'data'){result = $scope.baseInfo['data'] + ',';
          }else if(type == 'voice'){result = $scope.baseInfo['minutes'] + ',';
          }else{result = $scope.baseInfo['sms'] + ',';}
          for(var i=0;i<arr.length;i++){
              var toBeAdded = 0;
              if(type == 'data'){
                  toBeAdded = parseInt(arr[i]['value']) + parseInt($scope.baseInfo['data']);
              }else if(type == 'voice'){
                  toBeAdded = parseInt(arr[i]['value']) + parseInt($scope.baseInfo['minutes']);
              }else{
                  toBeAdded = parseInt(arr[i]['value']) + parseInt($scope.baseInfo['sms']);
              }
              result+=toBeAdded;
              if(i!=arr.length-1)result+=",";
          }
          return result.split(',');
      }

      // init pie sliders
      function initPieSliders(){
          angular.element("#sliderData").roundSlider({
              sliderType: "min-range",
              width: 20,
              radius: 80,
              min: 0,
              max: $scope.dataInfo.length,
              value: $scope.selectedDataIndex,
              editableTooltip: false,
              circleShape: "half-top",
              tooltipFormat: function(args){
                  return "+" + args.value + " GB";
              },
              change: function (args) {
                  $scope.selectedDataIndex = args.value;
                  setTxtValues();
              }
          });

          angular.element("#sliderVoice").roundSlider({
              sliderType: "min-range",
              width: 20,
              radius: 80,
              min: 0,
              max: $scope.voiceInfo.length,
              value: $scope.selectedVoiceIndex,
              editableTooltip: false,
              circleShape: "half-top",
              tooltipFormat: function(args){
                  return "+" + args.value * $scope.baseInfo['increment_minutes'] + " mins";
              },
              change: function (args) {
                  $scope.selectedVoiceIndex = args.value;
                  setTxtValues();
              }
          });

          angular.element("#sliderSms").roundSlider({
              sliderType: "min-range",
              width: 20,
              radius: 80,
              min: 0,
              max: $scope.smsInfo.length,
              value: $scope.selectedSmsIndex,
              editableTooltip: false,
              circleShape: "half-top",
              tooltipFormat: function(args){
                  return "+" + args.value * $scope.baseInfo['increment_sms'] + " SMS";
              },
              change: function (args){
                  $scope.selectedSmsIndex = args.value;
                  setTxtValues();
              }
          });
      }

      // set some inital data values for UI
      function setBasicChartTexts(){
          $scope.txtChartData = '$'+$scope.baseInfo['increment_data_price']+'/'+$scope.baseInfo['increment_data']+'GB';
          $scope.txtChartVoice = '$'+$scope.baseInfo['increment_minutes_price']+'/'+$scope.baseInfo['increment_minutes']+'mins';
          $scope.txtChartSms = '$'+$scope.baseInfo['increment_sms_price']+'/'+$scope.baseInfo['increment_sms']+'SMS';
          $scope.txtSubtotal = $scope.baseInfo['basicPrice'];
      }

      // function to set scope variables after change on sliders
      function setTxtValues(){
          $scope.txtSubtotal =  (parseInt($scope.baseInfo['data']) * $scope.baseInfo['increment_data_price']) +
              ( $scope.selectedDataIndex * $scope.baseInfo['increment_data_price']) +
              10 + ( $scope.selectedVoiceIndex * $scope.baseInfo['increment_minutes_price']) +
              ($scope.selectedSmsIndex * $scope.baseInfo['increment_sms_price']) ;
          if(templateName == 'template3'){
              if (!$scope.$$phase)$scope.$apply();
          }

      }

  });
