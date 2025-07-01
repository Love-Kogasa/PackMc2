var {ActivePlugin} = require( "../Plugin" )

class CraftingTable {
  constructor( id, output, recipe, count = 1, where = "crafting_table" ){
    this.id = id
    this.where = where
    this.recipe = recipe
    this.output = output
    this.count = count
  }
  has( item ){
    for( let key of Object.keys( this.recipe.key ) ){
      if( this.recipe.key[key] == item ) return true
    }
    return false
  }
  includes( item ){
    return has( item )
  }
  replace( item, item2 ){
    for( let key of Object.keys( this.recipe.key ) ){
      if( item == key ) (this.recipe.key[key] = item2.toString())
      if( this.recipe.key[key] == item ) (this.recipe.key[key] = item2.toString())
    }
    return this
  }
  source(){
    return {
      format_version: "1.12.2", "minecraft:recipe_shaped": {
        description: {
          identifier: this.id
        }, tags: [].concat(this.where),
        pattern: this.recipe.table,
        key: this.recipe.key,
        result: (() => {
          if( Array.isArray( this.output ) ){
            var output = [...this.output]
            output.forEach(( value, key ) => {
              if( typeof output[key] == "string" ){
                output[key] = { item: value, count: this.count }
              } else {
                output[key].count && (output[key].count = count)
              }
            })
            return output
          } else return { item: this.output, count: this.count }
        })()
      }
    }
  }
}

class Recipe extends ActivePlugin {
  constructor( ctx ){
    super( "Recipe", ctx )
    this.ctx = ctx
    this.recipes = []
    ctx.Recipe = (...args) => this.craftingTable(...args)
  }
  onGenerate(){
    for( let recipe of this.recipes ){
      this.write( "data/recipes/" + this.subId(recipe.id) + ".json", JSON.stringify(recipe.source(),0,2) )
    }
  }
  craftingTable( item, table, count = 1, tag = "crafting_table" ){
    var recipe = {table: [ ["","",""], ["","",""], ["","",""] ], key: {}}, newTable = []
    if( Array.isArray( table ) ){
      var recipeSymbol = 10
      for( let itemIndex in table ){
        let mkey, item = table[itemIndex]
        if( item == null ){
          recipe.table[parseInt(itemIndex/3)][itemIndex%3] = " "
        } else if( (mkey = hasItem( recipe.key, item ))){
          recipe.table[parseInt(itemIndex/3)][itemIndex%3] = mkey
        } else {
          recipe.key[(mkey = recipeSymbol.toString(36))] = item.id ? item.id :
            item.getId ? item.getId() : item.toString()
          recipe.table[parseInt(itemIndex/3)][itemIndex%3] = mkey
          recipeSymbol += 1
        }
      }
      recipe.table.forEach((keys) => {
        if( keys.join( "" ) == "" ) return;
        newTable.push( keys.join( "" ) )
      })
      recipe.table = newTable
    } else {
      recipe = table
    }
    var table = new CraftingTable( this.ctx.namespace + ":recipe" + this.recipes.length,(() => {
      if( Array.isArray( item )){
        var otp = []
        for( let itemobj of item ){
          let tryId = getId( itemobj )
          if( typeof tryId == "object" ){
            otp.push( tryId )
          } else otp.push( tryId )
        }
        return otp
      } else return getId( item )
      function getId( item ){
        return item.id ? item.id : item.getId ? item.getId() : item
      }
    })(), recipe, count, tag)
    this.recipes.push( table )
    return table
    function hasItem( key, item ){
      for( let k of Object.keys(key) ){
        if( key[k] === item.id ? item.id :
          item.getId ? item.getId() : item.toString()
        ){
          return [k]
        }
      }
      return false
    }
  }
}

module.exports = Recipe