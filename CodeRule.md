# PackMc2 代码规范
如果您想为PackMc2编写插件，希望您可以遵循以下代码规范编写插件  
代码规范版本: *PackMc2-Beta OpenSource v1.0.91*

### 命名规范
当您为Context对象增加方法时，您应该将变量名首字母大写，无论是不是类(Class)或者类的实例.  
在PackMc2内置插件中，很多方法都是用此种命名方式，如 `ctx.Item` `ctx.Block` 等

当您在您的插件类中添加事件时，您的命名应该为 `onXxx` 如 `onLoaded`  
当您为ctx或者ctx.addon添加事件时，建议使用 `onEvent( callback )` 的方式允许用户添加事件回调  
如PackMc中ctx.onMinecraft
```js
ctx.onMinecraft(( minecraft ) => {
  minecraft.print( "Hello World" )
  // ...
})
```

当您需要引用json数据文件的时候，请不要使用fs.readFileSync，这会导致在mc中报错(因为mc中用的是虚拟fs)，您应该使用require来引用json  
如有特殊需求，请使用 `ctx.isMcRuntime` 或 `PMC.isMinecraftRuntime` 判断(如果是插件，请使用前者)  
您不应该使用loadResources方法加载二进制文件

仅允许在非公共项目中使用SapdonPlugin

当您使用Util中的*MinecraftObject*类时，请您将对象中存放*MinecraftObject*对象的变量名命名为object，目前使用并遵守该规范的类
* `Block`

建议在Plugin自定义对象中增加getCmd，getId，toString，extend方法，分别返回相应的 指令，id，id, 自定义继承