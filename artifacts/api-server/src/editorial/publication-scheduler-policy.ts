export type ScheduledPublicationState = {
  status: string;
  publishAt: Date;
};

export function isScheduledPublicationDue(
  state: ScheduledPublicationState,
  now: Date,
): boolean {
  return state.status === "scheduled" && state.publishAt.getTime() <= now.getTime();
}

export function getDueScheduledPublications<T extends ScheduledPublicationState>(
  states: readonly T[],
  now: Date,
): T[] {
  return states.filter((state) => isScheduledPublicationDue(state, now));
}
