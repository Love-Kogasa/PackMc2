var {ActivePlugin} = require( "../Plugin" )

// Events
const Event = ( e ) => ({ event: e }),
  Use = ( e ) => ({ on_use: Event(e) }),
  UseOn = ( e ) => ({ on_use_on: Event(e) }),
  Attack = ( e ) => ({ on_hurt_entity: Event(e) }),
  Destroy = ( e ) => ({ on_hit_block: Event(e) })

// Components
const Weapon = function( attack, destroy, nothurt){
  return {...Attack( attack ), ...Destroy( destroy ), on_not_hurt_entity: Event( nothurt ) }
}, Enchant = ( slot = "sword", value = 10 ) => ({ value, slot }),
  RepairItem = ( items, count = 10 ) => {
    if( Array.isArray( items )){
      items.forEach(( value, index ) => items[index] = value.getId())
    } else items = [items]
    return { items: items, repair_amount: count }
  }, Repair = ( items, handle ) => {
    if( typeof handle == "string" )
      handle = Event( handle )
    var out = { repair_items: [].concat(items) }
    if( handle ) out.on_repaired = handle
    return out
  }, Effect = ( effect, level = 1, count = 0, chance = 1 ) => {
    return { name: effect, chance, duration: count, amplifier: level - 1}
  }, Food = ( count = 2, modifier = "normal", always = true, effects ) => {
    var out = { nutrition: count, saturation_modifier: modifier, can_always_eat: always }
    if( effects ){
      if( typeof effects === "string" )
        effects = Effect( ...effects.split( "@" ) )
      out.effects = effects
    }
    return out
  }

class ItemComponent extends ActivePlugin {
  constructor( ctx ){
    super( "ItemComponent", ctx )
    ctx.Description = this.descriptionItem
    ctx.ItemComponent = ctx.ItemC = {
      Event, Use, UseOn, Attack, Destroy,
      Weapon, Enchant, RepairItem, Repair,
      Effect, Food
    }
  }
  descriptionItem( name, description ){
    return `${name}\n§7${description}`
  }
}

module.exports = ItemComponent