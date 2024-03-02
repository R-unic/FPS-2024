interface ReplicatedFirst extends Instance {
  Assets: Folder & {
    Character: Folder & {
      Arms: Folder & {
        Standard: ArmsModel;
      };
    };
    Guns: Folder & {
      HK433: GunModel;
    };
    Melees: Folder & {
      Knife: MeleeModel;
    };
    CommonAudio: Folder & {
      Aim: Sound;
      Unaim: Sound;
    }
  };
}