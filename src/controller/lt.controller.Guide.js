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
