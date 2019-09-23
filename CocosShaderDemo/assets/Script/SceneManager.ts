const {ccclass, property} = cc._decorator;

@ccclass
export default class SceneManager extends cc.Component {
    public static SceneList = {
        "GamePlay": ["PointLight", "Smoke", "Water"],
        "Texture": ["Blur", "Fluxay", "PostTexture", "PostRenderTexture"],
        "Weather": ["Cloud", "Rain", "Snow", "Stormy"],
    }

    public static GroupName:string = "";

    @property({
        type: cc.Node
    })
    BtnNode:cc.Node = null;

    start () {
        cc.game.addPersistRootNode(this.node);
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLoaded, this);
    }

    onSceneLoaded (scene) {
        this.BtnNode.active = scene.name !== "Start";
    }
}