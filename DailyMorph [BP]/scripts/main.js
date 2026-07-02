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

const GEOM_IDS = [
  0,  // 0: human → default
  1,  // 1: zombie → dm_zombie
  2,  // 2: skeleton → dm_skeleton
  3,  // 3: creeper → dm_creeper
  4,  // 4: spider → dm_spider
  4,  // 5: cave spider → dm_spider
  5,  // 6: enderman → dm_enderman
  6,  // 7: witch → dm_witch
  7,  // 8: blaze → dm_blaze
  8,  // 9: ghast → dm_ghast
  9,  // 10: magma cube → dm_magma
  10, // 11: silverfish → dm_silverfish
  11, // 12: slime → dm_slime
  1,  // 13: drowned → dm_zombie
  1,  // 14: husk → dm_zombie
  2,  // 15: stray → dm_skeleton
  2,  // 16: bogged → dm_skeleton
  12, // 17: phantom → dm_phantom
  13, // 18: pillager → dm_default
  13, // 19: evoker → dm_default
  13, // 20: vindicator → dm_default
  14, // 21: ravager → dm_ravager
  15, // 22: vex → dm_vex
  16, // 23: guardian → dm_guardian
  17, // 24: elder guardian → dm_elder
  18, // 25: shulker → dm_shulker
  2,  // 26: wither skeleton → dm_skeleton
  19, // 27: zoglin → dm_hoglin
  20, // 28: piglin brute → dm_piglin
  19, // 29: hoglin → dm_hoglin
  13, // 30: breeze → dm_default
  13, // 31: creaking → dm_default
  21, // 32: chicken → dm_chicken
  22, // 33: cow → dm_cow
  23, // 34: pig → dm_pig
  24, // 35-37: sheep → dm_sheep
  24, // 36
  24, // 37
  25, // 38-40: rabbit → dm_rabbit
  25, // 39
  25, // 40
  26, // 41-43: horse → dm_horse
  26, // 42
  26, // 43
  27, // 44: donkey → dm_donkey
  28, // 45: mule → dm_mule
  26, // 46: skeleton horse → dm_horse
  26, // 47: zombie horse → dm_horse
  29, // 48-50: cat → dm_cat
  29, // 49
  29, // 50
  30, // 51: ocelot → dm_ocelot
  31, // 52-54: parrot → dm_parrot
  31, // 53
  31, // 54
  32, // 55: turtle → dm_turtle
  33, // 56-57: squid → dm_squid
  33, // 57
  34, // 58: dolphin → dm_dolphin
  35, // 59-60: fish → dm_fish
  35, // 60
  36, // 61: pufferfish → dm_pufferfish
  37, // 62-64: tropical → dm_tropical
  37, // 63
  37, // 64
  38, // 65-67: axolotl → dm_axolotl
  38, // 66
  38, // 67
  39, // 68-70: frog → dm_frog
  39, // 69
  39, // 70
  40, // 71: tadpole → dm_tadpole
  41, // 72: sniffer → dm_sniffer
  42, // 73: armadillo → dm_armadillo
  43, // 74: camel → dm_camel
  44, // 75: allay → dm_allay
  45, // 76: goat → dm_goat
  46, // 77-79: panda → dm_panda
  46, // 78
  46, // 79
  47, // 80-83: llama → dm_llama
  47, // 81
  47, // 82
  47, // 83
  48, // 84: wolf → dm_wolf
  49, // 85: bee → dm_bee
  50, // 86-87: fox → dm_fox
  50, // 87
  51, // 88: polar bear → dm_polar_bear
  20, // 89: piglin → dm_piglin
  20, // 90: zombie piglin → dm_piglin
  52, // 91: warden → dm_warden
  53, // 92: wither → dm_wither
  54, // 93: ender dragon → dm_dragon
  22, // 94-95: mooshroom → dm_cow
  22, // 95
  55, // 96: strider → dm_strider
  13, // 97: wandering trader → dm_default
  13, // 98-104: villager → dm_default
  13,
  13,
  13,
  13,
  13,
  13,
  56, // 105: iron golem → dm_iron_golem
  57, // 106: snow golem → dm_snow_golem
];

