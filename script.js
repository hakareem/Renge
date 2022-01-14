"use strict";
import { Game } from "./classes/game.js";
window.game = new Game(window.innerWidth, window.innerHeight);
window.addEventListener("resize", () => window.game.resize(window.innerWidth, window.innerHeight));
//# sourceMappingURL=script.js.map