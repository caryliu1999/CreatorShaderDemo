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
export default class SubScene extends cc.Component {

    private index: number = 0;
    private max: number = 0;

    onEnable () {
        this.max = SceneManager.SceneList[SceneManager.GroupName].length;
    }

    clickPrev () {
        this.index--;
        if (this.index < 0) {
            this.index = this.max - 1;
        }

        let scene = SceneManager.SceneList[SceneManager.GroupName][this.index];
        cc.director.loadScene(scene);
    }

    clickReturn () {
        this.index = 0;
        cc.director.loadScene("Start");
    }

    clickNext () {
        this.index++;
        if (this.index >= this.max) {
            this.index = 0;
        }

        let scene = SceneManager.SceneList[SceneManager.GroupName][this.index];
        cc.director.loadScene(scene);
    }
}
