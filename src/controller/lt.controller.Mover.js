/**
 * @param {HTMLElement} wrapper
 * @param {lt.model.Images} model
 * @constructor
 */
lt.controller.Mover = function(wrapper, model){
    this.moverWrapper = wrapper;
    this.upButton = null;
    this.rightButton = null;
    this.downButton = null;
    this.leftButton = null;
    this._timeoutTimer = 0;
    this._intervalTimer = 0;
    this._model = model;

    this._assignElements();
    this._bindEvents();
};

lt.controller.Mover.prototype = {

    /**
     * 엘리먼트를 저장한다.
     * @private
     */
    _assignElements : function(){
        this.upButton = this.moverWrapper.querySelector('[data-role=image-pos-up]');
        this.rightButton = this.moverWrapper.querySelector('[data-role=image-pos-right]');
        this.downButton = this.moverWrapper.querySelector('[data-role=image-pos-down]');
        this.leftButton = this.moverWrapper.querySelector('[data-role=image-pos-left]');
    },

    /**
     * 이벤트를 바인딩한다.
     * @private
     */
    _bindEvents : function(){
        this.upButton.addEventListener('touchstart', this._onTouchstartUpButton.bind(this));
        this.rightButton.addEventListener('touchstart', this._onTouchstartRightButton.bind(this));
        this.downButton.addEventListener('touchstart', this._onTouchstartDownButton.bind(this));
        this.leftButton.addEventListener('touchstart', this._onTouchstartLeftButton.bind(this));
        this.moverWrapper.addEventListener('touchend', this._onTouchendMoverWrapper.bind(this));
    },

    /**
     * 위 버튼의 터치스타트 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchstartUpButton : function(event){
        event.stopPropagation();
        event.preventDefault();

        this._intervalReposition(function(position){
            position.y = position.y - 1;
            return position;
        });
    },

    /**
     * 오른쪽 버튼의 터치스타트 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchstartRightButton : function(event){
        event.stopPropagation();
        event.preventDefault();

        this._intervalReposition(function(position) {
            position.x = position.x + 1;
            return position;
        });
    },

    /**
     * 아래 버튼의 터치스타트 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchstartDownButton : function(event){
        event.stopPropagation();
        event.preventDefault();

        this._intervalReposition(function(position){
            position.y = position.y + 1;
            return position;
        });
    },

    /**
     * 왼쪽 버튼의 터치스타트 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchstartLeftButton : function(event){
        event.stopPropagation();
        event.preventDefault();

        this._intervalReposition(function(position){
            position.x = position.x - 1;
            return position;
        });
    },

    /**
     * 무버 랩퍼의 터치엔드 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchendMoverWrapper : function(event){
        event.stopPropagation();
        event.preventDefault();

        clearTimeout(this._timeoutTimer);
        clearInterval(this._intervalTimer);

        this._timeoutTimer = 0;
        this._intervalTimer = 0;
    },

    /**
     * 반복적으로 _reposition 메서드를 호출한다.
     * @param {function} callback
     * @private
     */
    _intervalReposition : function(callback){
        var self = this;

        self._reposition(callback);

        this._timeoutTimer = setTimeout(function(){
            self._intervalTimer = setInterval(function(){
                self._reposition(callback);
            }, 100);
        }, 300);
    },

    /**
     * 모델의 포지션 값을 가져와 콜백에 넘겨주고
     * 콜백에서 반환하는 값을 모델에 저장한다.
     * @param {function} callback
     * @private
     */
    _reposition : function(callback){
        var position = this._model.position();
        this._model.position(callback(position));
    }
};
