
// 获取模板类
var {ActivePlugin} = require( "../Plugin" )

// 继承插件对象，旧Api则继承RePackMcPlugin
class Function extends ActivePlugin {

  // 初始化模块
  constructor( ctx ){
    // Function 是模块的名称(可用ctx.plugins.*访问)
    super( "Function", ctx )
    // 可用 this.ctx 访问 ctx
    this.functions = []
    ctx.Function = ( funcArray ) => this.createFunction( funcArray )
  }
  
  // 当包开始构建
  onGenerate(){
    for( let func of this.functions ){
      // 快速写入文件，用read读取文件，file判断文件是否存在
      this.write( "data/functions/" + func.id + ".mcfunction", func.functions.join( "\n" ) )
    }
  }
  
  // 你自己的方法
  createFunction( funcArray ){
    var func = new McFunction( this.ctx.namespace + this.functions.length, funcArray )
    this.functions.push( func )
    return func
  }
  
}

// 给上文用
class McFunction {

  constructor( id, array ){
    this.id = id
    this.functions = array
  }
  
  push( cmd ){
    this.functions.push( cmd )
    return this
  }
  
  reverse(){
    this.functions.reverse()
    return this
  }
  
  slice( f, t ){
    return this.functions.slice( f, t )
  }
  
  toString(){
    return "function " + this.id
  }
  
  toCmd(){
    return this.toString()
  }
  
}

// 导出(Nodejs模式)
module.exports = Function
// 用ctx.loadActivePlugin加载插件