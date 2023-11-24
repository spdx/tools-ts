// SPDX-FileCopyrightText: 2023 SPDX contributors
//
// SPDX-License-Identifier: MIT

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
    if (type === ActorType.Tool && email) {
      throw new Error("Email must be undefined if actorType is Tool.");
    }

    this.name = name;
    this.email = email ?? undefined;
    this.type = type;
  }

  static fromSpdxActor(actor: SpdxActor): Actor {
    const actorType = ActorType[actor.type as keyof typeof ActorType];
    if (!actorType) {
      throw new Error("Invalid actor type: " + actor.type);
    }
    return new Actor(actor.name, actorType, actor.email);
  }

  static fromSpdxActors(actors: SpdxActor[] | SpdxActor): Actor[] {
    if (Array.isArray(actors)) {
      return actors.map((creator) => Actor.fromSpdxActor(creator));
    } else {
      return [Actor.fromSpdxActor(actors)];
    }
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
