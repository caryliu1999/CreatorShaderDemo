
const MeshBuffer = cc.MeshBuffer;
const InputAssembler = cc.renderer.InputAssembler;

export default class CustomIAAssembler extends cc.Assembler {
    _buffer = null;
    _ia = null;
    _vfmt = null;

    init (comp) {
        super.init(comp);
        
        this._buffer = null;
        this._ia = null;

        this._vfmt = cc.gfx.VertexFormat.XY_UV_Color;
    }

    getBuffer () {
        if (!this._buffer) {
            // Create quad buffer for vertex and index
            this._buffer = new MeshBuffer(cc.renderer._handle, this._vfmt);

            this._ia = new InputAssembler();
            this._ia._vertexBuffer = this._buffer._vb;
            this._ia._indexBuffer = this._buffer._ib;
            this._ia._start = 0;
            this._ia._count = 0;
        }
        return this._buffer;
    }
    
    fillBuffers (comp, renderer) {
        if (!this._ia) return;
        
        renderer.node = comp.node;
        renderer.material = comp.sharedMaterials[0];
        renderer._flushIA(this._ia);
    }
}
