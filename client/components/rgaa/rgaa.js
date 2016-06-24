/**
 *  The MIT License (MIT)
 *
 *  Copyright (c) 2015 Jérôme Botineau (V-Technologies) pour le compte de la DISIC
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */
'use strict';

angular.module('a11yBootstrap', ['ui.bootstrap'])

.directive('enforceFocus', ['$document', '$timeout', function($document, $timeout) {
  return {
    link: function($scope, iElm) {
      //Save current focus
      var modalOpener = $document[0].activeElement;
      $timeout(function() {
        iElm[0].focus();
      });

      //enforceFocus inside modal
      function enforceFocus(evt) {
        if (iElm[0] !== evt.target && !iElm[0].contains(evt.target)) {
          iElm[0].focus();
        }
      }

      $document[0].addEventListener('focus', enforceFocus, true);

      $scope.$on('$destroy', function() {
        //back to first focus
        modalOpener.focus();

        //Remove event listener
        $document[0].removeEventListener('focus', enforceFocus, true);
      });

      var tababbleSelector = 'a[href], area[href], input:not([disabled]), button:not([disabled]),select:not([disabled]), textarea:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';

      //return lastFocusable element inside modal
      function lastFocusable(domEl) {
        var list = domEl.querySelectorAll(tababbleSelector);
        return list[list.length - 1];
      }

      var lastEl = lastFocusable(iElm[0]);

      //focus lastElement when shitKey Tab on first element
      function shiftKeyTabTrap(evt) {
        if (iElm[0] === evt.target && evt.shiftKey && evt.keyCode === 9) {
          lastEl.focus();
          evt.preventDefault();
        }
      }

      iElm.bind('keydown', shiftKeyTabTrap);
    }
  };
}])

.directive('keySpace', function() {
  return function(scope, element, attrs) {
    element.bind('keydown keypress', function(event) {
      if (event.which === 32) {
        scope.$apply(function() {
          scope.$eval(attrs.keySpace);
        });

        event.preventDefault();
      }
    });
  };
})

.directive('keyboardRotate', ['$document', '$timeout', function($document, $timeout) {
  return {
    restrict: 'A',
    scope: {
      param: '@keyboardRotate',
    },
    link: function($scope, iElm) {
      var recursion = $scope.param;
      $timeout(function() {
        function KeyTrap(evt) {
          var next;
          var keyCode = evt.keyCode;

          //Right key and up key
          if (keyCode === 39 || keyCode === 40) {
            next = evt.target.nextElementSibling;
            if (recursion === '1') {
              next = evt.target.parentElement.nextElementSibling;
            }

            //if last go to first
            if (!next) {
              next = iElm.children()[0];
            }
          }

          //Left key and down key
          if (keyCode === 37 || keyCode === 38) {
            next = evt.target.previousElementSibling;
            if (recursion === '1') {
              next = evt.target.parentElement.previousElementSibling;
            }

            //if first go to last
            if (!next) {
              var child = iElm.children();
              next = child[child.length - 1];
            }
          }

          //go to next element if defined (previous or next)
          if (next) {
            if (recursion === '1') {
              next = next.children[0];
            }

            next.click();
            next.focus();
          }
        }

        angular.element(iElm[0]).on('keydown', KeyTrap);
      }, 0);
    }
  };
}])

.directive('btnRadio', [function() {
  return {
    require: ['btnRadio', 'ngModel'],
    priority: 200, //Make sure watches are fired after any other directives that affect the ngModel value
    link: function($scope, iElm, iAttrs, controller) {
      var buttonsCtrl = controller[0];
      var ngModelCtrl = controller[1];

      //model -> UI
      ngModelCtrl.$render = function() {
        var check = angular.equals(ngModelCtrl.$modelValue, $scope.$eval(iAttrs.btnRadio));
        iElm.attr('aria-checked', check);
        iElm.attr('tabindex', '-1');
        if (check) {
          iElm.attr('tabindex', '0');
        }

        iElm.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, $scope.$eval(iAttrs.btnRadio)));
      };

    }
  };
}])

.directive('btnCheckbox', [function() {
  return {
    require: ['btnCheckbox', 'ngModel'],
    priority: 200, //Make sure watches are fired after any other directives that affect the ngModel value
    link: function($scope, iElm, iAttrs, controller) {
      var buttonsCtrl = controller[0];
      var ngModelCtrl = controller[1];

      function getCheckboxValue(attributeValue, defaultValue) {
        var val = $scope.$eval(attributeValue);
        return angular.isDefined(val) ? val : defaultValue;
      }

      function getTrueValue() {
        return getCheckboxValue(iAttrs.btnCheckboxTrue, true);
      }

      //model -> UI
      ngModelCtrl.$render = function() {
        var check = angular.equals(ngModelCtrl.$modelValue, getTrueValue());
        iElm.attr('aria-checked', check);
        iElm.toggleClass(buttonsCtrl.activeClass, check);
      };

    }
  };
}]);

//Templates
angular.module('template/modal/window.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/modal/window.html',
    '<div>\n' +
    ' <div enforce-focus tabindex="-1" modal-render="{{$isRendered}}" tabindex="-1" role="dialog" class="modal"\n' +
    '     modal-animation-class="fade"\n' +
    '  ng-class="{in: animate}" ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}" ng-click="close($event)">\n' +
    '     <div class="modal-dialog" ng-class="size ? \'modal-\' + size : \'\'"><div class="modal-content" modal-transclude></div></div>\n' +
    ' </div>\n' +
    ' <div tabindex="0"></div>\n' +
    '</div>\n' +
    '');
}]);
