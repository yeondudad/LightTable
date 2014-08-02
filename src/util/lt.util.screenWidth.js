/**
 * 랜드스케이프를 확인하여 스크린의 가로 사이즈를 반환한다.
 * @memberOf lt.util
 * @type {function}
 * @returns {number}
 */
lt.util.screenWidth = function(){
    return lt.util.isLandscape()? screen.height : screen.width;
};