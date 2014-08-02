/**
 * Mover 컨트롤러
 * @param {lt.view.Mover} view
 * @param {lt.model.Guide} guide
 * @constructor
 */
lt.controller.Mover = function(view, guide){
    if(!(this instanceof lt.controller.Mover)){
        return new lt.controller.Mover(view, guide);
    }

    this._timeoutTimer = 0;
    this._intervalTimer = 0;
    this._view = view;
    this._guide = guide;

    this._initDragger();
    this._bindUIActions();
};

lt.controller.Mover.prototype = {

    /**
     * 드래그 가능 하도록 Dragger 헬퍼 모듈을 init 한다.
     * @private
     */
    _initDragger : function(){
        var identifier = 'LightTable::MoverDragger',
            dragTarget = this._view.moverWrapper,
            dragButton = this._view.draggerButton;

        lt.helper.Dragger(identifier, dragTarget, dragButton);
    },

    /**
     * 이벤트를 바인딩한다.
     * @private
     */
    _bindUIActions : function(){
        this._view.upButton.addEventListener('touchstart', this._onTouchstartUpButton.bind(this));
        this._view.rightButton.addEventListener('touchstart', this._onTouchstartRightButton.bind(this));
        this._view.downButton.addEventListener('touchstart', this._onTouchstartDownButton.bind(this));
        this._view.leftButton.addEventListener('touchstart', this._onTouchstartLeftButton.bind(this));
        this._view.moverWrapper.addEventListener('touchend', this._onTouchendMoverWrapper.bind(this));
    },

    /**
     * 위 버튼의 터치스타트 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchstartUpButton : function(event){
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
        var position = callback({
            x : this._guide.x(),
            y : this._guide.y()
        });

        this._guide.x(position.x);
        this._guide.y(position.y);
    }
};
