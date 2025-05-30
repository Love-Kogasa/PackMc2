var Minecraft = {
  server: typeof $server == "object"
    ? $server : { world: {
      sendMessage( message ){ return void 0 }
    }},
  serverUi: typeof $server_ui == "object"
    ? $server_ui : {},
  isMinecraftRunTime: typeof $server == "object",
  fs: require( "./VirtualFileSystem" )
}
Minecraft.print = (...string) => Minecraft.server.world.sendMessage(...string)
Minecraft.world = Minecraft.server.world
module.exports = Minecraft
