if(!window.lt){
    /**
     * @global
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
lt.view = lt.view || {};

/**
 * @namespace
 */
lt.template = lt.template || {};

/**
 * @namespace
 */
lt.helper = lt.helper || {};

/**
 * @namespace
 */
lt.util = lt.util || {};
/**
 * LightTable 모듈 빌드 함수
 * @author    ju.uyeong<ju.uyeong@nhn.com>
 * @version   0.0.3
 * @copyright 2014 UIT Licensed under the MIT license.
 * @param {Array.<string>} paths 배열로 선언한 이미지 파일 경로 목록
 * @example
 * var lightTable = LightTable([
 *     './img/demo-0.png',
 *     './img/demo-1.png',
 *     './img/demo-2.png',
 *     './img/demo-3.png',
 * ]);
 */
function LightTable(paths){
    document.body.insertAdjacentHTML('beforeend', lt.template.lightTable);

    var pathsModel = new lt.model.Paths(paths),
        guideModel = new lt.model.Guide(),
        imagesSliderView = new lt.view.ImagesSlider(),
        opaciterView = new lt.view.Opaciter(),
        guideView = new lt.view.Guide(),
        moverView = new lt.view.Mover();

    lt.controller.ImagesSlider(imagesSliderView, pathsModel);
    lt.controller.Opaciter(opaciterView, guideModel);
    lt.controller.Guide(guideView, pathsModel, guideModel);
    lt.controller.Mover(moverView, guideModel);
}

/**
 * Guide 컨트롤러
 * @param {lt.view.Guide} view
 * @param {lt.model.Paths} paths
 * @param {lt.model.Guide} guide
 * @constructor
 */
lt.controller.Guide = function(view, paths, guide){
    if(!(this instanceof lt.controller.Guide)){
        return new lt.controller.Guide(view, paths, guide);
    }

    this._view = view;
    this._paths = paths;
    this._guide = guide;

    this._bindNotification();

    var path = this._paths.currentPath(),
        opacity = this._guide.opacity(),
        x = this._guide.x(),
        y = this._guide.y();

    this._view.render(path, opacity, x, y);
};

lt.controller.Guide.prototype = {

    /**
     * 모델의 상태 변화에 대한 리스너를 바인딩한다.
     * @private
     */
    _bindNotification : function(){
        this._paths.addUpdateListener(this.onUpdatePath.bind(this));
        this._guide.addUpdateListener(this.onUpdateGuide.bind(this));
    },

    /**
     * Paths 모델 update 리스너
     * @param {string} path
     */
    onUpdatePath : function(path){
        var opacity = this._guide.opacity(),
            x = this._guide.x(),
            y = this._guide.y();

        this._view.render(path, opacity, x, y);
    },

    /**
     * Guide 모델 update 리스너
     * @param {number} opacity
     * @param {number} x
     * @param {number} y
     */
    onUpdateGuide : function(opacity, x, y){
        var path = this._paths.currentPath();

        this._view.render(path, opacity, x, y);
    }
};

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

/**
 * 옵저빙 헬퍼
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
 * Guide 모델
 * @constructor
 */
lt.model.Guide = function(){
    this._opacity = parseFloat(localStorage.getItem('LightTable::opacity')) || 0;
    this._x = parseInt(localStorage.getItem('LightTable::x'), 10) || 0;
    this._y = parseInt(localStorage.getItem('LightTable::y'), 10) || 0;

    this._observer = new lt.helper.Observer();
};

lt.model.Guide.prototype = {

    /**
     * 투명도 값을 저장하거나 반환한다.
     * @param {number?} opacity
     * @returns {number}
     */
    opacity : function(opacity){
        if(opacity === undefined){
            return this._opacity;
        }

        opacity = parseFloat(opacity.toFixed(1));

        localStorage.setItem('LightTable::opacity', opacity);

        this._opacity = opacity;
        this._publish();
    },

    /**
     * 투명도 값을 퍼센트 값으로 전환하여 반환하거나
     * 퍼센트 값을 투명도 값으로 전환하여 저장한다.
     * @param {number?} percent
     * @returns {number}
     */
    percent : function(percent){
        if(percent === undefined){
            return this._opacity * 100;
        }

        this.opacity(percent / 100);
    },

    /**
     * x 좌표 값을 저장하거나 반환한다.
     * @param {number?} x
     * @returns {number}
     */
    x : function(x){
        if(x === undefined){
            return this._x;
        }

        localStorage.setItem('LightTable::x', x);

        this._x = parseInt(x, 10);
        this._publish();
    },

    /**
     * y 좌표 값을 저장하거나 반환한다.
     * @param {number?} y
     * @returns {number}
     */
    y : function(y){
        if(y === undefined){
            return this._y;
        }

        localStorage.setItem('LightTable::y', y);

        this._y = parseInt(y, 10);
        this._publish();
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
        this._opacity = 0;
        this._x = 0;
        this._y = 0;

        this._observer.publish('remove');
        localStorage.removeItem('LightTable::opacity');
        localStorage.removeItem('LightTable::x');
        localStorage.removeItem('LightTable::y');
    },

    /**
     * 상태 변화를 알린다.
     * @private
     */
    _publish : function(){
        this._observer.publish('update', [this._opacity, this._x, this._y]);
    }
};
/**
 * 경로 모델 객체(이터레이터)
 * @param {Array.<string>?} paths
 * @constructor
 */
lt.model.Paths = function(paths){
    this._paths = paths || [];
    this._key = parseInt(localStorage.getItem('LightTable::key'), 10) || 0;

    this._observer = new lt.helper.Observer();
};

lt.model.Paths.prototype = {

    /**
     * 현재 저장된 경로 목록을 반환한다.
     * @returns {Array.<string>}
     */
    list : function(){
        return this._paths;
    },

    /**
     * 현재 키 값을 반환한다.
     * @returns {number}
     */
    currentKey : function(){
        return this._key;
    },

    /**
     * 현재 키에 해당하는 경로를 반환한다.
     * @returns {string}
     */
    currentPath : function(){
        return this._paths[this.currentKey()];
    },

    /**
     * 키를 다음으로 이동시킨다.
     */
    next : function(){
        if(this._key < this._paths.length){
            this._key = this._key + 1;
        }
    },

    /**
     * 키를 이전으로 이동시킨다.
     */
    prev : function(){
        if(this._key > 0){
            this._key = this._key - 1;
        }
    },

    /**
     * 현재 키가 맨 앞을 가리키는지 파악한다.
     * @returns {boolean}
     */
    isFirst : function(){
        return this._key === 0;
    },

    /**
     * 현재 키가 마지막을 가리키는지 파악한다.
     * @returns {boolean}
     */
    isLast : function(){
        return this._key === this._paths.length - 1;
    },

    /**
     * 현재 키에 해당하는 경로를
     * 로컬 스토리지에 저장한다.
     */
    save : function(){
        var path = this._paths[this.currentKey()];
        this._observer.publish('update', [path]);
        localStorage.setItem('LightTable::key', this.currentKey());
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
        this._key = 0;
        this._observer.publish('remove');
        localStorage.removeItem('LightTable::key');
    }
};

lt.template.lightTable =
    '<div id="light-table">' +
        '<div class="lt-navigation">' +
            '<div class="lt-search">' +
                '<button type="button" data-role="image-search"><span>검색</span></button>' +
            '</div>' +
            '<div class="lt-opacity">' +
                '<div class="lt-opacity-bar">' +
                    '<div class="lt-opacity-area">' +
                        '<button type="button" data-role="image-opacity"><span>투명도 조정</span></button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="lt-dragger">' +
                '<button type="button" data-role="navigation-dragger"><span>이동</span></button>' +
            '</div>' +
        '</div>' +

        '<div class="lt-mover">' +
            '<div class="lt-mover-buttons">' +
                '<button type="button" data-role="image-pos-up"><span>&#8593;</span></button>' +
                '<button type="button" data-role="image-pos-right"><span>&#8594;</span></button>' +
                '<button type="button" data-role="image-pos-down"><span>&#8595;</span></button>' +
                '<button type="button" data-role="image-pos-left"><span>&#8592;</span></button>' +
            '</div>' +
            '<div class="lt-dragger">' +
                '<button type="button" data-role="mover-dragger"><span>이동</span></button>' +
            '</div>' +
        '</div>' +

        '<div class="lt-images"><ul></ul></div>' +
        '<div class="lt-guide"></div>' +
    '</div>'
;
/**
 * 랜드스케이프 상태인지 확인한다.
 * @memberOf lt.util
 * @type {function}
 * @returns {boolean}
 */
lt.util.isLandscape = function(){
    return window.innerHeight < window.innerWidth;
};
lt.util.screenRotate = (function(){
    var resizeTimer = 0,
        screenRotate = null,
        observer = new lt.helper.Observer();

    window.addEventListener("resize", function(){
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function(){
            observer.publish('rotate', [lt.util.isLandscape()]);
        }, 500);
    }, false);

    /**
     * 디바이스를 로테이트 한 시점에 알고 싶다면
     * 함수를 전달하여 콜백으로 등록한다.
     * @memberOf lt.util
     * @type {function}
     * @param {function?} callback
     * @returns {boolean}
     */
    screenRotate = function(callback){
        if(callback !== undefined){
            observer.subscribe('rotate', callback);
        }
    };

    return screenRotate;
}());
/**
 * 랜드스케이프를 확인하여 스크린의 가로 사이즈를 반환한다.
 * @memberOf lt.util
 * @type {function}
 * @returns {number}
 */
