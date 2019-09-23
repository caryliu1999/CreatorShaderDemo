const {ccclass, property} = cc._decorator;
import CustomAssembler from './CustomAssembler'

@ccclass
export default class CustomRenderComponent extends cc.RenderComponent {
    onEnable () {
        super.onEnable();
        this._activateMaterial();
    }

    //override
    _resetAssembler () {
        this.setVertsDirty(true);
        this._assembler = new CustomAssembler();
        this._assembler.init(this);
    }

    //override
    _activateMaterial () {
        let material = this.sharedMaterials[0];
        if (!material) {
            this.disableRender();
            return;
        }
        
        material = cc.Material.getInstantiatedMaterial(material, this);
        this.setMaterial(0, material);
        this.markForRender(true);
    }
}
