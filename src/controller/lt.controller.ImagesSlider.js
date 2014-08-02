/**
 * ImagesSlider 컨트롤러
 * @param {lt.view.ImagesSlider} view
 * @param {lt.model.Paths} paths
 * @constructor
 */
lt.controller.ImagesSlider = function(view, paths){
    if(!(this instanceof lt.controller.ImagesSlider)){
        return new lt.controller.ImagesSlider(view, paths);
    }

    this._paths = paths;
    this._view = view;
    this._panelX = 0;
    this._deltaX = 0;
    this._startX = 0;
    this._startTime = 0;
    this._isSwipeLeft = false;

    this._doPresentation();
    this._bindUIActions();

    lt.util.screenRotate(this._doPresentation.bind(this));
};

lt.controller.ImagesSlider.prototype = {

    /**
     * 뷰를 이용해 렌더링하고 슬라이드 위치를 이동시킨다.
     * @private
     */
    _doPresentation : function(){
        var screenWidth = lt.util.screenWidth(),
            index = this._paths.currentKey();

        this._view.render(this._paths.list());
        this._view.swipe(index * -screenWidth);
    },

    /**
     * 유저의 요청을 바인딩한다.
     * @private
     */
    _bindUIActions : function(){
        this._view.imagesWrapper.addEventListener('touchmove', this._onTouchmoveImagesWrapper.bind(this));
        this._view.selectButton.addEventListener('click', this._onClickImageSelector.bind(this));
        this._view.imagesList.addEventListener('click', this._onClickImagesChoiceButton.bind(this));
        this._view.imagesList.addEventListener('touchstart', this._onTouchstartImagesList.bind(this));
        this._view.imagesList.addEventListener('touchmove',  this._onTouchmoveImagesList.bind(this));
        this._view.imagesList.addEventListener('touchend', this._onTouchendImagesList.bind(this));
    },

    /**
     * 이미지 목록 랩퍼의 touchmove 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchmoveImagesWrapper : function(event){
        event.preventDefault();
    },

    /**
     * 검색 버튼 click 이벤트 리스너
     */
    _onClickImageSelector : function(){
        this._view.show();
    },

    /**
     * 선택 버튼 touchend 이벤트 리스너
     * @param {Event} event
     */
    _onClickImagesChoiceButton : function(event){
        if(event.target.tagName === 'BUTTON'){
            this._paths.save();
            this._view.hide();
        }
    },

    /**
     * 이미지 touchstart 이벤트 리스너
     * @param {Event} event
     */
    _onTouchstartImagesList : function(event){
        var screenWidth = lt.util.screenWidth(),
            index = this._paths.currentKey();

        // 스와이프 계산에 필요한 값을 셋한다.
        this._deltaX = 0;
        this._panelX = index * -screenWidth;
        this._startX = event.touches[0].pageX;
        this._startTime = Date.now();
    },

    /**
     * 이미지 touchmove 이벤트 리스너
     * @param {Event} event
     */
    _onTouchmoveImagesList : function(event){
        this._deltaX = event.touches[0].pageX - this._startX;
        this._isSwipeLeft = this._deltaX < 0;

        // 맨 앞 오른쪽으로 스와이프 하거나,
        // 맨 끝 왼쪽으로 스와이프 하면
        // 이동 푝을 줄여서 마지막임을 알 수 있도록 한다.
        if((this._paths.isFirst() && !this._isSwipeLeft) ||
            (this._paths.isLast() && this._isSwipeLeft)){
            this._deltaX = this._deltaX / 2.5;
        }

        this._view.swipe(this._deltaX + this._panelX);
    },

    /**
     * 이미지 touchend 이벤트 리스너
     */
    _onTouchendImagesList : function(){
        var speed = Date.now() - this._startTime,
            screenWidth = lt.util.screenWidth(),
            index = 0;

        if(Math.abs(this._deltaX) > (screenWidth / 2.5)){
            // 맨 끝이 아니면서 왼쪽으로 스와이프하면
            if(!this._paths.isLast() && this._isSwipeLeft){
                // 맨 앞이 아니면서 오른쪽으로 스와이프 하면
                this._paths.next();
            }else if(!this._paths.isFirst() && !this._isSwipeLeft){
                this._paths.prev();
            }
        }

        index = this._paths.currentKey();
        this._view.swipe(index * -screenWidth, speed);
    }
};