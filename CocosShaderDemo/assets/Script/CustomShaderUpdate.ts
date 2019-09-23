const {ccclass, property} = cc._decorator;
import CustomRenderComponent from './CustomRenderComponent';

@ccclass
export default class SpriteShaderUpdate extends cc.Component {
    
    @property
    _component = null;
    
    @property({
        type: CustomRenderComponent
    })
    get component () {
        return this._component;
    }

    set component (comp) {
        this._component = comp;
        if (this._component) {
            this._material = this._component.sharedMaterials[0];
        }
    }

    @property
    limit = 1000;

    @property
    step = 0.1;

    _material: cc.Material = null;
    _time = 0;

    onEnable() {
        if (this.component) {
            this._material = this.component.sharedMaterials[0];
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
