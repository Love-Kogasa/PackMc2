var PMC = require( "./index" )
var CustomCmd = require( "./modules/CustomCmd" )

var mcmod = PMC.Addon.fromJSON( "./example" )
mcmod.setNamespace( "example" )
mcmod.setEntry( PMC.DefaultEntry )
mcmod.setEntryPack( "scripts/" )
// mcmod.followLoveKogasaAtBiliOrX()
// u must allow this. Aaaaa

var mod = mcmod.getAddonCtx()
var item = mod.Item( "Na Ingot" )
var sword = mod.Item( "IroNa Sword" )
  .extend( mod.Vanilla.IronSword( false ) )
// false 指不复刻元信息(贴图等)
sword.recipe
  .replace( "minecraft:iron_ingot", item )
var block = mod.Block( "Na Block" )
var loot = mod.LootTable( "minecraft:diamond" )
loot.push( sword ).enchant( "sharpness@5" )

// 加载第三方插件
mod.loadActivePlugin( CustomCmd )
mod.plugins.CustomCommand.createCmd( "hi", ( plr, args, mc ) => {
  // btw, u'd better create this in onMinecraft's callback
  mc.print( "hi " + plr.name + ". Give u a little gift !" )
  plr.runCommand( loot.toCmd() )
})

// Active
mcmod.loadResources( "example/TVRes" )
mod.onMinecraft(( mc ) => {
  // ! only-read with JSONAPI
  // mc.fs.writeFileSync( "hello.txt", "Hello World" )
  // 该fs是为PackMc非nodejs环境运行专写的一份vfs，如果有使用需求，需要在package.json中添加
  // 无论添不添加，都可以在mc对象中访问vfs
  mc.world.afterEvents.chatSend.subscribe(arg => {
    if( arg.message == "#test" ) {
      mc.print( "LootCommand : " + loot.toCmd() )
    } else if( arg.message == "#file" ){
      mc.print( mc.fs.readFileSync( "hello.txt" ) )
    }
  })
})

mcmod.generate()

