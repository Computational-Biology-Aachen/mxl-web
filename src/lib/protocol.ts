// Shared protocol types + expansion now live in the core package; re-exported
// here so existing `$lib/protocol` import sites keep working.
export {
  expandProtocol,
  type ProtocolStep,
  type Protocol,
  type PamStep,
  type PamGroup,
} from "@computational-biology-aachen/mxlweb-core/pam";

import type {
  PamStep,
  PamGroup,
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
