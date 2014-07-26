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
