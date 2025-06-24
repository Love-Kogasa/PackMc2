// Util.js
class MinecraftObject {
  constructor( label, id, version = "1.16.100", namespace = "minecraft:" ){
    this.id = id
    this.label = label
    this.format = version
    this.component = void 0
    this.event = void 0
    this.conditions = void 0
    this.body = {}
    this.namespace = namespace
    this.description = {}
  }
  json(){
    var json = {
      "format_version": this.format,
      [this.namespace + this.label]: {
        description: { ...this.description, identifier: this.id },
        ...this.body
      }
    }
    if( typeof this.component == "object" ){
      json["minecraft:" + this.label].components = this.component
    }
    if( typeof this.event == "object" ){
      json["minecraft:" + this.label].events = this.event
    }
    if( typeof this.conditions == "object" ){
      json["minecraft:" + this.label].conditions = this.conditions
    }
    this.onGenerateJSON( json )
    return json
  }
  initComponent(obj = {}){
    this.component = obj
    return this
  }
  initEvent(obj = {}){
    this.event = obj
    return this
  }
  initCondition( array ){
    this.conditions = array
    return this
  }
  set(key, value, namespace = "minecraft:"){
    this.component[namespace + key] = value
    return this
  }
  setEvent( key, value ){
    this.event[key] = value
    return this
  }
  condition( rule ){
    this.conditions.push( rule )
    return this
  }
  subId(){
    return this.id.split( ":" )[1]
  }
  setDescription( key, value ){
    this.description[key] = value
    return this
  }
  getId(){
    return this.id
  }
  toString(){
    return this.getId()
  }
  extend( object ){
    Object.assign( this.description, object.description )
    if( object.component == this.component && this.component !== void 0 )
      Object.assign( this.component, object.component )
    if( object.event == this.event && this.event !== void 0 )
      Object.assign( this.event, object.event )
    if( object.conditions == this.conditions && this.conditions !== void 0 )
      Object.assign( this.conditions, object.conditions )
    Object.assign( this.body, object.body )
    return this
  }
  // Events
  onGenerateJSON( json ){
    
  }
}

Object.prototype.each = function( callback ){
  var loop = true
  for( let key of Object.keys( this ) ){
    if( loop ){
      callback( this[key], key, () => (loop = false), this )
    } else return;
  }
}

Object.prototype.jsonify = function( tab = 2 ){
  return JSON.stringify( this, 0, 2 )
}

String.prototype.jsonify = function(){
  return JSON.parse( this )
}

module.exports = {MinecraftObject}