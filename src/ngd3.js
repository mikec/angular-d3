if (typeof angular === 'undefined') { 
    throw new Error('angular-d3 requires angular.js. https://github.com/angular/angular.js');
}
if (typeof d3 === 'undefined') { 
    throw new Error('angular-d3 requires d3.js. https://github.com/mbostock/d3');
}

var ngd3 = angular.module('ngd3', []);