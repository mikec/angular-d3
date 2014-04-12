angular.module('ngd3.services', [])

.factory('domain', [function() {

    function domain() { }

    domain.getLineDataDomains = function(data) {
        var xVals = [];
        var yVals = [];

        for(var lineName in data) {
            var lineData = data[lineName];
            for(var i in lineData) {
                xVals.push(lineData[i][0]);
                yVals.push(lineData[i][1]);
            }
        }

        return {
            x: domain.getDomain(xVals),
            y: domain.getDomain(yVals)
        };
    }

    domain.getDomain = function(data) {
        return [d3.min(data), d3.max(data)]
    }

    return domain;

}])

.factory('scale', [function() {

    function scale() { }

    var scl = new scale();

    scale.prototype.getTimeScale = function(rangeStart, rangeStop) {
        return getScale(true, rangeStart, rangeStop);
    };

    scale.prototype.getLinearScale = function(rangeStart, rangeStop) {
        return getScale(false, rangeStart, rangeStop);
    };

    function getScale(isTimeScale, rangeStart, rangeStop) {
        var s = (isTimeScale ?
                    d3.time.scale() : d3.scale.linear());
        return s.range([rangeStart, rangeStop]);
    }

    return scl;

}]);