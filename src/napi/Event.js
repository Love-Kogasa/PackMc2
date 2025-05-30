var {ActivePlugin} = require( "../Plugin" )

class Event extends ActivePlugin {
  constructor( ctx ){
    super( "Event", ctx )
    ctx.EventType = this.Type = {
      List: "sequence", Rand: "randomize"
    }
    ctx.Event = (cmds) => this.createEvent(
      this.Type.List,
      { run_command: {command: ([]).concat(cmds)} }
    )
  }
  createEvent( type, task ){
    var eObject = {}
    return (eObject[type] = task)
  }
}

class TickEvent extends ActivePlugin {
  constructor( ctx ){
    super( "Tick", ctx )
    this.Tick = []
    ctx.TickFunc = ( func ) => func ? this.Tick = func : this.Tick
    ctx.AppendTickFunc = ( func ) => this.Tick.concat( func )
  }
  onGenerate(){
    this.write( "data/functions/tick.json", JSON.stringify(
      {values: ctx.namespace + "_tick" }, 0, 2
    ))
    this.write( "data/functions/" + ctx.namespace + "_tick.mcfunction",
      this.Tick.join( "\n" )
    )
  }
}


module.exports = {Event, TickEvent}