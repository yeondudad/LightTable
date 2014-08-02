lt.util.screenRotate = (function(){
    var resizeTimer = 0,
        screenRotate = null,
        observer = new lt.helper.Observer();

    window.addEventListener("resize", function(){
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function(){
            observer.publish('rotate', [lt.util.isLandscape()]);
        }, 500);
    }, false);

    /**
     * 디바이스를 로테이트 한 시점에 알고 싶다면
     * 함수를 전달하여 콜백으로 등록한다.
     * @memberOf lt.util
     * @type {function}
     * @param {function?} callback
     * @returns {boolean}
     */
    screenRotate = function(callback){
        if(callback !== undefined){
            observer.subscribe('rotate', callback);
        }
    };

    return screenRotate;
}());