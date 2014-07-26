/**
 * @param {HTMLElement} wrapper
 * @param {lt.model.Images} model
 * @constructor
 */
lt.controller.Guide = function(wrapper, model){
    this.guideWrapper = wrapper;
    this._model = model;

    this._render();
    this._bindEvents();
};

lt.controller.Guide.prototype = {

    /**
     * 가이드 이미지를 렌더링 한다.
     * @private
     */
    _render : function(){
        if(this._model.path() !== null){
            this.guideWrapper.innerHTML = '<img src="' + this._model.path() + '">';
        }

        this.guideWrapper.style.top = this._model.position().y + 'px';
        this.guideWrapper.style.left = this._model.position().x + 'px';
        this.guideWrapper.style.opacity = this._model.opacity();
    },

    /**
     * 이벤트를 바인딩한다.
     * @private
     */
    _bindEvents : function(){
        this._model.addOpacityListener(this._onOpacityUpdate.bind(this));
        this._model.addPositionListener(this._onPositionUpdate.bind(this));
        this._model.addPathListener(this._onPathUpdate.bind(this));
    },

    /**
     * 투명도 갱신 리스너
     * @param {number} opacity
     * @private
     */
    _onOpacityUpdate : function(opacity){
        this.guideWrapper.style.opacity = opacity;
    },

    /**
     * 포지션 갱신 리스너
     * @param {PositionValue} position
     * @private
     */
    _onPositionUpdate : function(position){
        this.guideWrapper.style.top = position.y + 'px';
        this.guideWrapper.style.left = position.x + 'px';
    },

    /**
     * 경로 갱신 리스너
     * @param {string} path
     * @private
     */
    _onPathUpdate : function(path){
        this.guideWrapper.innerHTML = '<img src="' + path + '">';
    }
};
