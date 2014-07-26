/**
 * @param {HTMLElement} wrapper
 * @param {lt.model.Images} model
 * @constructor
 */
lt.controller.Opaciter = function(wrapper, model){
    this.opacityWrapper = wrapper;
    this.opacityArea = null;
    this.opacityButton = null;
    this._opacityAreaHeight = 0;
    this._touchstartY = 0;
    this._elementY = 0;
    this._model = model;

    this._assignElements();
    this._bindEvents();
    this._computeOpacityAreaHeight();
    this._move(this._model.opacity() * 100);
};

lt.controller.Opaciter.prototype = {

    /**
     * 투명도 최소 값
     * @type {number}
     * @readonly
     */
    _OPACITY_MIN : 0,

    /**
     * 투명도 최대 값
     * @type {number}
     * @readonly
     */
    _OPACITY_MAX : 100,

    /**
     * 엘리먼트를 저장한다.
     * @private
     */
    _assignElements : function(){
        this.opacityButton = this.opacityWrapper.querySelector('button');
        this.opacityArea = this.opacityWrapper.querySelector('.lt-opacity-area');
    },

    /**
     * 이벤트를 바인딩한다.
     * @private
     */
    _bindEvents : function(){
        this.opacityButton.addEventListener('touchstart', this._onTouchstartButton.bind(this));
        this.opacityButton.addEventListener('touchmove', this._onTouchmoveButton.bind(this));
        this.opacityButton.addEventListener('touchend', this._onTouchendButton.bind(this));
    },

    /**
     * 투명도 조절 버튼의 터치스타트 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchstartButton : function(event){
        event.stopPropagation();
        event.preventDefault();

        var touch = event.touches[0];

        this._touchstartY = touch.clientY;
        this._elementY = parseInt(this.opacityButton.style.top, 10);
        this._model.opacityToPercent(this._elementY);
    },

    /**
     * 투명도 조절 버튼의 터치무브 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchmoveButton : function(event){
        event.stopPropagation();
        event.preventDefault();

        var touch = event.touches[0],
            touchmoveY = touch.clientY,
            gap = (this._touchstartY - touchmoveY) * -1,
            percent = (gap / this._opacityAreaHeight * 100) + this._elementY;

        if(percent < this._OPACITY_MIN){
            percent = this._OPACITY_MIN;
        }

        if(percent > this._OPACITY_MAX){
            percent = this._OPACITY_MAX;
        }

        this._move(percent);
        this._model.opacityToPercent(percent);
    },

    /**
     * 투명도 조절 버튼의 터치엔드 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchendButton : function(event){
        event.stopPropagation();
        event.preventDefault();

        var percent = parseInt(this.opacityButton.style.top, 10);
        this._model.opacityToPercent(percent);
    },

    /**
     * 투명도 구역의 높이 값을 계산하여 저장한다.
     * @private
     */
    _computeOpacityAreaHeight: function(){
        this._opacityAreaHeight = parseInt(window.getComputedStyle(this.opacityArea).height, 10);
    },

    /**
     * 투명도 조절 버튼을 지정한 높이로 이동시킨다.
     * @param {number} percent
     * @private
     */
    _move : function(percent){
        this.opacityButton.style.top = percent + '%';
    }
};
