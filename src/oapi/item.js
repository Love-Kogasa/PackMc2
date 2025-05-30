module.exports = function( id, icon, name, type = "items", components = {}, events = {}, format = "1.16.100" ){
  // 旧版Api === 屎
  var data = components
  data[ "minecraft:display_name" ] = {value: name}
  data[ "minecraft:icon" ] = {texture: icon}
  var eves = events
  function getJson(){
    return {
      "format_version": format,
      "minecraft:item": {
        description: {
          identifier: id,
          category: type
        },
        components: data,
        events: eves
      }
    }
  }
  function item(){
    return [{path: "data/items/" + id.split( ":" )[1] + ".json",
    json: getJson()}]
  }
  function get( key ){
    return data[ "minecraft:" + key ]
  }
  function getId(){
    return id
  }
  function getEvent( key ){
    return eves[key]
  }
  function getIcon(){
    return data[ "minecraft:icon" ].texture
  }
  function getName(){
    return data[ "minecraft:display_name" ].value
  }
  function setComponents( key, value ){
    data[ key ] = value
  }
  function set( key, value ){
    data[ "minecraft:" + key ] = value
  }
  function setName( value ){
    data[ "minecraft:display_name" ].value = value
  }
  function reId( id ){
    id = id
  }
  function setEvent( key, value ){
    eves[ key ] = value
  }
  /*function setRecipe( table, keys, count = 1, tag = "crafting_table" ){
    others.push( {
      path : "data/recipes/" + id.split( ":" )[1] + "_recipe.json",
      json : {
        "format_version": "1.12.2",
        "minecraft:recipe_shaped": {
          description: {
            identifier: id + "_recipe"
          },
          tags: Array.isArray( tag ) ? tag : [tag],
          pattern: table,
          key: keys,
          result: {
            item: id,
            count: count
          }
        }
      }
    })
  }*/
  return {json:item, setComponents, set, setEvent, get, getId, getEvent, toString: getId, setName, reId, getJson, bindRecipe( recipe ){ this.recipe = recipe }, extend( item ){
    var nitemc = {}
    for( let components of Object.keys((nitemc = item.getJson()["minecraft:item"].components)) ){
      if( !data[components] ) setComponents( components, nitemc[components] )
    }
    if( item.recipe ){
      item.recipe.output = getId()
      this.recipe = item.recipe
    }
    return this
  }}
}