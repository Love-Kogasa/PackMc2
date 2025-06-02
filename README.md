# PackMc2 - beta
PackMc2-Beta OpenSource v1.0.9  
如果你是用1.0.7以后的版本。您会发现生成的文件夹中存在一个pmc2.mcpkg文件，这是用来存储包的部分元信息的文件，如果您在您的包中保留这个文件，则您可以通过 https://pmc-fsm.lapis-net.top/ 修改虚拟文件系统的预加载内容

## 介绍
PackMc2 是一个以方便快捷为标准的全新的JavaScript MinecraftAddon生成框架！  
PackMc2正式版将会在不久之后开源！  
有多快捷？请看实例(创建一个名为Na Ingot的物品)
```js
// ... 引用模块和调用Ctx
ctx.Item( "Na Ingot" )
// ...
```
创建一把武器
```js
// ... 引用模块和调用Ctx
ctx.Item( "IroNa Sword" )
  .extend( mod.Vanilla.IronSword( false ) )
sword.recipe
  .replace( "minecraft:iron_ingot", item )
// ...
```

## 编写插件
PackMc2 使用简单的方式编写插件  
以下是一个简单的插件框架
```js
var {ActivePlugin} = require( "pack-mc-2/src/Plugin" )
class CustomPlugin extends ActivePlugin {
  constructor( context ){
    super( "PluginId", context )
  }
  // 在包被构建时运行
  onGenerate(){
    
  }
  // 当插件在Minecraft中加载时运行
  onMinecraft( mc ){
    
  }
}

// 加载插件
// ...
ctx.loadActivePlugin( CustomPlugin )
// 访问插件示例(当然您也可以直接在context上增加内容)
console.log( ctx.plugins.PluginId.define )
// ...
```
当然，您也可以使用RePackMc的API编写插件(但不提倡)  
PackMc2的Item就是继承自旧API加以改造

## 编写代码
(候补)

## 内置插件
(候补)