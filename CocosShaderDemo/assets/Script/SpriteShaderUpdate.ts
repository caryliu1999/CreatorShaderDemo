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
export default class SpriteShaderUpdate extends cc.Component {
    
    @property
    _sprite = null;
    
    @property({
        type: cc.Sprite
    })
    get sprite {
        return this._sprite;
    };

    set sprite (spr) {
        this._sprite = spr;
        if (this._sprite) {
            this._material = this._sprite.sharedMaterials[0];
        }
    }


    @property
    limit = 1000;

    @property
    step = 0.1;

    _material: cc.Material = null;
    _time = 0;

    onEnable() {
        if (this.sprite) {
            this._material = this.sprite.sharedMaterials[0];
        }
    }

    update(dt) {
        if (this._material) {
            this.setTime(dt);
        }
    }

    setTime(dt) {
        this._time += this.step;
        this._time = this._time >= this.limit ? 0 : this._time;
        this._material.setProperty('time', this._time);
    }

    onDisable() {
        this._material = null;
    }
}
