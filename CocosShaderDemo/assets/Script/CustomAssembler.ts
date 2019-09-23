export default class CustomAssembler extends cc.Assembler {
    verticesCount = 4;
    indicesCount = 6;
    uvOffset = 2;
    colorOffset = 4;
    floatsPerVert = 5;

    _renderData = null;
    _local = null;

    init (comp) {
        super.init(comp);
        this._renderData = new cc.RenderData();
        this._renderData.init(this);

        this.initLocal();
        this.initData();
    }

    //override
    updateRenderData (comp) {
        if (comp._vertsDirty) {
            this.updateUVs(comp);
            this.updateVerts(comp);
            comp._vertsDirty = false;
        }
    }

    updateUVs (comp) {
        let uv = [0, 0, 1, 0, 0, 1, 1, 1];
        let uvOffset = this.uvOffset;
        let floatsPerVert = this.floatsPerVert;
        let verts = this._renderData.vDatas[0];
        for (let i = 0; i < 4; i++) {
            let srcOffset = i * 2;
            let dstOffset = floatsPerVert * i + uvOffset;
            verts[dstOffset] = uv[srcOffset];
            verts[dstOffset + 1] = uv[srcOffset + 1];
        }
    }

    updateVerts (comp) {
        let node = comp.node,
            cw = node.width, ch = node.height,
            appx = node.anchorX * cw, appy = node.anchorY * ch,
            l, b, r, t;

        l = - appx;
        b = - appy;
        r = cw - appx;
        t = ch - appy;

        let local = this._local;
        local[0] = l;
        local[1] = b;
        local[2] = r;
        local[3] = t;
        this.updateWorldVerts(comp);
    }

    get verticesFloats () {
        return this.verticesCount * this.floatsPerVert;
    }

    initData () {
        let data = this._renderData;
        data.createQuadData(0, this.verticesFloats, this.indicesCount);
    }

    initLocal () {
        this._local = [];
        this._local.length = 4;
    }

    updateColor (comp, color) {
        let uintVerts = this._renderData.uintVDatas[0];
        if (!uintVerts) return;
        color = color ||comp.node.color._val;
        let floatsPerVert = this.floatsPerVert;
        let colorOffset = this.colorOffset;
        for (let i = colorOffset, l = uintVerts.length; i < l; i += floatsPerVert) {
            uintVerts[i] = color;
        }
    }

    getBuffer () {
        return cc.renderer._handle._meshBuffer;
    }

    updateWorldVerts (comp) {
        let local = this._local;
        let verts = this._renderData.vDatas[0];

        let matrix = comp.node._worldMatrix;
        let matrixm = matrix.m,
            a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
            tx = matrixm[12], ty = matrixm[13];

        let vl = local[0], vr = local[2],
            vb = local[1], vt = local[3];
        
        let justTranslate = a === 1 && b === 0 && c === 0 && d === 1;

        if (justTranslate) {
            // left bottom
            verts[0] = vl + tx;
            verts[1] = vb + ty;
            // right bottom
            verts[5] = vr + tx;
            verts[6] = vb + ty;
            // left top
            verts[10] = vl + tx;
            verts[11] = vt + ty;
            // right top
            verts[15] = vr + tx;
            verts[16] = vt + ty;
        } else {
            let al = a * vl, ar = a * vr,
            bl = b * vl, br = b * vr,
            cb = c * vb, ct = c * vt,
            db = d * vb, dt = d * vt;

            // left bottom
            verts[0] = al + cb + tx;
            verts[1] = bl + db + ty;
            // right bottom
            verts[5] = ar + cb + tx;
            verts[6] = br + db + ty;
            // left top
            verts[10] = al + ct + tx;
            verts[11] = bl + dt + ty;
            // right top
            verts[15] = ar + ct + tx;
            verts[16] = br + dt + ty;
        }
    }

    fillBuffers (comp, renderer) {
        if (renderer.worldMatDirty) {
            this.updateWorldVerts(comp);
        }

        let renderData = this._renderData;
        let vData = renderData.vDatas[0];
        let iData = renderData.iDatas[0];

        let buffer = this.getBuffer();
        let offsetInfo = buffer.request(this.verticesCount, this.indicesCount);

        // buffer data may be realloc, need get reference after request.

        // fill vertices
        let vertexOffset = offsetInfo.byteOffset >> 2,
            vbuf = buffer._vData;

        if (vData.length + vertexOffset > vbuf.length) {
            vbuf.set(vData.subarray(0, this.verticesFloats), vertexOffset);
        }
        else {
            vbuf.set(vData, vertexOffset);
        }

        // fill indices
        let ibuf = buffer._iData,
            indiceOffset = offsetInfo.indiceOffset,
            vertexId = offsetInfo.vertexOffset;
        for (let i = 0, l = iData.length; i < l; i++) {
            ibuf[indiceOffset++] = vertexId + iData[i];
        }
    }
}
