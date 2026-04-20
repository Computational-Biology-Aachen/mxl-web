export interface ProtocolStep {
  t_end: number;
  PFD: number;
}

export type Protocol = ProtocolStep[];

export interface PamStep {
  pfd: number;
  duration: number;
  label?: string;
}

export interface PamGroup {
  steps: PamStep[];
  repetitions: number;
}

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

export function expandProtocol(groups: PamGroup[]): Protocol {
  const steps: ProtocolStep[] = [];
  let t = 0;
  for (const group of groups) {
    for (let i = 0; i < group.repetitions; i++) {
      for (const step of group.steps) {
        t += step.duration;
        steps.push({ t_end: t, PFD: step.pfd });
      }
    }
  }
  return steps;
}
