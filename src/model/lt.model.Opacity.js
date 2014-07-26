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