const TEX_IDS = [
  0,  // 0: human → default
  1,  // 1: zombie → dm_zombie
  2,  // 2: skeleton → dm_skeleton
  3,  // 3: creeper → dm_creeper
  4,  // 4: spider → dm_spider
  4,  // 5: cave spider → dm_spider
  5,  // 6: enderman → dm_enderman
  6,  // 7: witch → dm_witch
  7,  // 8: blaze → dm_blaze
  8,  // 9: ghast → dm_ghast
  9,  // 10: magma cube → dm_magma
  10, // 11: silverfish → dm_silverfish
  11, // 12: slime → dm_slime
  12, // 13: drowned → dm_drowned
  13, // 14: husk → dm_husk
  14, // 15: stray → dm_stray
  2,  // 16: bogged → dm_skeleton
  15, // 17: phantom → dm_phantom
  16, // 18: pillager → dm_pillager
  17, // 19: evoker → dm_evoker
  18, // 20: vindicator → dm_vindicator
  19, // 21: ravager → dm_ravager
  20, // 22: vex → dm_vex
  21, // 23: guardian → dm_guardian
  22, // 24: elder guardian → dm_elder
  23, // 25: shulker → dm_shulker
  25, // 26: wither skeleton → dm_wither_skeleton
  26, // 27: zoglin → dm_zoglin
  27, // 28: piglin brute → dm_piglin_brute
  28, // 29: hoglin → dm_hoglin
  0,  // 30: breeze → default
  0,  // 31: creaking → default
  31, // 32: chicken → dm_chicken
  32, // 33: cow → dm_cow
  33, // 34: pig → dm_pig
  34, // 35-37: sheep → dm_sheep
  34,
  34,
  35, // 38-40: rabbit → dm_rabbit
  35,
  35,
  36, // 41-43: horse → dm_horse
  36,
  36,
  37, // 44: donkey → dm_donkey
  38, // 45: mule → dm_mule
  39, // 46: skeleton horse → dm_skeleton_horse
  36, // 47: zombie horse → dm_horse
  40, // 48-50: cat → dm_cat
  40,
  40,
  41, // 51: ocelot → dm_ocelot
  42, // 52-54: parrot → dm_parrot
  42,
  42,
  43, // 55: turtle → dm_turtle
  44, // 56: squid → dm_squid
  45, // 57: glow squid → dm_glow_squid
  46, // 58: dolphin → dm_dolphin
  47, // 59: cod → dm_fish
  47, // 60: salmon → dm_fish
  48, // 61: pufferfish → dm_pufferfish
  49, // 62-64: tropical → dm_tropical
  49,
  49,
  50, // 65-67: axolotl → dm_axolotl
  50,
  50,
  51, // 68-70: frog → dm_frog
  51,
  51,
  52, // 71: tadpole → dm_tadpole
  53, // 72: sniffer → dm_sniffer
  54, // 73: armadillo → dm_armadillo
  55, // 74: camel → dm_camel
  56, // 75: allay → dm_allay
  57, // 76: goat → dm_goat
  58, // 77-79: panda → dm_panda
  58,
  58,
  59, // 80-83: llama → dm_llama
  59,
  59,
  59,
  60, // 84: wolf → dm_wolf
  61, // 85: bee → dm_bee
  62, // 86-87: fox → dm_fox
  62,
  63, // 88: polar bear → dm_polar_bear
  64, // 89: piglin → dm_piglin
  65, // 90: zombie piglin → dm_zombie_piglin
  29, // 91: warden → dm_warden
  24, // 92: wither → dm_wither
  30, // 93: ender dragon → dm_dragon
  66, // 94-95: mooshroom → dm_mooshroom
  66,
  67, // 96: strider → dm_strider
  68, // 97: wandering trader → dm_trader
  69, // 98-104: villager → dm_villager
  69,
  69,
  69,
  69,
  69,
  69,
  70, // 105: iron golem → dm_iron_golem
  71, // 106: snow golem → dm_snow_golem
];

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
    player.setProperty("dm:geom_id", 0);
    player.setProperty("dm:tex_id", 0);
    player.triggerEvent("dm:clear");
    player.triggerEvent("dm:human");
    player.runCommandAsync("effect @s clear");
    player.runCommandAsync("playsound random.orb @s");
    return;
  }
  player.setProperty("dm:current_morph", id);
  player.setProperty("dm:geom_id", GEOM_IDS[id] !== undefined ? GEOM_IDS[id] : 0);
  player.setProperty("dm:tex_id", TEX_IDS[id] !== undefined ? TEX_IDS[id] : 0);
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
      player.setProperty("dm:geom_id", GEOM_IDS[expectedId] !== undefined ? GEOM_IDS[expectedId] : 0);
      player.setProperty("dm:tex_id", TEX_IDS[expectedId] !== undefined ? TEX_IDS[expectedId] : 0);
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
