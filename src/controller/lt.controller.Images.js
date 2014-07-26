/**
 * @param {HTMLElement} button
 * @param {HTMLElement} wrapper
 * @param {lt.model.Images} model
 * @constructor
 */
lt.controller.Images = function(button, wrapper, model){
    this.selectButton = button;
    this.imagesWrapper = wrapper;
    this.imagesList = null;
    this._screenWidth = 0;
    this._imageWidth = 0;
    this._current = 0;
    this._count = model.count() - 1;
    this._deltaX = 0;
    this._startX = 0;
    this._startTime = 0;
    this._model = model;

    this._initWidthValues();
    this._assignElements();
    this._bindEvents();
    this._render();
};

lt.controller.Images.prototype = {

    /**
     * 이미지를 렌더링 한다.
     * @private
     */
    _render : function(){
        var self = this,
            html = '';

        this._model.each(function(image){
            html = html + '<li class="lst-img" style="width:' + self._imageWidth + 'px">' +
                          '<button>선택</button><img src="' + image + '"/></li>';
        });

        this.imagesList.innerHTML = html;
        this._translate(this._current);
    },

    /**
     * 스와이프에 계산에 필요한 너비 값을 설정한다.
     * @private
     */
    _initWidthValues : function(){
        this._screenWidth = screen.width;
        this._imageWidth = this._screenWidth - 40;
    },

    /**
     * 엘리먼트를 저장한다.
     * @private
     */
    _assignElements : function(){
        this.imagesList = this.imagesWrapper.querySelector('ul');
    },

    /**
     * 이벤트를 바인딩한다.
     * @private
     */
    _bindEvents : function(){
        this.selectButton.addEventListener('click', this._onClickSelectButton.bind(this));
        this.imagesList.addEventListener('touchstart', this._onTouchstartImagesList.bind(this));
        this.imagesList.addEventListener('touchmove',  this._onTouchmoveImagesList.bind(this));
        this.imagesList.addEventListener('touchend', this._onTouchendImagesList.bind(this));
        this.imagesList.addEventListener('touchend', this._onTouchendImagesButton.bind(this));
    },

    /**
     * 이미지 검색 버튼 클릭 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onClickSelectButton : function(event){
        event.preventDefault();
        event.stopPropagation();

        this.imagesWrapper.style.display = 'block';
    },

    /**
     * 이미지 터치스타트 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchstartImagesList : function(event){
        event.preventDefault();
        event.stopPropagation();

        var panelX = null;

        if(event.target.tagName === 'LI' ||
           event.target.parentNode.tagName === 'LI'){
            panelX = parseInt(this.imagesList.style.margin.match(/-?\w+px$/g)[0], 10);
        }

        // 스와이프 계산에 필요한 값을 셋한다.
        this._panelX = parseInt(panelX, 10);
        this._startX = event.touches[0].pageX;
        this._startTime = Date.now();
    },

    /**
     * 이미지 터치무브 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchmoveImagesList : function(event){
        event.preventDefault();
        event.stopPropagation();

        this._deltaX = event.touches[0].pageX - this._startX;

        // 맨 앞 이미지에서 오른쪽으로 스와이프 하거나,
        // 맨 끝 이미지에서 왼쪽으로 스와이트 하면
        // 좌표를 줄여서 마지막임을 알 수 있도록 한다.
        if(this._swipeToRightHead() || this._swipeToLeftTail()){
            this._deltaX = this._deltaX / 2.5;
        }

        this._translate(this._deltaX + this._panelX, 0);
    },

    /**
     * 이미지 터치엔드 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchendImagesList : function(event){
        event.preventDefault();
        event.stopPropagation();

        if(this._canSwipe() && this._wasLeftSwipe()){
            this._current = this._current + 1;
        }

        if(this._canSwipe() && this._wasRightSwipe()){
            this._current = this._current - 1;
        }

        this._translate(this._getSwipeDist(), this._getSwipeSpeed());

        // 포지션 값 초기화
        this._deltaX = 0;
        this._startX = 0;
    },

    /**
     * 이미지 선택 버튼 터치엔드 이벤트 리스너
     * @param {Event} event
     * @private
     */
    _onTouchendImagesButton : function(event){
        event.preventDefault();
        event.stopPropagation();

        if(event.target.tagName === 'BUTTON'){
            this._model.path(this._model.images[this._current]);
            this.imagesWrapper.style.display = 'none';
        }
    },

    /**
     * 유저가 왼쪽으로 swipe 했는지 판단한다.
     * @returns {boolean}
     * @private
     */
    _wasLeftSwipe : function(){
        // delta.x가 0보다 작으면 left
        return this._deltaX < 0;
    },

    /**
     * 유저가 오른쪽으로 swipe 했는지 판단한다.
     * @returns {boolean}
     * @private
     */
    _wasRightSwipe : function(){
        // delta.x가 0보다 크면 right
        return this._deltaX > 0;
    },

    /**
     * 제일 마지막에 있는 이미지를 왼쪽으로
     * 스와이프 했는지 판단한다.
     * @returns {boolean}
     * @private
     */
    _swipeToLeftTail : function(){
        return this._current === this._count && this._wasLeftSwipe();
    },

    /**
     * 제일 앞에 있는 이미지를 오른쪽으로
     * 스와이프 했는지 판단한다.
     * @returns {boolean}
     * @private
     */
    _swipeToRightHead : function(){
        return this._current === 0 && this._wasRightSwipe();
    },

    /**
     * 터치스타트 했을때 시간과 터치엔드 했을때 시간을
     * 빼서 스와이프 속도 값을 계산해 반환한다.
     * @returns {number}
     * @private
     */
    _getSwipeSpeed : function(){
        var slideSpeed = Date.now() - this._startTime;

        if(slideSpeed > 500){
            slideSpeed = 500;
        }

        return slideSpeed;
    },

    /**
     * 현재 이미지 순서와 윈도우 너비를 곱하여
     * 스와이프 되야할 목표 포지션 값을 계산해 반환한다.
     * @returns {number}
     * @private
     */
    _getSwipeDist : function(){
        return this._current * -this._screenWidth;
    },

    /**
     * 이미지를 넘길 정도로 충분히 Swipe 했는지 판단한다.
     * @returns {boolean}
     */
    _canSwipe : function(){
        // 맨 앞 이미지를 오른쪽으로 스와이프 한게 아니면서
        // 맨 뒤 이미지를 왼쪽으로 스와이프 한게 아닌 동시에
        // 2.5등분한 너비의 크기 보다 크게 스와이프 했다면 true
        return this._swipeToRightHead() === false &&
            this._swipeToLeftTail() === false &&
            Math.abs(this._deltaX) > (this._screenWidth / 2.5);
    },

    /**
     * 이미지 패널의 margin-left 값 스타일을 설정한다.
     * @param {number?} dist
     * @param {number?} speed
     * @private
     */
    _translate : function(dist, speed){
        var transition = '',
            style = this.imagesList.style;

        speed = speed || 0;

        if(speed !== 0){
            transition = 'all '+ speed +'ms';
        }

        ['webkit', 'moz', 'ms', 'o'].forEach(function(vendor){
            style[vendor + 'Transition'] = transition;
        });

        // transform을 사용하면 safari6 에서 점멸되는
        // 버그가 있어 margin 값으로 조절.
        // 버그 원인을 파악하면 transform 사용하는 코드로 대체 예정
        style.margin = '0 0 0 ' + dist +'px';
        style.transition = transition;
    }
};
