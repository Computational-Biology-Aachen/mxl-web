export interface ProtocolStep {
  t_end: number;
  PFD: number;
}

export type Protocol = ProtocolStep[];

export interface PamPhase {
  backgroundPFD: number;
  backgroundLength: number;
  pulsePFD: number;
  pulseLength: number;
  repetitions: number;
}

export function expandProtocol(phases: PamPhase[]): Protocol {
  const steps: ProtocolStep[] = [];
  let t = 0;
  for (const phase of phases) {
    for (let i = 0; i < phase.repetitions; i++) {
      t += phase.backgroundLength;
      steps.push({ t_end: t, PFD: phase.backgroundPFD });
      if (phase.pulseLength > 0) {
        t += phase.pulseLength;
        steps.push({ t_end: t, PFD: phase.pulsePFD });
      }
    }
  }
  return steps;
}
