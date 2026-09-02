import type { ScenarioFn, ScenarioName } from "../types";
import { normal } from "./normal";
import { criticalLow } from "./critical-low";
import { empty } from "./empty";
import { offline } from "./offline";
import { occlusionSuspected } from "./occlusion-suspected";

export const scenarios: Record<ScenarioName, ScenarioFn> = {
  normal,
  "critical-low": criticalLow,
  empty,
  offline,
  "occlusion-suspected": occlusionSuspected,
};
