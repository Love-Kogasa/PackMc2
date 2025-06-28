var path = require( "path" )
var fs = require( "fs" )

var PMC = {}

// Plugin Class
var { ActivePlugin, RePackMcPlugin } = require( "./src/Plugin.js" )
PMC.ActivePlugin = ActivePlugin
PMC.RePackMcPlugin = RePackMcPlugin

// Default Plugin
var {Event, TickEvent} = require( "./src/napi/Event" )
PMC.Recipe = require( "./src/napi/Recipe" )
PMC.Function = require( "./src/napi/Function" )
PMC.Block = require( "./src/napi/Block" )
PMC.Loot = require( "./src/napi/Loot" )
PMC.Vanilla = require( "./src/napi/Vanilla/Vanilla" )
PMC.Minecraft = require( "./src/ActiveCore/Minecraft" )
PMC.isMinecraftRunTime = PMC.Minecraft.isMinecraftRunTime
PMC.Event = Event
PMC.TickEvent = TickEvent
PMC.EventEmitterType = {
  List: "sequence", Rand: "randomize"
}
PMC.Item = class extends PMC.RePackMcPlugin {
  constructor( ctx ){
    super( "Item", ctx, require( "./src/oapi/item" ) )
    ctx.Items = []
    ctx.Item = ( name, option = {}, createFile = true ) => {
      var item = this.callMethod( createFile, ctx.namespace + ":item" + ctx.Items.length, "item" + ctx.Items.length, name, option.type || "equipment" )
      var jump = [ "type" ]
      for( let key of Object.keys( option ) ){
        if( jump.includes( key ) ) continue;
        item.set( key, option[key] )
      }
      if( createFile ){
        console.log( "Tip: 物品" + name + "的贴图路径为 Addon目录/resources/textures/items/item" + ctx.Items.length + ".(png|jpg)" )
        if( this.file( "resources/textures/item_texture.json" ) ){
          var json = JSON.parse(this.read( "resources/textures/item_texture.json" ))
          json.texture_data[ "item" + ctx.Items.length ] = { textures: "textures/items/item" + ctx.Items.length }
          this.write( "resources/textures/item_texture.json", JSON.stringify( json, 0, 2 ) )
        } else {
          var json = {texture_data: {}}
          json.texture_data[ "item" + ctx.Items.length ] = { textures: "textures/items/item" + ctx.Items.length }
          this.write( "resources/textures/item_texture.json", JSON.stringify( json, 0, 2 ) )
        }
        ctx.Items.push( name )
      }
      return item
    }
  }
}

// Core plugin (Version >= 1.0.92)
PMC.InsertClass = class {
  static initMethods = []
  static INIT = "constructor"
  static registryMethod( name, value ){
    if( name = "constructor" ){
      this.initMethods.push( value )
    } else {
      this.prototype[name] = value
    }
  }
  constructor(){
    PMC.InsertClass.initMethods.forEach((method) => {
      method.call( this )
    })
  }
}
PMC.Plugins = {}
PMC.loadCorePlugin = function( plugin ){
  var plugin = new plugin( PMC, PMC.Context, PMC.Addon )
  if( PMC.isMinecraftRunTime ){
    plugin.initOnMinecraft( PMC.Minecraft )
  } else plugin.initOnNode()
  PMC.Plugins[plugin.define] = plugin
}

