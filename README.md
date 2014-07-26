![LightTable 0.0.1. 1PX의 책임, 마크업 개발자를 위한 디자인 가이드라인 컨트롤러. 편하게, 빠르게, 정확하게 LightTable이 도와드립니다.](https://raw.githubusercontent.com/UYEONG/LightTable/0.0.2/light_table_main.png)

# LightTable

## Help
  * [demo(mobile)](http://uyeong.github.io/LightTable/demo)
  * [documentation](http://uyeong.github.io/LightTable/docs)

## Test
  * ios4(safari6), ios5(safari7)

## Downloads
  * [lightTable-0.0.2.html](https://github.com/UYEONG/LightTable/blob/0.0.2/build/LightTable-0.0.2.html)
  * [lightTable-0.0.2.min.css](https://github.com/UYEONG/LightTable/blob/0.0.2/build/LightTable-0.0.2.min.css)
  * [lightTable-0.0.2.min.js](https://github.com/UYEONG/LightTable/blob/0.0.2/build/LightTable-0.0.2.min.js)

## How to use
    bower install lighttable

## Examples
    <link rel="stylesheet" href="./bower_components/build/LightTable-0.0.2.min.css"/>
    
    <!-- /////////////////////////////////////// -->
    <!-- /////// LightTable HTML - START /////// -->
    <!-- /////////////////////////////////////// -->
    <div id="light-table">
        <div class="lt-navigation">
            <div class="lt-search">
                <button type="button" data-role="image-search"><span>검색</span></button>
            </div>
            <div class="lt-opacity">
                <div class="lt-opacity-bar">
                    <div class="lt-opacity-area">
                        <button type="button" data-role="image-opacity"><span>투명도 조정</span></button>
                    </div>
                </div>
            </div>
            <div class="lt-dragger">
                <button type="button" data-role="navigation-mover"><span>이동</span></button>
            </div>
        </div>
    
        <div class="lt-mover">
            <div class="lt-mover-buttons">
                <button type="button" data-role="image-pos-up"><span>&#8593;</span></button>
                <button type="button" data-role="image-pos-right"><span>&#8594;</span></button>
                <button type="button" data-role="image-pos-down"><span>&#8595;</span></button>
                <button type="button" data-role="image-pos-left"><span>&#8592;</span></button>
            </div>
            <div class="lt-dragger">
                <button type="button" data-role="navigation-mover"><span>이동</span></button>
            </div>
        </div>
    
        <div class="lt-images"><ul></ul></div>
        <div class="lt-guide"></div>
    </div>
    <!-- /////////////////////////////////////// -->
    <!-- //////// LightTable HTML - END //////// -->
    <!-- /////////////////////////////////////// -->

    <script src="./bower_components/build/LightTable-0.0.2.min.js"></script>
    <script>
        /**
         * @type {LightTableComponents}
         */
        var lightTable = LightTable([
            './img/demo-0.png',
            './img/demo-1.png',
            './img/demo-2.png',
            './img/demo-3.png',
        ]);
    </script>

## Release History
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
