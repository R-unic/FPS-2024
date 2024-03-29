import type { OnStart, OnRender } from "@flamework/core";
import { Component } from "@flamework/components";

import { Character, Player } from "shared/utilities/client";
import Log from "shared/logger";

import { ProceduralAnimations } from "../../base-components/procedural-animations";
import type { FpsController } from "client/controllers/fps";
import type { MovementController } from "client/controllers/movement";

@Component({ tag: "CharacterCamera" })
export class CharacterCamera extends ProceduralAnimations<{}, Camera> implements OnStart, OnRender {
  public constructor(fps: FpsController, movement: MovementController) {
    super(fps, movement);
  }

  public onStart(): void {
    Log.info("Started CharacterCamera");
    this.startProceduralAnimations();
    Player.CameraMode = Enum.CameraMode.LockFirstPerson;
  }

  public onRender(dt: number): void {
    if (!Character.PrimaryPart) return;

    const animationOffset = this.updateProceduralAnimations(dt);
    this.instance.CFrame = this.instance.CFrame
      .mul(animationOffset);
  }
}