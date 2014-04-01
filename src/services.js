angular.module('ngd3.services', [])

.factory('graph', [function() {

    var defaultMarginX = 30;
    var defaultMarginY = 20;

    /* DataSet */
    function DataSet(dataSet) {
        angular.extend(this, dataSet);
    }

    DataSet.prototype.getDomainX = function() {
        return this.getDomain();
    }

    DataSet.prototype.getDomainY = function() {
        return this.getDomain(true);
    }

    DataSet.prototype.getDomain = function(isDomainY) {
        var domain = [];
        var minArray = [];
        var maxArray = [];
        var dataIndex = isDomainY ? 1 : 0;
        for(var i in this) {
            var arr = this[i];
            if(!isFunction(arr)) {
                minArray.push(
                    d3.min(arr, function(d) {
                        return d[dataIndex];
                    })
                );
                maxArray.push(
                    d3.max(arr, function(d) {
                        return d[dataIndex];
                    })
                );
            }
        }
        domain[0] = d3.min(minArray);
        domain[1] = d3.max(maxArray);
        return domain;
    }

    function isFunction(fn) {
        return fn && {}.toString.call(fn) === '[object Function]';
    }

    /* graph service */
    function graph() { }

    var g = new graph();

    graph.prototype.getTimeScale = function(rangeStart, rangeStop) {
        return getScale(true, rangeStart, rangeStop);
    };

    graph.prototype.getLinearScale = function(rangeStart, rangeStop) {
        return getScale(false, rangeStart, rangeStop);
    };

    graph.prototype.getDomains = function(dataSet) {
        var ds = new DataSet(dataSet);
        return {
            x: ds.getDomainX(),
            y: ds.getDomainY()
        }
    };

    graph.prototype.getSVG = function(svgChildElement) {
        var svgElem = null;
        var p = svgChildElement.parent();
        for(var i=0; i < 25; i++) {
            if(p[0] && 
                p[0].tagName && 
                    p[0].tagName.toLowerCase() == 'svg') {
                svgElem = {
                    element: p
                };
                break;
            } else {
                p = p.parent();
            }
        }
        if(svgElem) {
            // x and y margin is the padding needed for each axis
            svgElem.xMargin = getIntAttr(svgElem.element, 'x-margin', defaultMarginX);
            svgElem.yMargin = getIntAttr(svgElem.element, 'y-margin', defaultMarginY);
            // full width, including axis margins
            svgElem.graphWidth = svgElem.element.prop('offsetWidth');
            svgElem.graphHeight = svgElem.element.prop('offsetHeight');
            // "inner" means between axis lines, excluding axis margins
            svgElem.graphInnerWidth = svgElem.graphWidth - (svgElem.xMargin * 2);
            svgElem.graphInnerHeight = svgElem.graphHeight - (svgElem.yMargin * 2);
            // range for x axis
            svgElem.xRangeStart = 0;
            svgElem.xRangeStop = svgElem.graphInnerWidth;
            // range for y axis
            svgElem.yRangeStart = svgElem.graphInnerHeight;
            svgElem.yRangeStop = 0;
            // linear scales
            svgElem.xLinearScale = this.getLinearScale(svgElem.xRangeStart, svgElem.xRangeStop);
            svgElem.yLinearScale = this.getLinearScale(svgElem.yRangeStart, svgElem.yRangeStop);
            // time scales
            svgElem.xTimeScale = this.getTimeScale(svgElem.xRangeStart, svgElem.xRangeStop);
            svgElem.yTimeScale = this.getTimeScale(svgElem.yRangeStart, svgElem.yRangeStop);
            // name of the data property within the current SVG's scope
            svgElem.dataScope = svgElem.element.attr('data-scope');
        }
        return svgElem;
    };

    function getScale(isTimeScale, rangeStart, rangeStop) {
        var s = (isTimeScale ?
                    d3.time.scale() : d3.scale.linear());
        return s.range([rangeStart, rangeStop]);
    }

    function getIntAttr(elem, attr, defaultValue) {
        var attrStr = elem.attr(attr);
        return attrStr ? parseInt(attrStr) : defaultValue;
    }

    return g;

}]);