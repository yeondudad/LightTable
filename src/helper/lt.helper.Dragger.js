/**
 * 드래거 헬퍼
 * @param {string|number} identifier
 * @param {HTMLElement} dragTarget
 * @param {HTMLElement} dragButton
 * @constructor
 */
lt.helper.Dragger = function(identifier, dragTarget, dragButton){
    if(!(this instanceof lt.helper.Dragger)){
        return new lt.helper.Dragger(identifier, dragTarget, dragButton);
    }

    this._identifier = identifier;
    this.dragTarget = dragTarget;
    this.dragButton = dragButton;
    this._touchPosition = {};
    this._elementPosition = {};

    var x = localStorage.getItem(this._identifier + '::x') || 0,
        y = localStorage.getItem(this._identifier + '::y') || 0;

    this._bindEvents();
    this._dragging(x, y);
};

lt.helper.Dragger.prototype = {

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
            x = gapX + this._elementPosition.x,
            y = gapY + this._elementPosition.y;

        this._dragging(x, y);
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
            x = gapX + this._elementPosition.x,
            y = gapY + this._elementPosition.y;

        localStorage.setItem(this._identifier + '::x', x);
        localStorage.setItem(this._identifier + '::y', y);
    },

    /**
     * 드래그 타겟을 드래깅 한다.
     * @private
     */
    _dragging : function(x, y){
        this.dragTarget.style.left = x + 'px';
        this.dragTarget.style.top = y + 'px';
    }
};
