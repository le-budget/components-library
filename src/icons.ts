import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faXmark,
  faTriangleExclamation,
  faChevronDown,
  faChevronUp
} from "@fortawesome/free-solid-svg-icons";

export type StatusIconName =
  | "status-success"
  | "status-warning"
  | "status-error"
  | "status-info";

export const statusIconMap: Record<StatusIconName, IconDefinition> = {
  "status-success": faCircleCheck,
  "status-warning": faTriangleExclamation,
  "status-error": faCircleXmark,
  "status-info": faCircleInfo
};

export const statusLabelMap: Record<StatusIconName, string> = {
  "status-success": "Succes",
  "status-warning": "Avertissement",
  "status-error": "Erreur",
  "status-info": "Information"
};

export const chevronDownIcon = faChevronDown;
export const chevronUpIcon = faChevronUp;
export const clearIcon = faXmark;
