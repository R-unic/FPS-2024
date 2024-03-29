import type { OnStart, OnRender } from "@flamework/core";
import { Component, type Components } from "@flamework/components";
import { Janitor } from "@rbxts/janitor";

import { Character } from "shared/utilities/client";
import { Assets } from "shared/utilities/helpers";
import Log from "shared/logger";

import { ProceduralAnimations } from "../base-components/procedural-animations";
import type { Gun } from "./gun";
import type { CharacterCamera } from "./cameras/character-camera";
import type { FpsController } from "client/controllers/fps";
import type { MovementController } from "client/controllers/movement";

@Component({ tag: "ViewModel" })
export class ViewModel extends ProceduralAnimations<{}, ArmsModel> implements OnStart, OnRender {
  public currentGun?: Gun;

  private readonly janitor = new Janitor;
  private readonly gunMotor = new Instance("Motor6D");

  public constructor(
    private readonly components: Components,
    fps: FpsController,
    movement: MovementController
  ) { super(fps, movement); }

  public onStart(): void {
    Log.info("Created ViewModel")
    this.instance.Parent = this.components.getAllComponents<CharacterCamera>()[0].instance;
    this.gunMotor.Name = "Gun";
    this.gunMotor.Part0 = this.instance.Mesh;
    this.janitor.Add(this.instance);
    this.startProceduralAnimations();
  }

  public onRender(dt: number): void {
    if (!this.instance.Parent) return;
    if (!Character.PrimaryPart) return;

    const camera = <Camera>this.instance.Parent;
    const animationOffset = this.updateProceduralAnimations(dt);
    const gunOffset = this.currentGun?.instance.Offsets.Main.Value ?? new CFrame;
    const baseOffset = new CFrame(0, -0.75, -1.75);
    this.instance.Mesh.CFrame = camera.CFrame
      .mul(baseOffset)
      .mul(gunOffset)
      .mul(animationOffset);
  }

  public playAnimation(name: AnimationName): Maybe<AnimationTrack> {
    if (!this.currentGun) return;

    const animation = this.currentGun.getAnimation(name);
    const track = this.instance.AnimationController.LoadAnimation(animation);
    track.Play();

    return track;
  }

  public addGun(gunName: GunName): Gun {
    const gun = Assets.Guns[gunName].Clone();
    gun.PivotTo(this.instance.GetPivot());
    gun.Parent = this.instance;

    this.currentGun = this.janitor.Add(this.components.addComponent<Gun>(gun), "destroy");
    this.currentGun.janitor.Add(gun.Offsets.Gun.GetPropertyChangedSignal("Value").Connect(() => this.gunMotor.C0 = gun.Offsets.Gun.Value));
    this.gunMotor.C0 = gun.Offsets.Gun.Value;
    this.gunMotor.Part1 = gun.Handle;
    this.gunMotor.Parent = this.instance.Mesh;

    return this.currentGun;
  }

  public removeGun(): void {
    this.gunMotor.Parent = undefined;
    this.currentGun?.destroy();
    this.currentGun = undefined;
  }

  public destroy(): void {
    this.janitor.Destroy();
  }
}