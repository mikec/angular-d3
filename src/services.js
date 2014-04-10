angular.module('ngd3.services', [])

.factory('GraphElement', ['scale', function(scale) {

    var defaultMarginX = 30;
    var defaultMarginY = 20;

    var graphElementInstances = [];

    function GraphElement(element) {
        this.element = element;
        // x and y margin is the padding needed for each axis
        this.xMargin = getIntAttr(this.element, 'x-margin', defaultMarginX);
        this.yMargin = getIntAttr(this.element, 'y-margin', defaultMarginY);
        // full width, including axis margins
        this.graphWidth = this.element.prop('offsetWidth');
        this.graphHeight = this.element.prop('offsetHeight');
        // "inner" means between axis lines, excluding axis margins
        this.graphInnerWidth = this.graphWidth - (this.xMargin * 2);
        this.graphInnerHeight = this.graphHeight - (this.yMargin * 2);
        // range for x axis
        this.xRangeStart = 0;
        this.xRangeStop = this.graphInnerWidth;
        // range for y axis
        this.yRangeStart = this.graphInnerHeight;
        this.yRangeStop = 0;
        // linear scales
        this.xLinearScale = scale.getLinearScale(this.xRangeStart, this.xRangeStop);
        this.yLinearScale = scale.getLinearScale(this.yRangeStart, this.yRangeStop);
        // time scales
        this.xTimeScale = scale.getTimeScale(this.xRangeStart, this.xRangeStop);
        this.yTimeScale = scale.getTimeScale(this.yRangeStart, this.yRangeStop);
        // name of the data property within the current graph scope
        this.dataScope = this.element.attr('data-scope');

        // store the newly instantiated graph element
        graphElementInstances.push(this);
    }

    GraphElement.findByChild = function(childElement) {
        var p = childElement.parent();
        for(var i=0; i < 25; i++) {
            if(p[0] && 
                p[0].tagName && 
                    p[0].tagName.toLowerCase() == 'svg') {
                return getGraphElementInstance(p);
            } else {
                p = p.parent();
            }
        }
        return null;
    }

    function getGraphElementInstance(svgElem) {
        for(var i in graphElementInstances) {
            var e = graphElementInstances[i];
            if(angular.equals(svgElem, e.element)) {
                return e;
            }
        }
        return null;
    }

    function getIntAttr(elem, attr, defaultValue) {
        var attrStr = elem.attr(attr);
        return attrStr ? parseInt(attrStr) : defaultValue;
    }

    return GraphElement;
}])

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