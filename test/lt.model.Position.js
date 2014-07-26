QUnit.module('포지션 객체 테스트', {
    setup: function(){
        this._position1 = new lt.model.Position('p1');
        this._position2 = new lt.model.Position('p2');
    },
    teardown: function(){
        this._position1 = null;
        this._position2 = null;
    }
});

QUnit.test('포지션 값을 설정할 수 있다.', function(){
    this._position1.value({x: 10, y: 15});
    this._position2.value({x: 20, y: 30});

    QUnit.propEqual(this._position1.value(), {x: 10, y: 15});
    QUnit.propEqual(this._position2.value(), {x: 20, y: 30});
});

QUnit.test('포지션 값을 초기화할 수 있다.', function(){
    this._position1.value({x: 10, y: 15});
    this._position2.value({x: 20, y: 30});
    this._position1.clear();
    this._position2.clear();

    QUnit.propEqual(this._position1.value(), {x: 0, y: 0});
    QUnit.propEqual(this._position2.value(), {x: 0, y: 0});
});

QUnit.test('포지션 값이 없으면 0을 반환한다.', function(){
    QUnit.propEqual(this._position1.value(), {x: 0, y: 0});
    QUnit.propEqual(this._position2.value(), {x: 0, y: 0});
});

QUnit.test('포지션 값 변경에 대한 리스너를 등록할 수 있다.', function(){
    this._position1.addUpdateListener(function(position){
        QUnit.propEqual(position, {x: 10, y: 15});
    });

    this._position2.addUpdateListener(function(position){
        QUnit.propEqual(position, {x: 20, y: 30});
    });

    this._position1.value({x: 10, y: 15});
    this._position2.value({x: 20, y: 30});
});