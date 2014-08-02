/**
 * Opaciter 뷰
 * @constructor
 */
lt.view.Opaciter = function(){
    this.opacityButton = null;
    this.opacityArea = null;
    this.opacityAreaHeight = 0;

    this._assignElements();
    this._setComputeOpacityAreaHeight();
};

lt.view.Opaciter.prototype = {

    /**
     * 뷰를 렌더링 한다.
     * @param percent
     */
    render : function(percent){
        this.opacityButton.style.top = percent + '%';
    },

    /**
     * 엘리먼트를 캐쉬한다.
     * @private
     */
    _assignElements : function(){
        this.opacityWrapper = document.querySelector('#light-table .lt-navigation');
        this.opacityArea = this.opacityWrapper.querySelector('.lt-opacity-area');
        this.opacityButton = this.opacityWrapper.querySelector('.lt-opacity-area button');
        this.draggerButton = this.opacityWrapper.querySelector('.lt-dragger button');
    },

    /**
     * 투명도 구역의 높이 값을 계산하여 저장한다.
     * @private
     */
    _setComputeOpacityAreaHeight: function(){
        this.opacityAreaHeight = parseInt(window.getComputedStyle(this.opacityArea).height, 10);
    }
};