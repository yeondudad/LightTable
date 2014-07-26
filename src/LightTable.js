/**
 * LightTable 모듈 빌드 함수
 * @author    ju.uyeong<ju.uyeong@nhn.com>
 * @version   0.0.2
 * @copyright 2014 UIT Licensed under the MIT license.
 * @param {Array.<string>} images 배열로 선언한 이미지 파일이 있는 URL
 * @returns {LightTableComponents}
 * @example
 * var lightTable = LightTable([
 *     './img/demo-0.png',
 *     './img/demo-1.png',
 *     './img/demo-2.png',
 *     './img/demo-3.png',
 * ]);
 */
function LightTable(images){

    /**
     * 라이트 테이블 반환 모델
     * @typedef {Object} LightTableModels
     * @property {lt.model.Images} images
     * @property {lt.model.Position} navigationPosition
     * @property {lt.model.Position} moverPosition
     */

    /**
     * 라이트 테이블 반환 컨트롤러
     * @typedef {Object} LightTableControllers
     * @property {lt.controller.Opaciter} opaciter
     * @property {lt.controller.Mover} mover
     * @property {lt.controller.Images} images
     * @property {lt.controller.Guide} guide
     * @property {lt.controller.Dragger} opaciterDragger
     * @property {lt.controller.Dragger} moverDragger
     */

    /**
     * 라이트 테이블 반환 객체
     * @typedef {Object} LightTableComponents
     * @property {LightTableModels} models
     * @property {LightTableControllers} controllers
     */

    // assign elements
    var lightTableElement = document.querySelector('#light-table'),
        naviElement = lightTableElement.querySelector('.lt-navigation'),
        opacityElement = lightTableElement.querySelector('.lt-opacity'),
        moverElement = lightTableElement.querySelector('.lt-mover'),
        imagesElement = lightTableElement.querySelector('.lt-images'),
        guideElement = lightTableElement.querySelector('.lt-guide'),
        searchButtonElement = lightTableElement.querySelector('.lt-search button'),
        naviDragButtonElement = naviElement.querySelector('.lt-dragger button'),
        moverDragButtonElement = moverElement.querySelector('.lt-dragger button'),

    // init models
        imagesModel = new lt.model.Images('LightTableImages', images),
        navPositionModel = new lt.model.Position('LightTableNavigation'),
        movPositionModel = new lt.model.Position('LightTableMover'),

    // init controllers
        opaciterController = new lt.controller.Opaciter(opacityElement, imagesModel),
        moverController = new lt.controller.Mover(moverElement, imagesModel),
        imagesController = new lt.controller.Images(searchButtonElement, imagesElement, imagesModel),
        guideController = new lt.controller.Guide(guideElement, imagesModel),

    // init draggers
        opaciterDragController = new lt.controller.Dragger(naviElement, naviDragButtonElement, navPositionModel),
        moverDragController = new lt.controller.Dragger(moverElement, moverDragButtonElement, movPositionModel);

    // returns models and controllers
    return {
        models : {
            images : imagesModel,
            navigationPosition : navPositionModel,
            moverPosition : movPositionModel
        },
        controllers : {
            opaciter : opaciterController,
            mover : moverController,
            images : imagesController,
            guide : guideController,
            opaciterDragger : opaciterDragController,
            moverDragger : moverDragController
        }
    };
}
