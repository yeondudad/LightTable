QUnit.module('경로 객체 테스트', {
    setup: function(){
        this._path1 = new lt.model.Path('i1');
        this._path2 = new lt.model.Path('i2');
    },
    teardown: function(){
        this._path1 = null;
        this._path2 = null;
    }
});

QUnit.test('경로 값을 설정할 수 있다.', function(){
    this._path1.value('path/test1.png');
    this._path2.value('path/test2.png');

    QUnit.deepEqual(this._path1.value(), 'path/test1.png');
    QUnit.deepEqual(this._path2.value(), 'path/test2.png');
});

QUnit.test('경로 값을 초기화할 수 있다', function(){
    this._path1.value('path/test1.png');
    this._path2.value('path/test2.png');
    this._path1.clear();
    this._path2.clear();

    QUnit.deepEqual(this._path1.value(), null);
    QUnit.deepEqual(this._path2.value(), null);
});

QUnit.test('경로 값이 없으면 null을 반환한다.', function(){
    QUnit.deepEqual(this._path1.value(), null);
    QUnit.deepEqual(this._path2.value(), null);
});

QUnit.test('경로 값 변경에 대한 리스너를 등록할 수 있다.', function(){
    this._path1.addUpdateListener(function(image){
        QUnit.deepEqual(image, 'path/test1.png');
    });

    this._path2.addUpdateListener(function(image){
        QUnit.deepEqual(image, 'path/test2.png');
    });

    this._path1.value('path/test1.png');
    this._path2.value('path/test2.png');
});