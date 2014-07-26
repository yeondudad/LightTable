QUnit.module('이미지 객체 테스트', {
    setup: function(){
        this._images = new lt.model.Images('images', [
            '/LightTable/demo/img/demo-0.png',
            '/LightTable/demo/img/demo-1.png',
            '/LightTable/demo/img/demo-2.png',
            '/LightTable/demo/img/demo-3.png'
        ]);
    },
    teardown: function(){
        this._images = null;
    }
});

QUnit.test('이미지의 목록을 순회할 수 있다.', function(){
    var image, count;

    this._images.each(function(img, iter){
        image = img;
        count = iter;
    });

    QUnit.deepEqual(count, 3);
    QUnit.deepEqual(image, '/LightTable/demo/img/demo-3.png');
});

QUnit.test('이미지의 속성을 설정할 수 있다.', function(){
    this._images.path('path/test.png');
    this._images.opacity(0.5);
    this._images.position({x: 15, y: 20});

    QUnit.deepEqual(this._images.path(), 'path/test.png');
    QUnit.deepEqual(this._images.opacity(), 0.5);
    QUnit.propEqual(this._images.position(), {x: 15, y: 20});
});

QUnit.test('이미지의 속성을 초기화할 수 있다.', function(){
    this._images.path('path/test.png');
    this._images.opacity(0.5);
    this._images.position({x: 15, y: 20});
    this._images.clear();

    QUnit.deepEqual(this._images.path(), null);
    QUnit.deepEqual(this._images.opacity(), 0);
    QUnit.propEqual(this._images.position(), {x: 0, y: 0});
});

QUnit.test('이미지의 속성 값이 없으면 초기값을 반환한다.', function(){
    QUnit.deepEqual(this._images.path(), null);
    QUnit.deepEqual(this._images.opacity(), 0);
    QUnit.propEqual(this._images.position(), {x: 0, y: 0});
});

QUnit.test('퍼센트 값을 이미지의 투명도 값으로 저장할 수 있다.', function(){
    this._images.opacityToPercent(70);

    QUnit.deepEqual(this._images.opacity(), 0.7);
});

QUnit.test('이미지의 속성 값 변경에 대한 리스너를 등록할 수 있다.', function(){
    this._images.addPathListener(function(path){
        QUnit.deepEqual(path, 'path/image.png');
    });

    this._images.addOpacityListener(function(opacity){
        QUnit.deepEqual(opacity, 0.7);
    });

    this._images.addPositionListener(function(position){
        QUnit.deepEqual(position, {x: 1, y: 2});
    });

    this._images.path('path/image.png');
    this._images.opacity(0.7);
    this._images.position({x: 1, y: 2});
});