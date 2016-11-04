// DIRECTIVES

//Directive to handle frame rate
skiApp.directive("vgFrameButtons", ["VG_STATES",
    function (VG_STATES) {
        return {
            restrict: "E",
            require: "^videogular",
            template:
                '<button class="iconButton" ng-click="prevFrame()"><i class="fa fa-angle-double-left"></i></button>' +
                '<button class="iconButton" ng-click="nextFrame()"><i class="fa fa-angle-double-right"></i></button>',
            link: function (scope, elem, attr, API) {
                var frameTime = 1 / 29.97;

                scope.prevFrame = function () {
                    API.seekTime((API.currentTime / 1000) - frameTime);
                };
                scope.nextFrame = function () {
                    API.seekTime((API.currentTime / 1000) + frameTime);
                };

                scope.$watch(
                    function () {
                        return API.currentState;
                    },
                    function (newVal) {
                        var display = newVal == VG_STATES.PAUSE ? "table-cell" : "none";
                        elem.css("display", display);
                    }
                );

            }
        }
    }
]);