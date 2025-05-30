var {ActivePlugin} = require( "../../Plugin" )

class VanillaReAchieveByLoveKogasa extends ActivePlugin {
  constructor( context ){
    super( "Vanilla", context )
    this.ctx = context
    context.Vanilla = {
      IronSword( extendMeta = false ){
        var json = require( "./IronSword.json" )
        var item = context.Item( "Iron Sword", json, false )
        item.bindRecipe( context.Recipe( item,
          require( "./IronSwordRecipe.json" )
        ))
        if( extendMeta ) item.setIcon( "iron_sword" )
        return item
      },
      GoldSword( extendMeta = false ){
        var json = require( "./GoldSword.json" )
        var item = context.Item( "Gold Sword", json, false )
        item.bindRecipe( context.Recipe( item,
          require( "./GoldSwordRecipe.json" )
        ))
        if( extendMeta ) item.setIcon( "iron_sword" )
        return item
      },
      DiamondSword( extendMeta = false ){
        var json = require( "./DiamondSword.json" )
        var item = context.Item( "Diamond Sword", json, false )
        item.bindRecipe( context.Recipe( item,
          require( "./DiamondSwordRecipe.json" )
        ))
        if( extendMeta ) item.setIcon( "iron_sword" )
        return item
      }
    }
  }
}

module.exports = VanillaReAchieveByLoveKogasa