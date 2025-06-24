var fs = require( "fs" )
var path = require( "path" )
// For browserify
if( !fs.readFileSync ) fs = require( "./ActiveCore/VirtualFileSystem" )

// Plugin class
class ActivePlugin {
  constructor( define, mcctx ){
    this.define = define
    this.ctx = mcctx
  }
  // fileSystem
  read( name, error = console.error ){
    try {
      return fs.readFileSync( path.join( this.ctx.dir, name ) )
    } catch( err ){
      error( err )
    }
  }
  write( name, data, error = console.error ){
    try {
      // 偷懒(
      if( this.file( name.split( "/" ).slice( 0, -1 ).join( "/" ) ) || fs.virtual ){
        return fs.writeFileSync( path.join( this.ctx.dir, name ), data )
      } else {
        mkdirsSync( path.join( this.ctx.dir, name.split( "/" ).slice( 0, -1 ).join( "/" )) )
        this.write( name, data, error )
      }
    } catch( err ){
      error( err )
    }
  }
  file( p ){ return fs.existsSync( path.join(this.ctx.dir, p) ) }
  json( p, callback ){
    if( !this.file(p) ) this.write( p, "{}" )
    var data = JSON.parse(this.read(p) || "{}")
    callback( data )
    this.write( p, JSON.stringify( data, 0, 2 ) )
    return data
  }
  // Utils
  subId( id ){
    return id.split(":")[1]
  }
  // Events
  onGenerate(){
  
  }
  onGenerateWithNode(){
    
  }
  onGenerateWithMinecraft( mc ){
    
  }
  onMinecraft( mc ){
  
  }
}

// For old core
class RePackMcPlugin extends ActivePlugin {
  constructor( define, ctx, func ){
    super( define, ctx )
    this.func = func
    this.files = []
  }
  callMethod( createFile = true, ...args ){
    var otp = this.func( ...args )
    if( createFile )this.files.push( otp )
    return otp
  }
  onGenerate(){
    for( let ovapi of this.files ){
      let files = ovapi.json()
      for( let file of files ){
        this.write( file.path, file.isjson === false ? file.json : JSON.stringify( file.json, 0, 2 ) )
      }
    }
  }
}

// For sapdon core
class SapdonPlugin extends ActivePlugin {
  constructor( define, ctx, object/** see @sapdon/core/class */, className ){
    super( define, ctx )
    this.fileTasks = []
    if( typeof object == "string" ){
      import( object ).then(( object ) => {
        this.object = object[className]
        this.onInit( object )
      })
    } else {
      this.object = object[className]
      this.onInit( object )
    }
  }
  callMethod( ...args ){
    var ret = new this.object(...args)
    this.fileTasks.push( ret )
    return ret
  }
  onGenerate(){
    // Sapdon Api 具有活态性(
  }
  onInit( object ){
    
  }
}

// Other method (偷懒)
function mkdirsSync(dirname) {
  if( fs.virtual ) return true
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

module.exports = {ActivePlugin, RePackMcPlugin, SapdonPlugin}