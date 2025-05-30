var {ActivePlugin} = require( "../Plugin" )

class LootItem {
  constructor( items, count = 1, weight = 1, enchant = [] ){
    this.weight = weight
    this.item = ""
    this.functions = []
    this.data = 0
    this.count = this._countify( count )
    this.enchants = [].concat(this._enchantify( enchant ))
    this.weight = 1
    this.conditions = []
    if( items ){
      this.item = this._itemify( items.toString() )
    }
  }
  _enchantify( enchant ){
    var output = []
    if( Array.isArray( enchant ) ){
      enchant.forEach((v) => {
        if( typeof v == "string" ){
          var [name, level] = v.split( "@" )
          output.push({
            id: name, level: parseInt(level) || 1
          })
        } else if( typeof v == "object" ){
          output.push(v)
        }
      })
    } else {
      var [name, level] = enchant.split( "@" )
      output.push({
        id: name, level: parseInt(level) || 1
      })
    }
    return output
  }
  enchant( enchant ){
    this.enchants = this.enchants.concat(this._enchantify( enchant ))
    return this
  }
  _itemify( items ){
    if( items.includes( "@" )){
      var [item, data] = items.split( "@" )
      this.data = parseInt(data)
      return item
    } else {
      return items
    }
  }
  _countify( count ){
    if( typeof count == "number" ){
      // 似乎只能这样写
      return {min: count, max: count}
    } else if( typeof count == "string" ){
      var [min, max] = count.split( "-" )
      return {min, max}
    } else if( typeof count == "object" ){
      return count
    } else {
      return {min: 1, max: 1}
    }
  }
  jsonify(){
    var basicJSON = {
      type: "item",
      name: this.item,
      weight: this.weight
    }
    if( this.functions[0] || this.count.max != 1 || this.data > 0 || this.enchants[0] ){
      basicJSON.functions = this.functions
    }
    if( this.count.max != 1 ){
      basicJSON.functions.push({
        "function": "set_count",
        count: this.count
      })
    }
    if( this.data > 0 ){
      basicJSON.functions.push({
        "function": "set_data",
        data: this.data
      })
    }
    if( this.conditions[0] ){
      basicJSON.conditions = this.conditions
    }
    if( this.enchants[0] ){
      basicJSON.functions.push({
        "function": "specific_enchants",
        enchants: this.enchants
      })
    }
    return basicJSON
  }
}

class LootTable {
  constructor( item, count = 1, plugin ){
    this.name = plugin.ctx.namespace += "_loot" + plugin.loots.length
    this.plugin = plugin
    this.entries = []
    this.table = {
      pools: [{
        rolls: count,
        entries: []
      }]
    }
    if( item ){
      this.push( item )
    }
  }
  extend( path, weight = 1 ){
    this.table.pools[0].entries.push({
      type: "loot_table",
      name: path.toString(),
      weight
    })
    return this
  }
  push(...itemLoot){
    var item = new LootItem(...itemLoot)
    this.entries.push( item )
    return item
  }
  empty(){
    this.table.pools[0].entries.push({
      type: "empty"
    })
    return this
  }
  toString(){
    return "loot_tables/" + this.name
  }
  toCmd(){
    return "loot spawn ~~~ loot " + this.name
  }
  generate(){
    var json = {...this.table}
    for( let entry of this.entries ){
      json.pools[0].entries.push( entry.jsonify() )
    }
    this.plugin.write( "data/" + this.toString() + ".json", JSON.stringify( json, 0, 2 ) )
  }
}

class LootPlugin extends ActivePlugin {
  constructor( ctx ){
    super( "Loot", ctx )
    this.loots = []
    ctx.LootTable = ( item, count ) => {
      var loot = new LootTable( item, count, this )
      this.loots.push( loot )
      return loot
    }
  }
  onGenerate(){
    this.loots.forEach((v) => v.generate())
  }
}

module.exports = LootPlugin