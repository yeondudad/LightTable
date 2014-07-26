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
