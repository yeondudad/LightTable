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
