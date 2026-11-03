/**
 * Re-export of the Codex asset contract. These file names are FIXED —
 * never reference an image that is not in this list.
 */

export const assets = {
  bgGame: require('../../assets/bg_game.png'),
  logo: require('../../assets/logo.png'),
  iconHome: require('../../assets/icon_home.png'),
  iconPause: require('../../assets/icon_pause.png'),
  sprite1: require('../../assets/sprite_1.png'),
  sprite2: require('../../assets/sprite_2.png'),
  sprite3: require('../../assets/sprite_3.png'),
  sprite4: require('../../assets/sprite_4.png'),
  sprite5: require('../../assets/sprite_5.png'),
};

/**
 * sprite_1..sprite_5 came back from Codex as playing-card suit art, which has
 * nothing to do with tiling, so no screen references them. The tile sample on
 * the menu and the finish swatches in the Tile Picker are drawn in code.
 */

export default assets;
