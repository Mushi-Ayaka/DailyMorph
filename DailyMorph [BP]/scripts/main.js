import { world, system } from "@minecraft/server";

const MORPH_COUNT = 106;
const FIRST_MORPH = 1;
const FORCE_INTERVAL = 100;
const DAY_LENGTH = 24000;
const MARGIN = 5;

const MORPH_NAMES = {
  0: "Humano",
  1: "Zombie", 2: "Skeleton", 3: "Creeper", 4: "Spider", 5: "Cave Spider",
  6: "Enderman", 7: "Witch", 8: "Blaze", 9: "Ghast", 10: "Magma Cube",
  11: "Silverfish", 12: "Slime", 13: "Drowned", 14: "Husk", 15: "Stray",
  16: "Bogged", 17: "Phantom", 18: "Pillager", 19: "Evoker", 20: "Vindicator",
  21: "Ravager", 22: "Vex", 23: "Guardian", 24: "Elder Guardian", 25: "Shulker",
  26: "Wither Skeleton", 27: "Zoglin", 28: "Piglin Brute", 29: "Hoglin",
  30: "Breeze", 31: "Creaking", 32: "Chicken", 33: "Cow", 34: "Pig",
  35: "Sheep", 36: "Black Sheep", 37: "Brown Sheep", 38: "White Rabbit",
  39: "Black Rabbit", 40: "Gold Rabbit", 41: "White Horse", 42: "Black Horse",
  43: "Brown Horse", 44: "Donkey", 45: "Mule", 46: "Skeleton Horse",
  47: "Zombie Horse", 48: "Black Cat", 49: "Red Cat", 50: "Siamese Cat",
  51: "Ocelot", 52: "Red Parrot", 53: "Blue Parrot", 54: "Green Parrot",
  55: "Turtle", 56: "Squid", 57: "Glow Squid", 58: "Dolphin", 59: "Cod",
  60: "Salmon", 61: "Pufferfish", 62: "Tropical Fish", 63: "Clownfish",
  64: "Angelfish", 65: "Pink Axolotl", 66: "Gold Axolotl", 67: "Blue Axolotl",
  68: "Frog", 69: "Cold Frog", 70: "Warm Frog", 71: "Tadpole",
  72: "Sniffer", 73: "Armadillo", 74: "Camel", 75: "Allay", 76: "Goat",
  77: "Panda", 78: "Brown Panda", 79: "Playful Panda", 80: "White Llama",
  81: "Brown Llama", 82: "Creamy Llama", 83: "Trader Llama", 84: "Wolf",
  85: "Bee", 86: "Red Fox", 87: "Snow Fox", 88: "Polar Bear",
  89: "Piglin", 90: "Zombie Piglin", 91: "Warden", 92: "Wither",
  93: "Ender Dragon", 94: "Red Mooshroom", 95: "Brown Mooshroom",
  96: "Strider", 97: "Wandering Trader", 98: "Plains Villager",
  99: "Desert Villager", 100: "Savanna Villager", 101: "Taiga Villager",
  102: "Snow Villager", 103: "Jungle Villager", 104: "Swamp Villager",
  105: "Iron Golem", 106: "Snow Golem"
};

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
      world.sendMessage(`§6[DM] §e${player.name} §7→ §a${MORPH_NAMES[player.getDynamicProperty("dm:morph_id")] || "???"}`);
    }
  }
}, 10);

world.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player;
  if (!event.initialSpawn) return;
  const morphId = player.getDynamicProperty("dm:morph_id");
  if (morphId === undefined || morphId === null) {
    assignRandomMorph(player);
    world.sendMessage(`§6[DM] §e${player.name} §7→ §a${MORPH_NAMES[player.getDynamicProperty("dm:morph_id")] || "???"}`);
  } else {
    applyMorph(player, morphId);
  }
});

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    const morphId = player.getDynamicProperty("dm:morph_id");
    if (morphId === undefined || morphId === null || morphId === 0) continue;
    checkAndForce(player, morphId);
  }
}, FORCE_INTERVAL);

function assignRandomMorph(player) {
  const id = Math.floor(Math.random() * (MORPH_COUNT - FIRST_MORPH + 1)) + FIRST_MORPH;
  player.setDynamicProperty("dm:morph_id", id);
  player.setDynamicProperty("dm:last_time", world.getTime());
  applyMorph(player, id);
}

function applyMorph(player, id) {
  if (id === 0) {
    player.triggerEvent("dm:human");
    player.runCommandAsync("effect @s clear");
    player.runCommandAsync("replaceitem entity @s slot.armor.head 0 air");
    return;
  }
  player.runCommandAsync("effect @s clear");
  player.triggerEvent("dm:clear");
  player.triggerEvent(`dm:${id}`);
  player.runCommandAsync("replaceitem entity @s slot.armor.head 0 dm:morph_token");

  for (let i = 0; i < 3; i++) {
    system.runTimeout(() => {
      try { player.runCommandAsync(`effect @s invisibility 100000 1 true`); } catch(e) {}
    }, i * 2);
  }
}

function checkAndForce(player, expectedId) {
  try {
    player.triggerEvent(`dm:${expectedId}`);
    player.runCommandAsync("replaceitem entity @s slot.armor.head 0 dm:morph_token");
    player.runCommandAsync("effect @s invisibility 100000 1 true");
  } catch(e) {}
}
