angular.module('tangcloud', [])
    .directive('wordCloud', ['$interpolate', '$compile', '$timeout', function ($interpolate, $compile, $timeout) {

        var directive = {
                restrict: 'E',
                scope: {
                    width: '=',
                    height: '=',
                    words: '='
                },

                template: "<div id='test' class='tangcloud'>" +
                "<span ng-repeat='entry in words'>{{entry.word}}</span>" +
                "</div>",

                compile: function (elem) {
                    elem.children().children().addClass('tangcloud-item-' + $interpolate.startSymbol() + 'entry.size' + $interpolate.endSymbol());

                    return function (scope, elem) {
                        var centerX = scope.width / 2;
                        var centerY = scope.height / 2;
                        var takenSpots = [];

                        sortWordsBySize();
                        determineWordPositions();


                        function sortWordsBySize() {
                            for (var q = scope.words.length; q > 0; q--) {
                                var j = 1;
                                for (var i = 0; j < q; i++) {
                                    if (scope.words[i].size < scope.words[j].size) {
                                        var wordOne = scope.words[i];
                                        scope.words[i] = scope.words[j];
                                        scope.words[j] = wordOne;
                                    }
                                    j++;
                                }
                            }
                        }

                        function determineWordPositions() {
                            $timeout(function () {
                                var trendSpans = elem.children().eq(0).children();
                                var length = trendSpans.length;

                                for (var i = 0; i < length; i++) {
                                    setWordSpanPosition(trendSpans.eq(i));
                                }
                            });
                        }

                        function setWordSpanPosition(span) {
                            var height = span[0].offsetHeight;
                            var width = span[0].offsetWidth;
                            var spot = {startX: centerX, startY: centerY, endX: centerX + width, endY: centerY + height};
                            var angleMultiplier = 0;

                            while (spotTaken(spot)) {
                                var angle = angleMultiplier * 0.1;
                                spot.startX = centerX + (2 * angle) * Math.cos(angle) - (width / 2);
                                spot.startY = centerY + (2 * angle) * Math.sin(angle) - (height / 2);
                                spot.endX = spot.startX + width;
                                spot.endY = spot.startY + height;
                                angleMultiplier+=10;
                            }

                            takenSpots.push(spot);
                            addSpanPositionStyling(span, spot.startX, spot.startY);
                        }


                        function spotTaken(spot) {
                            for (var i = 0; i < takenSpots.length; i++) {
                                if (collisionDetected(spot, takenSpots[i])) return true;
                            }
                            return false;
                        }

                        function collisionDetected(spot, takenSpot) {
                            if (spot.startX > takenSpot.endX || spot.endX < takenSpot.startX) {
                                return false;
                            }

                            if (spot.startY > takenSpot.endY || spot.endY < takenSpot.startY) {
                                return false;
                            }

                            return true;
                        }

                        function addSpanPositionStyling(span, startX, startY) {
                            var style = "position: absolute; left:" + startX + "; top: " + startY;
                            span.attr("style", style);
                        }
                    };
                }
            }
            ;

        return directive;
    }])
;