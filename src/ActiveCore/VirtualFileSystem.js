var p = require( "path" )
module.exports = {
  _vDir: typeof $_vfs == "object" ? $_vfs : {},
  virtual: true,
  existsSync( path ){
    return !!this._vDir[p.join(".", path)]
  },
  readFileSync( path ){
    if( this._vDir[p.join(".", path)] ) return this._vDir[path]
    throw "No such file or directory"
  },
  writeFileSync( path, data ){
    return this._vDir[p.join(".", path)] = data
  },
  mkdirSync( path ){
    return this._vDir[p.join(".", path)] = true
  },
  appendFileSync( path ){
    return this._vDir[p.join(".", path)] += data
  },
  readdirSync( path ){
    var output = []
    for( let filePath in this._vDir ){
      if( p.dirname(filePath) == path ) output.push( filePath )
    }
    return output
  },
  rmSync( path, options ){
    var data = this._vDir[p.join(".", path)]
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