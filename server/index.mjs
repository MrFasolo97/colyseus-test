import { listen } from "@colyseus/arena";
// const socialRoutes = require("@colyseus/social/express").default;
import { logger } from './common.mjs';

// Import arena config
import arenaConfig from "./arena.config.mjs";

logger.debug('Debug active');
// Create and listen on 2567 (or PORT environment variable.)
listen(arenaConfig);

// gameServer.define('lobby', authroom);

// register @colyseus/social routes
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
