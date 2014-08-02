/**
 * LightTable 모듈 빌드 함수
 * @author    ju.uyeong<ju.uyeong@nhn.com>
 * @version   0.0.3
 * @copyright 2014 UIT Licensed under the MIT license.
 * @param {Array.<string>} paths 배열로 선언한 이미지 파일 경로 목록
 * @example
 * var lightTable = LightTable([
 *     './img/demo-0.png',
 *     './img/demo-1.png',
 *     './img/demo-2.png',
 *     './img/demo-3.png',
 * ]);
 */
function LightTable(paths){
    document.body.insertAdjacentHTML('beforeend', lt.template.lightTable);

    var pathsModel = new lt.model.Paths(paths),
        guideModel = new lt.model.Guide(),
        imagesSliderView = new lt.view.ImagesSlider(),
        opaciterView = new lt.view.Opaciter(),
        guideView = new lt.view.Guide(),
        moverView = new lt.view.Mover();

    lt.controller.ImagesSlider(imagesSliderView, pathsModel);
    lt.controller.Opaciter(opaciterView, guideModel);
    lt.controller.Guide(guideView, pathsModel, guideModel);
    lt.controller.Mover(moverView, guideModel);
}
