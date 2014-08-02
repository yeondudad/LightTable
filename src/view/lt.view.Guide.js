/**
 * Guide 뷰
 * @constructor
 */
lt.view.Guide = function(){
    this.guideWrapper = null;
    this._path = '';

    this._assignElements();
};

lt.view.Guide.prototype = {

    /**
     * 뷰를 렌더링한다.
     * @param {string} path
     * @param {number} opacity
     * @param {number} x
     * @param {number} y
     */
    render : function(path, opacity, x, y){
        if(path !== this._path){
            this.guideWrapper.innerHTML = '<img src="' + path + '">';
            this._path = path;
        }

        this.guideWrapper.style.left = x + 'px';
        this.guideWrapper.style.top = y + 'px';
        this.guideWrapper.style.opacity = opacity;
    },

    /**
     * 엘리먼트를 캐쉬한다.
     * @private
     */
    _assignElements : function(){
        this.guideWrapper = document.querySelector('#light-table .lt-guide');
    }
};