lt.util.screenWidth = function(){
    return lt.util.isLandscape()? screen.height : screen.width;
};
/**
 * Guide 뷰
 * @constructor
 */
lt.view.Guide = function(){
    this.guideWrapper = null;
    this._path = '';

    this._assignElements();
};

lt.view.Guide.prototype = {

    /**
     * 뷰를 렌더링한다.
     * @param {string} path
     * @param {number} opacity
     * @param {number} x
     * @param {number} y
     */
    render : function(path, opacity, x, y){
        if(path !== this._path){
            this.guideWrapper.innerHTML = '<img src="' + path + '">';
            this._path = path;
        }

        this.guideWrapper.style.left = x + 'px';
        this.guideWrapper.style.top = y + 'px';
        this.guideWrapper.style.opacity = opacity;
    },

    /**
     * 엘리먼트를 캐쉬한다.
     * @private
     */
    _assignElements : function(){
        this.guideWrapper = document.querySelector('#light-table .lt-guide');
    }
};
/**
 * ImagesSlider 뷰
 * @constructor
 */
lt.view.ImagesSlider = function(){
    this.selectButton = null;
    this.imagesWrapper = null;
    this.imagesList = null;

    this._assignElements();
};

lt.view.ImagesSlider.prototype = {

    /**
     * 이미지 리스트를 랜더링한다.
     * @param {Array.<string>} paths
     */
    render : function(paths){
        var screenWidth = lt.util.screenWidth(),
            imageWidth = screenWidth - 40,
            html = '';

        paths.forEach(function(image){
            html = html + '<li class="lst-img" style="margin:0 0 0 0px;width:' + imageWidth + 'px">' +
                '<button>선택</button><img src="' + image + '"/></li>';
        });

        this.imagesList.innerHTML = html;
    },

    /**
     * 이미지 슬라이더를 보인다.
     */
    show : function(){
        this.imagesWrapper.style.display = 'block';
    },

    /**
     * 이미지 슬라이더를 감춘다.
     */
    hide : function(){
        this.imagesWrapper.style.display = 'none';
    },

    /**
     * 지정한 좌표 만큼 스와이프한다.
     * @param {number?} dist
     * @param {number?} speed
     */
    swipe : function(dist, speed){
        var transition = '',
            style = this.imagesList.style;

        speed = speed || 0;

        if(speed > 500){
            speed = 500;
        }

        transition = 'all '+ speed +'ms';

        ['webkit', 'moz', 'ms', 'o'].forEach(function(vendor){
            style[vendor + 'Transition'] = transition;
        });

        // transform을 사용하면 ios4 에서 점멸되는
        // 버그가 있어 margin 값으로 조절.
        // 버그 원인을 파악하면 transform 사용하는 코드로 대체 예정
        style.margin = '0 0 0 ' + dist +'px';
        style.transition = transition;
    },

    /**
     * 엘리먼트를 캐쉬한다.
     * @private
     */
    _assignElements : function(){
        this.selectButton = document.querySelector('#light-table .lt-search button');
        this.imagesWrapper = document.querySelector('#light-table .lt-images');
        this.imagesList = this.imagesWrapper.querySelector('ul');
    }
};
/**
 * Mover 뷰
 * @constructor
 */
