if(!window.lt){
    /**
     * @namespace
     */
    window.lt = {};
}

/**
 * @namespace
 */
lt.model = lt.model || {};

/**
 * @namespace
 */
lt.controller = lt.controller || {};

/**
 * @namespace
 */
lt.helper = lt.helper || {};

/**
 * LightTable 모듈 빌드 함수
 * @author    ju.uyeong<ju.uyeong@nhn.com>
 * @version   0.0.2
 * @copyright 2014 UIT Licensed under the MIT license.
 * @param {Array.<string>} images 배열로 선언한 이미지 파일이 있는 URL
 * @returns {LightTableComponents}
 * @example
 * var lightTable = LightTable([
 *     './img/demo-0.png',
 *     './img/demo-1.png',
 *     './img/demo-2.png',
 *     './img/demo-3.png',
 * ]);
 */
function LightTable(images){

    /**
     * 라이트 테이블 반환 모델
     * @typedef {Object} LightTableModels
     * @property {lt.model.Images} images
     * @property {lt.model.Position} navigationPosition
     * @property {lt.model.Position} moverPosition
     */

    /**
     * 라이트 테이블 반환 컨트롤러
     * @typedef {Object} LightTableControllers
     * @property {lt.controller.Opaciter} opaciter
     * @property {lt.controller.Mover} mover
     * @property {lt.controller.Images} images
     * @property {lt.controller.Guide} guide
     * @property {lt.controller.Dragger} opaciterDragger
     * @property {lt.controller.Dragger} moverDragger
     */

    /**
     * 라이트 테이블 반환 객체
     * @typedef {Object} LightTableComponents
     * @property {LightTableModels} models
     * @property {LightTableControllers} controllers
     */

    // assign elements
    var lightTableElement = document.querySelector('#light-table'),
        naviElement = lightTableElement.querySelector('.lt-navigation'),
        opacityElement = lightTableElement.querySelector('.lt-opacity'),
        moverElement = lightTableElement.querySelector('.lt-mover'),
        imagesElement = lightTableElement.querySelector('.lt-images'),
        guideElement = lightTableElement.querySelector('.lt-guide'),
        searchButtonElement = lightTableElement.querySelector('.lt-search button'),
        naviDragButtonElement = naviElement.querySelector('.lt-dragger button'),
        moverDragButtonElement = moverElement.querySelector('.lt-dragger button'),

    // init models
        imagesModel = new lt.model.Images('LightTableImages', images),
        navPositionModel = new lt.model.Position('LightTableNavigation'),
        movPositionModel = new lt.model.Position('LightTableMover'),

    // init controllers
        opaciterController = new lt.controller.Opaciter(opacityElement, imagesModel),
        moverController = new lt.controller.Mover(moverElement, imagesModel),
        imagesController = new lt.controller.Images(searchButtonElement, imagesElement, imagesModel),
        guideController = new lt.controller.Guide(guideElement, imagesModel),

    // init draggers
        opaciterDragController = new lt.controller.Dragger(naviElement, naviDragButtonElement, navPositionModel),
        moverDragController = new lt.controller.Dragger(moverElement, moverDragButtonElement, movPositionModel);

    // returns models and controllers
    return {
        models : {
            images : imagesModel,
            navigationPosition : navPositionModel,
            moverPosition : movPositionModel
        },
        controllers : {
            opaciter : opaciterController,
            mover : moverController,
            images : imagesController,
            guide : guideController,
            opaciterDragger : opaciterDragController,
            moverDragger : moverDragController
        }
    };
}

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

/**
 * 옵저빙 헬퍼 객체
 * @constructor
 */
lt.helper.Observer = function(){
    this.callbacks = {};
};

lt.helper.Observer.prototype = {

    /**
     * 이벤트 구독자를 등록한다.
     * @param {string} event
     * @param {function} callback
     */
    subscribe : function(event, callback){
        this.callbacks[event] = this.callbacks[event] || [];
        this.callbacks[event].push(callback);
    },

    /**
     * 이벤트 구독자를 실행한다.
     * @param {string} event
     * @param {Array.<*>} args
     */
    publish : function(event, args){
        var self = this;

        if(this.callbacks === undefined){
            return false;
        }

        if(this.callbacks[event] === undefined){
            return false;
        }

        this.callbacks[event].forEach(function(callback){
            callback.apply(self, args);
        });
    }
};

/**
 * 이미지 모델 객체
 * @param {(string|number)!} identifier
 * @param {Array.<string>?} images
 * @constructor
 */
lt.model.Images = function(identifier, images){
    this.images = images || [];
    this._path = new lt.model.Path(identifier);
    this._opacity = new lt.model.Opacity(identifier);
    this._position = new lt.model.Position(identifier);
};

