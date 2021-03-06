'use strict';

angular.module('bricksApp.ui')
  .directive('events', function ($timeout, apps) {
    return {
      replace: true,
      require: '^ui',
      restrict: 'E',
      scope: {},
      templateUrl: 'scripts/ui/components/events.html',
      link: function (scope, element, attrs, uiCtrl) {
        scope.selection = null;
        scope.app = apps.current();
        scope.event = {};

        scope.names = (
          'blur change click copy cut dblclick focus keydown keyup ' +
          'keypress mousedown mouseenter mouseleave mousemove mouseout ' +
          'mouseover mouseup paste submit'
        ).split(' ');

        scope.actions = {
          add: 'add row',
          update: 'update row',
          remove: 'remove row',
          visit: 'load page',
          custom: 'custom'
        };

        var parseEvent = function (selection, type) {
          var event = selection.attr('ng-' + type);

          if (event) {
            scope.event.type = type;
            scope.event.action = event.split('(')[0];

            if (scope.event.action &&
                Object.keys(scope.actions).indexOf(scope.event.action) > -1) {
              var part2 = event.split('\'')[1];

              if (scope.event.action === 'visit') {
                scope.event.object = part2.replace(/{{(\w+)\.id}}/, ":$1");
              } else {
                scope.event.object = part2;
              }
            } else {
              scope.event.action = 'custom';
              scope.event.object = event;
            }
          }
        };

        scope.$on('selection', function () {
          scope.selection = uiCtrl.selection();
          scope.event = {};
          scope.names.forEach(function (event) {
            parseEvent(scope.selection, event);
          });

          $timeout(function () {
            scope.$apply();
          });
        });

        scope.$watch('event', function (event) {
          var attrValue;

          if (!scope.selection) {
            return;
          }

          if (event.type && event.action && event.object) {
            switch (event.action) {
              case 'custom':
                attrValue = event.object;
              break;

              case 'visit':
                var url = event.object.replace(/:(\w+)/, "{{$1.id}}");
                attrValue = event.action + '(\'' + url + '\')';
              break;

              default:
                attrValue = event.action +
                  '(\'' + event.object + '\', ' + event.object + ')';
            }
            scope.selection.attr('ng-' + event.type, attrValue);
          } else {
            scope.selection.removeAttr('ng-' + event.type);
          }

          uiCtrl.updateTemplate();
        }, true);
      }
    };
  });
