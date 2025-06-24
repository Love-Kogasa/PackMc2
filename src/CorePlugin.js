class CorePlugin {
  coreVersion = "1.0.92"
  constructor( pluginDefine, PMC, ContextClass, AddonClass ){
    this.define = pluginDefine
    this.PMC = PMC
    this.AddonClass = AddonClass
    this.ContextClass = ContextClass
  }
  initOnMinecraft( mcobj ){
    
  }
  initOnNode(){
    
  }
}

module.exports = {CorePlugin}

