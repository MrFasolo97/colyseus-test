local ColyseusClient = require "colyseus.client"

-- SERVER VARS
local server_address = "localhost"
local server_port = "3553"

--VARS
local numPlayers = 0

colyseus = {}
room = nil

function colyseus:connectToLobby(username, password)
	if self.client == nil then
		client = ColyseusClient.new("ws://"..server_address..":"..server_port);
		self.client = client
	end
	self.client:join_or_create("lobby", {username = username, password = password}, function(err, _room)
		if (err ~= nil) then
			print("join error: ")
			print(err)
			error("Unable to join!")
			return nil
		else
			msg.post("boot:/loader#script", "load_menu")
			print("joined successfully")
			room = _room
		end
	end)
end