lt.model.Images.prototype = {

    /**
     * 이미지 목록을 순회한다.
     * @param {function} callback
     * @param {Object?} context
     */
    each : function(callback, context){
        context = context || this;
        this.images.forEach(callback, context);
    },

    /**
     * 이미지의 갯수를반환한다.
     * @returns {number}
     */
    count : function(){
        return this.images.length;
    },

    /**
     * 경로를 설정하거나 반환한다.
     * @param {string?} path
     * @returns {string|undefined}
     */
    path : function(path){
        return this._path.value(path);
    },

    /**
     * 좌표를 설정하거나 반환한다.
     * @param {PositionValue?} position
     * @returns {PositionValue|undefined}
     */
    position : function(position){
        return this._position.value(position);
    },

    /**
     * 투명도를 설정하거나 반환한다.
     * @param {number?} opacity
     * @returns {number|undefined}
     */
    opacity : function(opacity){
        return this._opacity.value(opacity);
    },

    /**
     * 정수를 100으로 나누어 투명도 값으로
     * 변환 후 저장한다.
     * @param {number} percent
     */
    opacityToPercent : function(percent){
        this._opacity.toPercent(percent);
    },

    /**
     * 경로 값 갱신에 대한 리스너
     * @param {function} callback
     */
    addPathListener : function(callback){
        this._path.addUpdateListener(callback);
    },

    /**
     * 투명도 값 갱신에 대한 리스너
     * @param {function} callback
     */
    addOpacityListener : function(callback){
        this._opacity.addUpdateListener(callback);
    },

    /**
     * 포지션 값 갱신에 대한 리스너
     * @param {function} callback
     */
    addPositionListener : function(callback){
        this._position.addUpdateListener(callback);
    },

    /**
     * 이미지의 속성을 초기화한다.
     */
    clear : function(){
        this._path.clear();
        this._opacity.clear();
        this._position.clear();
    }
};

/**
 * 투명도 모델 객체
 * @param {(string|number)!} identifier
 * @constructor
 */
lt.model.Opacity = function(identifier){
    this._identifier = identifier;
    this._opacity = parseFloat(localStorage.getItem(this._identifier+':opacity')) || 0;
    this._observer = new lt.helper.Observer();
};

lt.model.Opacity.prototype = {

    /**
     * 값을 설정하거나 반환한다.
     * @param {number?} opacity
     * @returns {number|undefined}
     */
    value : function(opacity){
        if(opacity === undefined){
            return this._opacity;
        }

        this._opacity = parseFloat(opacity.toFixed(1));
        this._observer.publish('update', [this._opacity]);
        localStorage.setItem(this._identifier+':opacity', opacity);
    },

    /**
     * 값을 제거한다.
     */
    clear : function(){
        this._opacity = 0;
        this._observer.publish('update', [this._opacity]);
        localStorage.removeItem(this._identifier+':opacity');
    },

    /**
     * 상태 변경에 대한 리스너를 등록한다.
     * @param {function} callback
     */
    addUpdateListener : function(callback){
        this._observer.subscribe('update', callback);
    },

    /**
     * 정수를 100으로 나누어 투명도 값으로
     * 변환 후 값을 저장한다.
     * @param {number} percent
     */
    toPercent : function(percent){
        this.value(percent / 100);
    }
};

/**
 * 이미지 모델 객체
 * @param {(string|number)!} identifier
 * @constructor
 */
lt.model.Path = function(identifier){
    this._identifier = identifier;
    this._path = localStorage.getItem(this._identifier+':path') || null;
    this._observer = new lt.helper.Observer();
};

lt.model.Path.prototype = {

    /**
     * 값을 설정하거나 반환한다.
     * @param {string?} path
     * @returns {string|undefined}
     */
    value : function(path){
        if(path === undefined){
            return this._path;
        }

        this._path = path;
        this._observer.publish('update', [this._path]);
        localStorage.setItem(this._identifier+':path', path);
    },

    /**
     * 상태 변경에 대한 리스너를 등록한다.
     * @param {function} callback
     */
    addUpdateListener : function(callback){
        this._observer.subscribe('update', callback);
    },

    /**
     * 값을 제거한다.
     */
    clear : function(){
        this._path = null;
        this._observer.publish('update', [this._opacity]);
        localStorage.removeItem(this._identifier+':path');
    }
};

/**
 * 좌표 모델 객체
 * @param {(string|number)!} identifier
 * @constructor
 */
lt.model.Position = function(identifier){
    this._identifier = identifier;
    this._x = parseInt(localStorage.getItem(this._identifier+':x'), 10) || 0;
    this._y = parseInt(localStorage.getItem(this._identifier+':y'), 10) || 0;
    this._observer = new lt.helper.Observer();
};

lt.model.Position.prototype = {

    /**
     * 포지션 값 객체 형태
     * @typedef {Object} PositionValue
     * @property {number} x x 좌표의 값
     * @property {number} y y 좌표의 값
     */

    /**
     * 값을 설정하거나 반환한다.
     * @param {PositionValue?} position
     * @returns {PositionValue|undefined}
     */
    value : function(position){
        if(position === undefined){
            return {x: this._x, y: this._y};
        }

        this._x = position.x;
        this._y = position.y;
        this._observer.publish('update', [position]);
        localStorage.setItem(this._identifier+':x', position.x);
        localStorage.setItem(this._identifier+':y', position.y);
    },

    /**
     * 상태 변경에 대한 리스너를 등록한다.
     * @param {function} callback
     */
    addUpdateListener : function(callback){
        this._observer.subscribe('update', callback);
    },

    /**
     * 값을 제거한다.
     */
    clear : function(){
        this._x = 0;
        this._y = 0;
        this._observer.publish('update', [{x: this._x, y: this._y}]);
        localStorage.removeItem(this._identifier+':x');
        localStorage.removeItem(this._identifier+':y');
    }
};
