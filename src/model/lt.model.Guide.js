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