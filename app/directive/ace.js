// ====================================
// Ace
// ====================================

angular.module('ace', [])
.directive('ace', ['$window', function ($window) {
  return {
    restrict: 'E',
    template: '<div class="ace-editor"></div>',
    require: '?ngModel',
    link: function (scope, element, attrs, ngModel) {
      if( !$window.ace ) throw new Error("ace not found.");

      // Setup Ace
      var editor = ace.edit(element.children()[0]);
      editor.setTheme("ace/theme/merbivore");
      editor.getSession().setUseSoftTabs(true);
      editor.getSession().setTabSize(2);
      editor.setShowPrintMargin(false);

      // Angularize
      
      // Watch 'mode' and update the mode
      attrs.$observe('mode', function (newMode) {
        editor.getSession().setMode("ace/mode/" + newMode);
      });
      // If a model is set on the element, update it's value
      // when Ace reports a change
      if( ngModel ) {
        (function () {
          // Prevent the view from being updated again when we update it
          var updating = false;
          editor.getSession().on('change', function () {
            if( scope.$$phase || updating ) { updating = false; return; }
            scope.$apply(function () {
              ngModel.$setViewValue(editor.getSession().getValue());
            });
          });
          ngModel.$render = function() {
            updating = true;
            editor.getSession().setValue(ngModel.$viewValue || '');
          };
        }());
      }

    }
  };
}]);