/**
 * Opaciter 컨트롤러
 * @param {lt.view.Opaciter} view
 * @param {lt.model.Guide} guide
 * @constructor
 */
lt.controller.Opaciter = function(view, guide){
    if(!(this instanceof lt.controller.Opaciter)){
        return new lt.controller.Opaciter(view, guide);
    }

    this._touchstartY = 0;
    this._elementY = 0;
    this._guide = guide;
    this._view = view;

    this._initDragger();
    this._bindUIActions();

    this._view.render(this._guide.percent(), 0);
};

lt.controller.Opaciter.prototype = {

    /**
     * 드래그 가능 하도록 Dragger 헬퍼 모듈을 init 한다.
     * @private
     */
    _initDragger : function(){
        var identifier = 'LightTable::OpaciterDragger',
            dragTarget = this._view.opacityWrapper,
            dragButton = this._view.draggerButton;

        lt.helper.Dragger(identifier, dragTarget, dragButton);
    },

    /**
     * 이벤트를 바인딩한다.
     * @private
     */
    _bindUIActions : function(){
        this._view.opacityWrapper.addEventListener('touchmove', this._onTouchmoveOpacityWrapper.bind(this));
        this._view.opacityButton.addEventListener('touchstart', this._onTouchstartOpacityButton.bind(this));
        this._view.opacityButton.addEventListener('touchmove', this._onTouchmoveOpacityButton.bind(this));
    },

    /**
     * 투명도 조절 바의 touchmove 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchmoveOpacityWrapper : function(event){
        event.preventDefault();
    },

    /**
     * 투명도 조절 버튼의 터치스타트 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchstartOpacityButton : function(event){
        this._touchstartY = event.touches[0].clientY;
        this._elementY = this._guide.percent();
    },

    /**
     * 투명도 조절 버튼의 터치무브 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchmoveOpacityButton : function(event){
        var touchmoveY = event.touches[0].clientY,
            gap = (this._touchstartY - touchmoveY) * -1,
            percent = parseInt((gap / this._view.opacityAreaHeight * 100) + this._elementY, 10);

        if(percent < 0){
            percent = 0;
        }

        if(percent > 100){
            percent = 100;
        }

        this._guide.percent(percent);
        this._view.render(percent, 0);
    }
};
