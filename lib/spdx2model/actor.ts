import type { SpdxActor } from "../api/spdx-document";

export enum ActorType {
  Person = "Person",
  Organization = "Organization",
  Tool = "Tool",
}

export class Actor {
  type: ActorType;
  name: string;
  email?: string;

  constructor(name: string, type: ActorType, email?: string) {
    this.name = name;
    this.email = email ?? undefined;
    this.type = type;
  }

  static fromSpdxActor(creator: SpdxActor): Actor {
    const actorType = ActorType[creator.type as keyof typeof ActorType];
    if (!actorType) {
      throw new Error("Invalid actor type: " + creator.type);
    }
    return new Actor(creator.name, actorType, creator.email);
  }

  static tools(): Actor {
    return new Actor("SPDX Tools TS", ActorType.Tool);
  }

  toString(): string {
    return (
      this.type.valueOf() +
      ": " +
      this.name +
      (this.email ? " (" + this.email + ")" : "")
    );
  }
}
