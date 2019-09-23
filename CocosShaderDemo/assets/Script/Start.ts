// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import SceneManager from './SceneManager'

@ccclass
export default class Start extends cc.Component {
    start () {
        var gl = cc.game._renderContext;
        gl.getExtension('OES_standard_derivatives');
    }

    onClickSubView (event, name) {
        if (!name || !SceneManager.SceneList[name]) {
            return 
        }

        SceneManager.GroupName = name;

        let scene = SceneManager.SceneList[name][0];
        cc.director.loadScene(scene);
    }
}
