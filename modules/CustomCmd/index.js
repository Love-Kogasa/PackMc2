var {ActivePlugin} = require( "../../src/Plugin" )
class CustomCommand extends ActivePlugin {
  constructor( ctx ){
    super( "CustomCommand", ctx )
    this.cmdlist = {}
    this.sign = "!"
  }
  createCmd( name, handle ){
    this.cmdlist[name] = handle
    return this
  }
  onMinecraft( mc ){
    mc.world.afterEvents.chatSend.subscribe( event => {
      if( event.message[0] ==  this.sign ){
        var cmd = event.message.slice(1).split( " " )
        if( Object.keys( this.cmdlist ).includes( cmd[0] ) ){
          this.cmdlist[ cmd[0] ]( event.sender, cmd, mc )
        }
      }
    })
  }
}
module.exports = CustomCommand