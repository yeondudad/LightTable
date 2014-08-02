![LightTable 0.0.3. 1PX의 책임, 마크업 개발자를 위한 디자인 가이드라인 컨트롤러. 편하게, 빠르게, 정확하게 LightTable이 도와드립니다.](https://raw.githubusercontent.com/UYEONG/LightTable/0.0.3/light_table_main.png)

# LightTable

## Help
  * [demo(mobile)](http://uyeong.github.io/LightTable/demo)
  * [documentation](http://uyeong.github.io/LightTable/docs)

## Test
  * ios4, ios5

## Downloads
  * [lightTable-0.0.3.min.css](https://github.com/UYEONG/LightTable/blob/0.0.3/build/LightTable-0.0.3.min.css)
  * [lightTable-0.0.3.min.js](https://github.com/UYEONG/LightTable/blob/0.0.3/build/LightTable-0.0.3.min.js)

## How to use
    bower install lighttable

## Examples
    <link rel="stylesheet" href="./bower_components/build/LightTable-0.0.3.min.css"/>
    <script src="./bower_components/build/LightTable-0.0.3.min.js"></script>
    <script>
        var lightTable = LightTable([
            './img/demo-0.png',
            './img/demo-1.png',
            './img/demo-2.png',
            './img/demo-3.png',
        ]);
    </script>

## Release History
#### 2014.08.02 - LightTable-0.0.3.js
  * JSDoc3 테마 변경 완료 [#1](https://github.com/UYEONG/LightTable/issues/1) 
  * 이미지 셀렉터에서 화면 전환하면 리사이즈 안되던 문제 해결 [#2](https://github.com/UYEONG/LightTable/issues/2)
  * 드래그 button의 dara-role을 잘못 작성한 문제 해결 [#3](https://github.com/UYEONG/LightTable/issues/3) 
  * 컨트롤러 설계 변경 완료 [#5](https://github.com/UYEONG/LightTable/issues/5)
  
#### 2014.07.26 - LightTable-0.0.2.js
  * 디자인 변경
  * 설계 변경 및 재구현
  * 라이브러리 의존성 제거

#### 2014.05.08 - LightTable-0.0.1.js
  * 이미지 선택 기능
  * 이미지 투명도 조절 기능
  * 이미지 위치 조정 기능
  * 투명도 컨트롤 드래그 기능
  * 위치 조정 컨트롤 드래그 기능
  * 컴포넌트 뷰 상태 기억 기능
  * 데이터 초기화 및 뷰 초기화 기능

## License

Copyright (c) 2014 ju.uyeong
Licensed under the MIT license.