lt.view.Mover = function(){
    this._assignElements();
};

lt.view.Mover.prototype = {

    /**
     * 엘리먼트를 캐쉬한다.
     * @private
     */
    _assignElements : function(){
        this.moverWrapper = document.querySelector('#light-table .lt-mover');
        this.upButton = this.moverWrapper.querySelector('[data-role=image-pos-up]');
        this.rightButton = this.moverWrapper.querySelector('[data-role=image-pos-right]');
        this.downButton = this.moverWrapper.querySelector('[data-role=image-pos-down]');
        this.leftButton = this.moverWrapper.querySelector('[data-role=image-pos-left]');
        this.draggerButton = this.moverWrapper.querySelector('.lt-dragger button');
    }
};
/**
 * Opaciter 뷰
 * @constructor
 */
lt.view.Opaciter = function(){
    this.opacityButton = null;
    this.opacityArea = null;
    this.opacityAreaHeight = 0;

    this._assignElements();
    this._setComputeOpacityAreaHeight();
};

lt.view.Opaciter.prototype = {

    /**
     * 뷰를 렌더링 한다.
     * @param percent
     */
    render : function(percent){
        this.opacityButton.style.top = percent + '%';
    },

    /**
     * 엘리먼트를 캐쉬한다.
     * @private
     */
    _assignElements : function(){
        this.opacityWrapper = document.querySelector('#light-table .lt-navigation');
        this.opacityArea = this.opacityWrapper.querySelector('.lt-opacity-area');
        this.opacityButton = this.opacityWrapper.querySelector('.lt-opacity-area button');
        this.draggerButton = this.opacityWrapper.querySelector('.lt-dragger button');
    },

    /**
     * 투명도 구역의 높이 값을 계산하여 저장한다.
     * @private
     */
    _setComputeOpacityAreaHeight: function(){
        this.opacityAreaHeight = parseInt(window.getComputedStyle(this.opacityArea).height, 10);
    }
};