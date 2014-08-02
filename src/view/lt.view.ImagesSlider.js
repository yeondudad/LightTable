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