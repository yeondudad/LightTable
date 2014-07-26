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
