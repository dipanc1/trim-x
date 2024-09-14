import { Asset } from "expo-asset";

class Icon {
  module: any;
  width: number;
  height: number;

  constructor(module: any, width: number, height: number) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

const ICON_PLAY_BUTTON = new Icon(
  require("../../assets/images/play_button.png"),
  34,
  51
);
const ICON_PAUSE_BUTTON = new Icon(
  require("../../assets/images/pause_button.png"),
  34,
  51
);
const ICON_STOP_BUTTON = new Icon(
  require("../../assets/images/stop_button.png"),
  22,
  22
);
const ICON_FORWARD_BUTTON = new Icon(
  require("../../assets/images/forward_button.png"),
  33,
  25
);
const ICON_BACK_BUTTON = new Icon(
  require("../../assets/images/back_button.png"),
  33,
  25
);

const ICON_LOOP_ALL_BUTTON = new Icon(
  require("../../assets/images/loop_all_button.png"),
  77,
  35
);
const ICON_LOOP_ONE_BUTTON = new Icon(
  require("../../assets/images/loop_one_button.png"),
  77,
  35
);

const ICON_MUTED_BUTTON = new Icon(
  require("../../assets/images/muted_button.png"),
  67,
  58
);
const ICON_UNMUTED_BUTTON = new Icon(
  require("../../assets/images/unmuted_button.png"),
  67,
  58
);

const ICON_TRACK_1 = new Icon(
  require("../../assets/images/track_1.png"),
  166,
  5
);
const ICON_THUMB_1 = new Icon(
  require("../../assets/images/thumb_1.png"),
  18,
  19
);
const ICON_THUMB_2 = new Icon(
  require("../../assets/images/thumb_2.png"),
  15,
  19
);

export {
  ICON_PLAY_BUTTON,
  ICON_PAUSE_BUTTON,
  ICON_STOP_BUTTON,
  ICON_FORWARD_BUTTON,
  ICON_BACK_BUTTON,
  ICON_LOOP_ALL_BUTTON,
  ICON_LOOP_ONE_BUTTON,
  ICON_MUTED_BUTTON,
  ICON_UNMUTED_BUTTON,
  ICON_TRACK_1,
  ICON_THUMB_1,
  ICON_THUMB_2
};