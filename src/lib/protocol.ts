// Shared protocol types + expansion now live in the core package; re-exported
// here so existing `$lib/protocol` import sites keep working.
export {
  expandProtocol,
  type PamGroup,
  type PamStep,
  type Protocol,
  type ProtocolStep,
} from "@computational-biology-aachen/mxlweb-core/pam";

import type {
  PamGroup,
  PamStep,
} from "@computational-biology-aachen/mxlweb-core/pam";

// mxlweb-only: migration of the legacy saved-scan "phase" format to PamGroups.
export interface PamPhase {
  backgroundPFD: number;
  backgroundLength: number;
  pulsePFD: number;
  pulseLength: number;
  repetitions: number;
}

export function migratePamPhases(phases: PamPhase[]): PamGroup[] {
  return phases.map((phase) => {
    const steps: PamStep[] = [
      { pfd: phase.backgroundPFD, duration: phase.backgroundLength },
    ];
    if (phase.pulseLength > 0) {
      steps.push({ pfd: phase.pulsePFD, duration: phase.pulseLength });
    }
    return { steps, repetitions: phase.repetitions };
  });
}

export interface PredefinedProtocol {
  name: string;
  groups: PamGroup[];
}

export const PREDEFINED_PROTOCOLS: PredefinedProtocol[] = [
  {
    name: "NPQ induction & recovery",
    groups: [
      { steps: [{ pfd: 10, duration: 30 }], repetitions: 1 },
      {
        steps: [
          { pfd: 5000, duration: 0.72 },
          { pfd: 200, duration: 29.28 },
        ],
        repetitions: 10,
      },
      {
        steps: [
          { pfd: 5000, duration: 0.72 },
          { pfd: 10, duration: 29.28 },
        ],
        repetitions: 5,
      },
    ],
  },
  {
    name: "Rapid light curve (RLC)",
    groups: [100, 200, 500, 1000, 2000].map((pfd) => ({
      steps: [
        { pfd, duration: 9.2 },
        { pfd: 5000, duration: 0.8 },
      ],
      repetitions: 3,
    })),
  },
  {
    name: "Light curve (LC)",
    groups: [50, 100, 200, 500, 1000, 2000].map((pfd) => ({
      steps: [
        { pfd, duration: 59 },
        { pfd: 5000, duration: 1 },
      ],
      repetitions: 3,
    })),
  },
];
