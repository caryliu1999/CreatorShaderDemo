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

@ccclass
export default class Rain extends cc.Component {
    @property({
        type: cc.Sprite
    })
    sprite: cc.Sprite = null;

    _time = 0;
    _material = null;

    onEnable() {
        this._material = this.sprite.sharedMaterials[0];
    }
    update(dt) {
        if (this.node.active && this._material) {
            this.setTime(dt);
        }
    }
    setTime(dt) {
        this._time += dt;
        if (this._time >= 1000) {
            this._time = 0;
        }
        this._material.setProperty('time', this._time);
    }
}
