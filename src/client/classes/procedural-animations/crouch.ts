import { TweenInfoBuilder } from "@rbxts/builders";

import { tween } from "shared/utilities/ui";

import type { MovementController } from "client/controllers/movement";
import type ProceduralAnimation from "../procedural-animation";

export default class CrouchAnimation implements ProceduralAnimation {
  public readonly headHeight = -1.5;
  // public readonly crouchModelAngle = 20;
  // public readonly crouchModelZOffset = 1;

  private readonly t = new Instance("NumberValue");
  private readonly tweenInfo = new TweenInfoBuilder()
    .SetTime(0.35)
    .SetEasingStyle(Enum.EasingStyle.Sine)
    .SetEasingDirection(Enum.EasingDirection.Out)

  public start(movement: MovementController): void {
    movement.stood.Connect(() => tween(this.t, this.tweenInfo, { Value: 0 }));
    movement.proned.Connect(() => tween(this.t, this.tweenInfo, { Value: 0 }));
    movement.crouched.Connect(() => tween(this.t, this.tweenInfo, { Value: 1 }));
  }

  public update(dt: number): Vector3 {
    return new Vector3(this.t.Value);
  }
}