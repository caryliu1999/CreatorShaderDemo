const {ccclass, property} = cc._decorator;
import CustomRenderComponent from '../../../Script/CustomRenderComponent'

@ccclass
export default class PostRenderTexture extends cc.Component {
    @property({
        type: cc.Camera
    })
    camera: cc.Camera = null;

    @property
    _sprite:cc.Sprite = null;

    @property({
        type: CustomRenderComponent
    })
    get sprite () {
        return this._sprite;
    }

    set sprite (val) {
        this._sprite = val;
        this.initMaterial();
    }

    texture:cc.RenderTexture = null;
    material:cc.Material = null;
    start () {
        this.initMaterial();
    }

    initMaterial () {
        this.material = this.sprite.sharedMaterials[0];

        if (!this.texture) {
            this.texture = new cc.RenderTexture();
            this.texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height);
            this.camera.targetTexture = this.texture;
            this.camera.render();
        }

        this.sprite.spriteFrame = new cc.SpriteFrame(this.texture);
        this.material.setProperty('texture', this.texture);
    }
}
