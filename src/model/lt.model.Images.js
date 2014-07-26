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
