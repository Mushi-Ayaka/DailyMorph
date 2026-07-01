import { world, system } from "@minecraft/server";

const MORPH_COUNT = 106;
const FIRST_MORPH = 1;
const FORCE_INTERVAL = 100;

const MORPH_NAMES = {
  0: "§fHumano",
  1: "§2Zombie", 2: "§7Skeleton", 3: "§aCreeper", 4: "§8Spider", 5: "§8Cave Spider",
  6: "§5Enderman", 7: "§dWitch", 8: "§6Blaze", 9: "§fGhast", 10: "§4Magma Cube",
  11: "§7Silverfish", 12: "§aSlime", 13: "§2Drowned", 14: "§6Husk", 15: "§bStray",
  16: "§2Bogged", 17: "§7Phantom", 18: "§8Pillager", 19: "§5Evoker", 20: "§5Vindicator",
  21: "§cRavager", 22: "§bVex", 23: "§3Guardian", 24: "§3Elder Guardian", 25: "§dShulker",
  26: "§8Wither Skeleton", 27: "§cZoglin", 28: "§6Piglin Brute", 29: "§cHoglin",
  30: "§bBreeze", 31: "§2Creaking", 32: "§eChicken", 33: "§6Cow", 34: "§dPig",
  35: "§fSheep", 36: "§8Black Sheep", 37: "§6Brown Sheep", 38: "§fWhite Rabbit",
  39: "§8Black Rabbit", 40: "§eGold Rabbit", 41: "§fWhite Horse", 42: "§8Black Horse",
  43: "§6Brown Horse", 44: "§7Donkey", 45: "§7Mule", 46: "§7Skeleton Horse",
  47: "§2Zombie Horse", 48: "§8Black Cat", 49: "§6Red Cat", 50: "§bSiamese Cat",
  51: "§eOcelot", 52: "§cRed Parrot", 53: "§9Blue Parrot", 54: "§aGreen Parrot",
  55: "§2Turtle", 56: "§7Squid", 57: "§bGlow Squid", 58: "§9Dolphin", 59: "§7Cod",
  60: "§cSalmon", 61: "§ePufferfish", 62: "§bTropical Fish", 63: "§dClownfish",
  64: "§6Angelfish", 65: "§dPink Axolotl", 66: "§eGold Axolotl", 67: "§bBlue Axolotl",
  68: "§aFrog", 69: "§3Cold Frog", 70: "§6Warm Frog", 71: "§7Tadpole",
  72: "§7Sniffer", 73: "§6Armadillo", 74: "§eCamel", 75: "§bAllay", 76: "§7Goat",
  77: "§fPanda", 78: "§6Brown Panda", 79: "§aPlayful Panda", 80: "§fWhite Llama",
  81: "§6Brown Llama", 82: "§eCreamy Llama", 83: "§eTrader Llama", 84: "§7Wolf",
  85: "§eBee", 86: "§cRed Fox", 87: "§fSnow Fox", 88: "§6Polar Bear",
  89: "§6Piglin", 90: "§2Zombie Piglin", 91: "§3Warden", 92: "§8Wither",
  93: "§5Ender Dragon", 94: "§cRed Mooshroom", 95: "§6Brown Mooshroom",
  96: "§cStrider", 97: "§eWandering Trader", 98: "§2Plains Villager",
  99: "§6Desert Villager", 100: "§eSavanna Villager", 101: "§3Taiga Villager",
  102: "§bSnow Villager", 103: "§aJungle Villager", 104: "§5Swamp Villager",
  105: "§7Iron Golem", 106: "§fSnow Golem"
};

function assignRandomMorph(player) {
  const id = Math.floor(Math.random() * (MORPH_COUNT - FIRST_MORPH + 1)) + FIRST_MORPH;
  player.setDynamicProperty("dm:morph_id", id);
  player.setDynamicProperty("dm:last_time", world.getTime());
  applyMorph(player, id);
  world.sendMessage(`§6[DM] §e${player.name} §7→ ${MORPH_NAMES[id]}`);
}

function applyMorph(player, id) {
  if (id === 0 || id === undefined || id === null) {
    player.setProperty("dm:current_morph", 0);
    player.triggerEvent("dm:clear");
    player.triggerEvent("dm:human");
    player.runCommandAsync("effect @s clear");
    player.runCommandAsync("playsound random.orb @s");
    return;
  }
  player.setProperty("dm:current_morph", id);
  player.runCommandAsync("effect @s clear");
  player.triggerEvent("dm:clear");
  player.triggerEvent(`dm:${id}`);
  player.runCommandAsync("particle minecraft:large_explosion ~ ~1 ~");
  player.runCommandAsync("playsound mob.blaze.hurt @s");
}

function reapply(player, expectedId) {
  try {
    const current = player.getProperty("dm:current_morph");
    if (current !== expectedId) {
      player.setProperty("dm:current_morph", expectedId);
      player.triggerEvent("dm:clear");
      player.triggerEvent(`dm:${expectedId}`);
    }
  } catch(e) {}
}

world.afterEvents.worldLoad.subscribe(() => {
  system.runInterval(() => {
    const time = world.getTime();
    for (const player of world.getPlayers()) {
      const dm = player.getDynamicProperty("dm:day");
      const prevTime = player.getDynamicProperty("dm:last_time");
      if (prevTime === undefined || prevTime === null) {
        assignRandomMorph(player);
        continue;
      }
      const wrapped = time < prevTime;
      player.setDynamicProperty("dm:last_time", time);
      if (wrapped || dm === undefined || dm === null) {
        assignRandomMorph(player);
        player.setDynamicProperty("dm:day", (dm || 0) + 1);
      }
    }
  }, 20);

  system.runInterval(() => {
    for (const player of world.getPlayers()) {
      const morphId = player.getDynamicProperty("dm:morph_id");
      if (morphId === undefined || morphId === null || morphId === 0) continue;
      reapply(player, morphId);
    }
  }, FORCE_INTERVAL);
});

world.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player;
  if (!event.initialSpawn) return;
  const morphId = player.getDynamicProperty("dm:morph_id");
  if (morphId === undefined || morphId === null) {
    assignRandomMorph(player);
  } else {
    applyMorph(player, morphId);
  }
});

world.afterEvents.itemUse.subscribe((event) => {
  const player = event.source;
  const item = event.itemStack;
  if (!item || item.typeId !== "dm:morph_token") return;
  assignRandomMorph(player);
  player.runCommandAsync("playsound random.orb @s");
});
