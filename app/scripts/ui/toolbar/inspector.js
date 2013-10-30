'use strict';

angular.module('bricksApp.ui')
  .directive('inspector', function ($compile) {
    return {
      replace: true,
      require: '^editor',
      restrict: 'E',
      template: '<button class="btn btn-link" ng-click="show = !show">' +
        '<span class="fa fa-code"></span></button>',
      link: function (scope, element, attrs, editorCtrl) {
        var canvas = element.closest('#canvas');

        scope.page = editorCtrl.page;

        canvas.append($compile('<div id="inspector" ng-show="show">' +
            '<textarea ng-model="page().template" ui-refresh="show" ' +
              'ui-codemirror="codemirrorOptions"></textarea>' +
            '</div>')(scope));

        scope.show = false;
        scope.codemirrorOptions = {
          lineWrapping : true,
          lineNumbers: true,
          mode: {
            name: 'xml',
            htmlMode: true
          },
          theme: 'base16-dark'
        };

        scope.$watch('show', function (show) {
          if (show) {
            canvas.addClass('inspector-visible');
          } else {
            canvas.removeClass('inspector-visible');
          }
        });
      }
    };
  });