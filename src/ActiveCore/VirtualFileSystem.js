var path = require( "path" )
module.exports = {
  _vDir: typeof $_vfs == "object" ? $_vfs : {},
  virtual: true,
  existsSync( path ){
    return !!this._vDir[path]
  },
  readFileSync( path ){
    if( this._vDir[path] ) return this._vDir[path]
    throw "No such file or directory"
  },
  writeFileSync( path, data ){
    return this._vDir[path] = data
  },
  mkdirSync( path ){
    return this._vDir[path] = true
  },
  appendFileSync( path ){
    return this._vDir[path] += data
  },
  readdirSync( path ){
    var output = []
    for( let filePath in this._vDir ){
      if( path.dirname(filePath) == path ) output.push( filePath )
    }
    return output
  },
  rmSync( path, options ){
    var data = this._vDir[path]
    if( options.recursive ){
      for( let p in this._vDir ){
        if( p.includes( path ) ) delete this._vDir[p]
      }
    }
    delete this._vDir[path]
    return data
  },
  bindFileSystem( fsObject ){
    Object.assign( this._vDir, fsObject )
    return this
  }
}