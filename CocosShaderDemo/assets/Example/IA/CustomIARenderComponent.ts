const {ccclass, property} = cc._decorator;
import CustomIAAssembler from './CustomIAAssembler'

@ccclass
export default class CustomIARenderComponent extends cc.RenderComponent {
    @property
    _texture = null;
    
    @property({
        type: cc.Texture2D
    })
    get texture () {
        return this._texture;
    }

    set texture (val) {
        if (this._texture !== val) {
            this._texture = val;
            this.applyTexture();
        }
    }

    uv = [];
    local = [];
    posOffset = 0;
    max = 100;
    direction = 1;
    speed = 10;
    onEnable () {
        super.onEnable();
        this._activateMaterial();

        this.initVertexData();
    }

    //override
    _resetAssembler () {
        this.setVertsDirty(true);
        this._assembler = new CustomIAAssembler();
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
        material.setProperty("texture", this.texture);
        this.setMaterial(0, material);
        this.markForRender(true);
    }

    applyTexture () {
        let material = this.getMaterial(0);
        if (!material) {
            return
        }

        material.setProperty("texture", this.texture);
    }

    initVertexData () {
        let buffer = this._assembler.getBuffer();
        buffer.reset();
        buffer.request(4, 6);

        this.fillUV(buffer);
        this.fillIndices(buffer);
        this.fillVertex(buffer);

        buffer.uploadData();

        this._assembler._ia._count = 6;
    }

    update (dt) {
        if (!this.getMaterial(0)) { 
            return
        }

        this.direction = this.posOffset >= this.max ? -1 : this.direction;
        this.direction = this.posOffset <= 0 ? 1 : this.direction;
        let step = dt * this.direction * this.speed;
        this.posOffset = this.posOffset + step;

        let buffer = this._assembler.getBuffer();
        let vbuf = buffer._vData;
  
        vbuf[0] += step;
        vbuf[15] -= step;

        buffer._vb.update(0, vbuf);
    }

    fillUV (buffer) {
        let l = 0, r = 1, b = 1, t = 0;
        let vbuf = buffer._vData;

        vbuf[2] = l;
        vbuf[3] = b;
        vbuf[7] = r;
        vbuf[8] = b;
        vbuf[12] = l;
        vbuf[13] = t;
        vbuf[17] = r;
        vbuf[18] = t;
    }

    fillIndices (buffer) {
        let iData = buffer._iData;
        iData[0] = 0;
        iData[1] = 1;
        iData[2] = 2;
        iData[3] = 1;
        iData[4] = 3;
        iData[5] = 2;

        let indicesData = new Uint16Array(iData.buffer, 0, iData.length);
        buffer._ib.update(0, indicesData);
    }

    fillVertex (buffer) {
        let uintbuf = buffer._uintVData;
        
        let node = this.node,
        cw = node.width, ch = node.height,
        appx = node.anchorX * cw, appy = node.anchorY * ch;

        let l = - appx,
            b = - appy,
            r = cw - appx,
            t = ch - appy;

        let local = this.local;
        local[0] = l;
        local[1] = b;
        local[2] = r;
        local[3] = t;

        // color
        uintbuf[4] = this.node.color._val;
        uintbuf[9] = this.node.color._val;
        uintbuf[14] = this.node.color._val;
        uintbuf[19] = this.node.color._val;

        this.updateWorldVerts(buffer);
    }

    updateWorldVerts (buffer) {

        this.node._updateWorldMatrix();
        
        let vbuf = buffer._vData;
        let local = this.local;
        let matrix = this.node._worldMatrix;
        let matrixm = matrix.m,
            a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
            tx = matrixm[12], ty = matrixm[13];

        let vl = local[0], vr = local[2],
            vb = local[1], vt = local[3];
        
        let justTranslate = a === 1 && b === 0 && c === 0 && d === 1;

        if (justTranslate) {
            // left bottom
            vbuf[0] = vl + tx;
            vbuf[1] = vb + ty;
            // right bottom
            vbuf[5] = vr + tx ;
            vbuf[6] = vb + ty;
            // left top
            vbuf[10] = vl + tx;
            vbuf[11] = vt + ty;
            // right top
            vbuf[15] = vr + tx;
            vbuf[16] = vt + ty;
        } else {
            let al = a * vl, ar = a * vr,
            bl = b * vl, br = b * vr,
            cb = c * vb, ct = c * vt,
            db = d * vb, dt = d * vt;

            // left bottom
            vbuf[0] = al + cb + tx;
            vbuf[1] = bl + db + ty;
            // right bottom
            vbuf[5] = ar + cb + tx;
            vbuf[6] = br + db + ty;
            // left top
            vbuf[10] = al + ct + tx;
            vbuf[11] = bl + dt + ty;
            // right top
            vbuf[15] = ar + ct + tx;
            vbuf[16] = br + dt + ty;
        }
    }
}
