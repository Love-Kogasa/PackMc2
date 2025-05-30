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
  }
  json(){
    var json = {
      "format_version": this.format,
      [this.namespace + this.label]: {
        description: { identifier: this.id },
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