// Context
PMC.DefaultEntry = "scripts/index.js"
PMC.Context = class extends PMC.InsertClass  {
  constructor( addon ){
    super()
    this.dir = addon.dir
    this.namespace = addon.ns
    this.addon = addon
    this.entry = addon.entry
    this.scripePath = addon.scriptPackAt
    this.modules = addon.smodules
    this.plugins = {}
    this.isMcRuntime = PMC.isMinecraftRunTime
    this.append = ""
    this.loadActivePlugin( PMC.Item )
    this.loadActivePlugin( PMC.Event )
    this.loadActivePlugin( PMC.Recipe )
    this.loadActivePlugin( PMC.Function )
    this.loadActivePlugin( PMC.Vanilla )
    this.loadActivePlugin( PMC.Block )
    this.loadActivePlugin( PMC.Loot )
  }
  onMinecraft( callback ){
    if( PMC.isMinecraftRunTime ) callback( PMC.Minecraft )
  }
  onGenerate(){
  
  }
  generate(){
    for( let key of Object.keys( this.plugins ) ){
      this.plugins[key].onGenerate()
      if( PMC.isMinecraftRunTime ){
        this.plugins[key].onGenerateWithMinecraft( PMC.Minecrat )
      } else this.plugins[key].onGenerateWithNode()
    }
    if( this.entry && !PMC.isMinecraftRunTime ){
      var {execSync} = require( "child_process" ), outputPath, append = ""
      execSync( "browserify '" + process.argv[1] + "' -o '" + (outputPath = path.join( path.join(this.dir, this.scripePath ), this.entry)) + "'" )
      for( let module of this.modules ){
        let name = path.basename( module )
        append += "import * as $" + name.replaceAll( "-", "_" ) + " from '" + module + "'\n"
      }
      append += "var __dirname = ''\nvar __filename = 'index.js';\n"
      if( typeof PMC._rvfs == "object" && !PMC.isMinecraftRunTime ){
        append += "var $_vfs = " + JSON.stringify( PMC._rvfs, 0, 2 ) + ";\n"
      }
      append += this.append + ";\n"
      fs.writeFileSync( outputPath,
        append + fs.readFileSync( outputPath ).toString())
    }
    this.onGenerate()
  }
  loadActivePlugin( Plugin ){
    var plugin = new Plugin( this )
    this.plugins[plugin.define] = plugin
    if( PMC.isMinecraftRunTime ) plugin.onMinecraft( PMC.Minecraft )
  }
}

PMC.Addon = class extends PMC.InsertClass {
  constructor( manifest, dir, json = true ){
    super()
    this.dir = dir
    this.manifest = manifest
    this.ns = "mod"
    this.entry = false
    this.scriptPackAt = "data/"
    this.smodules = [ "@minecraft/server" ]
    // if( json ) throw "暂不支持生成Manifest"
  }
  followLoveKogasaAtBiliOrX(){
    // 彩蛋函数
    console.log( "Thank You!" )
  }
  loadResources( dir, vdir = "." ){
    if( !PMC.isMinecraftRunTime ){
      if( typeof PMC._rvfs != "object" ) PMC._rvfs = {}
      var files = fs.readdirSync( dir, {recursive : true} )
      for( let fn of files ){
        if( fs.statSync( path.join( dir, fn ) ).isFile() ){
          PMC._rvfs[path.join( vdir, fn )] = fs.readFileSync( path.join( dir, fn ) ).toString()
        } else {
          PMC._rvfs[path.join( vdir, fn )] = true
        }
      }
    }
  }
  getAddonCtx(){
    return (this.ctx = new PMC.Context( this ))
  }
  setEntry( entry = PMC.DefaultEntry ){
    this.entry = entry
    return entry
  }
  setEntryPack( dir ){
    this.scriptPackAt = dir
    return this
  }
  requireModule( name ){
    this.smodules.push( name )
    return this
  }
  onGenerate(){
  
  }
  generate(){
    if( this.ctx ){
      this.ctx.generate()
      if( !PMC.isMinecraftRunTime ){
        fs.writeFileSync(path.join(this.dir, "pmc2.mcpkg"), JSON.stringify({
          namespace: this.ns,
          activeEntry: this.entry,
          scriptApiDirectory: this.scriptPackAt,
          minecraftModules: this.smodules
        }, 0, 2 ))
      }
    }
    this.onGenerate()
  }
  setNamespace( ns ){
    this.ns = ns
    return this
  }
  static fromJSON( dir ){
    return new PMC.Addon({}, dir, false)
  }
}

module.exports = PMC