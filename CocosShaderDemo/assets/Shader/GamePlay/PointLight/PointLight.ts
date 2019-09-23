const {ccclass, property} = cc._decorator;

import CustomRenderComponent from '../../../Script/CustomRenderComponent'

@ccclass
export default class PointLight extends cc.Component {

    @property({
        type: CustomRenderComponent
    })
    component: CustomRenderComponent = null;

    _material = null;
    _down = false;
    _mouse = cc.v2(0, 0);

    onEnable () {
        this._material = this.component.sharedMaterials[0];
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.mouseDown, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.mouseMove, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.mouseLeave, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.mouseUp, this);
    }

    mouseDown (event) {
        this._down = true;
    }

    mouseMove (event) {
        if (!this._down) {
            event.stopPropagation();
            return
        }

        this._mouse.x = event.getLocationX() / cc.winSize.width;
        this._mouse.y = event.getLocationY() / cc.winSize.height;
        this.setMouse();
    }

    mouseLeave (event) {
        if (!this._down) {
            event.stopPropagation();
            return
        }
        this._down = false;
    }

    mouseUp (event) {
        if (!this._down) {
            event.stopPropagation();
            return
        }
        this._down = false;
    }

    setMouse () {
        if (this.node.active && this._material) {
            this._material.setProperty('mouse', cc.v2(this._mouse));
        }
    }
}
