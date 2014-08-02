/**
 * 랜드스케이프 상태인지 확인한다.
 * @memberOf lt.util
 * @type {function}
 * @returns {boolean}
 */
lt.util.isLandscape = function(){
    return window.innerHeight < window.innerWidth;
};