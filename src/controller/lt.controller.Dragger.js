/**
 * @param {HTMLElement} dragTarget
 * @param {HTMLElement} dragButton
 * @param {lt.model.Position} model
 * @constructor
 */
lt.controller.Dragger = function(dragTarget, dragButton, model){
    this.dragTarget = dragTarget;
    this.dragButton = dragButton;
    this._touchPosition = {};
    this._elementPosition = {};
    this._model = model;

    this._bindEvents();
    this._dragging(this._model.value());
};

lt.controller.Dragger.prototype = {

    /**
     * 이벤트를 바인딩 한다.
     * @private
     */
    _bindEvents : function(){
        this.dragButton.addEventListener('touchstart', this._onTouchstartDragButton.bind(this));
        this.dragButton.addEventListener('touchmove', this._onTouchmoveDragButton.bind(this));
        this.dragButton.addEventListener('touchend', this._onTouchendDragButton.bind(this));
    },

    /**
     * 드래그 버튼의 터치스타트 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchstartDragButton : function(event){
        event.preventDefault();
        event.stopPropagation();

        this._touchPosition.x = event.touches[0].clientX;
        this._touchPosition.y = event.touches[0].clientY;

        this._elementPosition.x = parseInt(this.dragTarget.style.left, 10);
        this._elementPosition.y = parseInt(this.dragTarget.style.top, 10);
    },

    /**
     * 드래그 버튼의 터치무브 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchmoveDragButton : function(event){
        event.preventDefault();
        event.stopPropagation();

        var gapX = event.touches[0].clientX - this._touchPosition.x,
            gapY = event.touches[0].clientY - this._touchPosition.y,
            position = {};

        position.x = gapX + this._elementPosition.x;
        position.y = gapY + this._elementPosition.y;

        this._dragging(position);
    },

    /**
     * 드래그 버튼의 터치엔드 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchendDragButton : function(event){
        event.preventDefault();
        event.stopPropagation();

        var gapX = event.changedTouches[0].clientX - this._touchPosition.x,
            gapY = event.changedTouches[0].clientY - this._touchPosition.y,
            position = {};

        position.x = gapX + this._elementPosition.x;
        position.y = gapY + this._elementPosition.y;

        this._model.value(position);
    },

    /**
     * 드래그 타겟을 드래깅 한다.
     * @param {PositionValue} position
     * @private
     */
    _dragging : function(position){
        this.dragTarget.style.top = position.y + 'px';
        this.dragTarget.style.left = position.x + 'px';
    }
};
