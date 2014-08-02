/**
 * Mover 뷰
 * @constructor
 */
lt.view.Mover = function(){
    this._assignElements();
};

lt.view.Mover.prototype = {

    /**
     * 엘리먼트를 캐쉬한다.
     * @private
     */
    _assignElements : function(){
        this.moverWrapper = document.querySelector('#light-table .lt-mover');
        this.upButton = this.moverWrapper.querySelector('[data-role=image-pos-up]');
        this.rightButton = this.moverWrapper.querySelector('[data-role=image-pos-right]');
        this.downButton = this.moverWrapper.querySelector('[data-role=image-pos-down]');
        this.leftButton = this.moverWrapper.querySelector('[data-role=image-pos-left]');
        this.draggerButton = this.moverWrapper.querySelector('.lt-dragger button');
    }
};