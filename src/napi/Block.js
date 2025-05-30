var {ActivePlugin} = require( "../Plugin" )
var {MinecraftObject: McObj} = require( "../Util" )

class Block {
  constructor( id, name, texture = 1, i18n ){
    this.object = new McObj( "block", id )
    this.category = "nature"
    this.group = void 0
    this.id = id, this.name = name
    this.texture = texture
    this.sound = "stone"
    this.i18n = i18n
    this.name = name
    i18n.t( "tile." + this.object.subId() + ".name", name )
    this.object.onGenerateJSON = ( json ) => {
      json[ "minecraft:block" ].description.menu_category = {
        category: this.category
      }
      if( this.group ) json[ "minecraft:block" ].description.menu_category.group = this.group
    }
    this.object.initComponent({
      "minecraft:display_name": this.object.subId(),
      "minecraft:destroy_time": 0.5,
      "minecraft:map_color": "#000000",
      "minecraft:material_instances": {
        "*": { "texture": id }
      }
    })
  }
  extend( block, texture = false ){
    block.object.component.each((value, key) => {
      this.object.component[key] = value
    })
    this.rename( block.name )
    if( texture ) this.texture = block.texture
    this.sound = block.sound
    return this
  }
  setCategory( type ){
    this.category = type
    return this
  }
  setGroup( type ){
    this.group = type
    return this
  }
  set( k, v ){
    this.object.set( k, v )
    return this
  }
  get( k ){
    return this.object.component[k]
  }
  getId(){
    return this.id
  }
  toString(){
    return this.getId()
  }
  setSound( s ){
    this.sound = s
  }
  rename( name ){
    this.name = name
    i18n.t( "tile." + this.object.subId() + ".name", name )
  }
  event( k, v ){
    if( !this.object.event ) this.object.initEvent()
    if( v ){
      this.object.setEvent( k, v )
      return this
    } else return this.object.event[k]
  }
  jsonify(){
    return this.object.json()
  }
}

class BlockPlugin extends ActivePlugin {
  constructor( ctx ){
    super( "Block", ctx )
    if( !ctx.plugins.i18n ) ctx.loadActivePlugin( require( "./i18n" ) )
    this.blocks = []
    this.i18n = ctx.plugins.i18n.new( "en_US" )
    ctx.Block = ( name, config ) => this.createBlock( name, config )
    ctx.BlockTexture = {
      All: 1, Side: 2, TopBottomAndSide: 3,
      Face: 6
    }
  }
  createBlock( name, config = {}, f = true ){
    var block = new Block( this.ctx.namespace + ":block" + this.blocks.length, name, 1, this.i18n )
    var spacialTag = ["texture"]
    if( f ) this.blocks.push( block )
    config.each(function( value, key, stop ){
      if(!spacialTag.includes(key)){
        block.set( key, value )
      } else if( key = "texture" ){
        block.texture = value
      }
    })
    return block
  }
  onGenerate(){
    this.blocks.forEach(( v, k, a ) => {
      this.write( "data/blocks/" + v.object.subId() + ".json", v.jsonify().jsonify() )
      var textureList = []
      this.json( "resources/blocks.json", ( data ) => {
        var textures = {}
        if( v.texture == 1 ){
          textures = v.object.subId()
          textureList.push( textures )
        } else if( v.texture == 2 ){
          textures = {
            up: v.object.subId() + "_top",
            done: v.object.subId() + "_top",
            side: v.object.subId() + "_side"
          }
          textureList.push( v.object.subId() + "_top" )
          textureList.push( v.object.subId() + "_side" )
        } else if( v.texture == 3 ){
          textures = {
            up: v.object.subId() + "_top",
            done: v.object.subId() + "_bottom",
            side: v.object.subId() + "_side"
          }
          textureList.push( v.object.subId() + "_top" )
          textureList.push( v.object.subId() + "_side" )
          textureList.push( v.object.subId() + "_bottom" )
        } else {
          textures = {
            up: v.object.subId() + "_top",
            done: v.object.subId() + "_bottom",
            south: v.object.subId() + "_south",
            north: v.object.subId() + "_north",
            west: v.object.subId() + "_west",
            east: v.object.subId() + "_east"
          }
          textureList.push( v.object.subId() + "_top" )
          textureList.push( v.object.subId() + "_south" )
          textureList.push( v.object.subId() + "_north" )
          textureList.push( v.object.subId() + "_west" )
          textureList.push( v.object.subId() + "_east" )
          textureList.push( v.object.subId() + "_bottom" )
        }
        data[ v.id ] = {textures, sound : v.sound}
      })
      this.json( "resources/textures/terrain_texture.json", (data) => {
        if( !data.texture_data ) data.texture_data = {}
        textureList.forEach( (id) => {
          data.texture_data[id] = {textures: "textures/blocks/" + id}
          console.log( "Tip: 方块" + v.name + "的贴图在 textures/blocks/" + id )
        })
      })
    })
  }
}

// console.log( new Block( "example:block", "block" ).jsonify())
module.exports = BlockPlugin