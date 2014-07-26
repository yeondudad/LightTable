QUnit.module('투명도 객체 테스트', {
    setup: function(){
        this._opacity1 = new lt.model.Opacity('o1');
        this._opacity2 = new lt.model.Opacity('o2');
    },
    teardown: function(){
        this._opacity1 = null;
        this._opacity2 = null;
    }
});

QUnit.test('투명도 값을 설정할 수 있다.', function(){
    this._opacity1.value(0.5);
    this._opacity2.value(1);

    QUnit.deepEqual(this._opacity1.value(), 0.5);
    QUnit.deepEqual(this._opacity2.value(), 1);
});

QUnit.test('투명도 값을 초기화할 수 있다.', function(){
    this._opacity1.value(0.5);
    this._opacity2.value(0.3);
    this._opacity1.clear();
    this._opacity2.clear();

    QUnit.deepEqual(this._opacity1.value(), 0);
    QUnit.deepEqual(this._opacity2.value(), 0);
});

QUnit.test('투명도 값이 없으면 0을 반환한다.', function(){
    QUnit.deepEqual(this._opacity1.value(), 0);
    QUnit.deepEqual(this._opacity2.value(), 0);
});

QUnit.test('퍼센트 값을 투명도 값으로 저장할 수 있다.', function(){
    this._opacity1.toPercent(100);
    this._opacity2.toPercent(50);

    QUnit.deepEqual(this._opacity1.value(), 1);
    QUnit.deepEqual(this._opacity2.value(), 0.5);
});

QUnit.test('투명도 값 변경에 대한 리스너를 등록할 수 있다.', function(){
    this._opacity1.addUpdateListener(function(opacity){
        QUnit.deepEqual(opacity, 0.5);
    });

    this._opacity2.addUpdateListener(function(opacity){
        QUnit.deepEqual(opacity, 0.8);
    });

    this._opacity1.value(0.5);
    this._opacity2.value(0.8);
});