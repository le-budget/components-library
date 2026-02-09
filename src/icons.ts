import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCircleCheck,
  faCircleInfo,
  faCircleQuestion,
  faCircleXmark,
  faXmark,
  faTriangleExclamation,
  faChevronDown,
  faChevronUp,
  faArrowDown,
  faArrowUp
} from "@fortawesome/free-solid-svg-icons";

export type StatusIconName =
  | "status-success"
  | "status-warning"
  | "status-error"
  | "status-info"
  | "status-question";

export const statusIconMap: Record<StatusIconName, IconDefinition> = {
  "status-success": faCircleCheck,
  "status-warning": faTriangleExclamation,
  "status-error": faCircleXmark,
  "status-info": faCircleInfo,
  "status-question": faCircleQuestion
};

export const statusLabelMap: Record<StatusIconName, string> = {
  "status-success": "Succes",
  "status-warning": "Avertissement",
  "status-error": "Erreur",
  "status-info": "Information",
  "status-question": "Question"
};

export const chevronDownIcon = faChevronDown;
export const chevronUpIcon = faChevronUp;
export const clearIcon = faXmark;
export const sortArrowDownIcon = faArrowDown;
export const sortArrowUpIcon = faArrowUp;
