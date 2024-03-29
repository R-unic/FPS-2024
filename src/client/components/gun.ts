import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Janitor } from "@rbxts/janitor";

import type GunData from "shared/structs/gun-data";
import { Assets } from "shared/utilities/helpers";
import Object from "@rbxts/object-utils";

@Component({ tag: "Gun" })
export class Gun extends BaseComponent<{}, GunModel> implements OnStart {
  public readonly janitor = new Janitor;
  public readonly sounds = {
    Aim: Assets.CommonAudio.Aim.Clone(),
    Unaim: Assets.CommonAudio.Unaim.Clone(),
    Empty: Assets.CommonAudio.Empty.Clone(),
    SwitchFiremode: Assets.CommonAudio.SwitchFiremode.Clone()
  };

  private readonly muzzle = this.instance.Handle.Muzzle;

  public onStart(): void {
    this.weld();
    this.instance.Handle.Equip.Play();
    this.janitor.Add(this.instance);

    for (const sound of Object.values(this.sounds))
      sound.Parent = this.instance.Handle;
  }

  public shoot(): void {
    this.instance.Handle.Fire.Play();

    this.muzzle.Light.Enabled = true;
    task.delay(0.06, () => this.muzzle.Light.Enabled = false);
    for (const particle of this.muzzle.GetChildren().filter((child): child is ParticleEmitter => child.IsA("ParticleEmitter")))
      particle.Emit(1);
  }

  public getAnimation(name: AnimationName): Animation {
    return this.instance.Animations[name];
  }

  public getData(): GunData {
    return <GunData>require(this.instance.Data);
  }

  private weld(): void {
    const data = this.getData();
    const parts = this.instance.GetChildren()
      .filter((child): child is BasePart => child.IsA("BasePart"));

    for (const part of parts) {
      const weld = new Instance(data.movingParts.includes(part.Name) ? "Motor6D" : "Weld");
      weld.Name = part.Name;
      weld.Part0 = this.instance.Handle;
      weld.Part1 = part;
      weld.C0 = new CFrame;
      weld.C1 = weld.Part1.CFrame.ToObjectSpace(weld.Part0.CFrame);
      weld.Parent = this.instance.Handle;
    }
  }

  public destroy(): void {
    this.janitor.Destroy();
  }
}