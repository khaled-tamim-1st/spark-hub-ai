import { analyzeAndSupervise } from './analyzer.js';
import { SupervisorInspectionInput, SupervisorExecutionSummary } from './types.js';
import { getSupervisorStats } from './audit.js';

export * from './types.js';
export * from './audit.js';
export * from './internal-notes.js';

/**
 * Public Dispatcher:
 * Channels (WhatsApp, Web Widget, Messenger, Instagram) call this non-blocking function
 * when an incoming customer message is received.
 */
export function dispatchSupervisorInspection(
  input: SupervisorInspectionInput
): void {
  // Run asynchronously without awaiting so the customer response path is instantaneous (Principle 2)
  setImmediate(async () => {
    try {
      const summary: SupervisorExecutionSummary = await analyzeAndSupervise(input);
      if (summary.analyzed) {
        console.log(
          `[AI Supervisor] Completed inspection for conv #${input.conversationId} in ${summary.latencyMs}ms (Escalated: ${summary.escalated}, Deal: ${summary.dealCreatedOrUpdated}, Tags: ${summary.tagsApplied.length})`
        );
      } else if (summary.error) {
        console.warn(`[AI Supervisor] Inspection skipped/warn: ${summary.error}`);
      }
    } catch (err: any) {
      console.error('[AI Supervisor] Unhandled dispatch error:', err.message);
    }
  });
}
