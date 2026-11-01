export type PublicationStateImportEntry = {
  slug: string;
  publishAt: Date;
  status: string;
};

export type ExistingPublicationState = PublicationStateImportEntry;

export function planPublicationStateImport(
  entries: readonly PublicationStateImportEntry[],
  currentRows: readonly ExistingPublicationState[],
) {
  const currentBySlug = new Map(currentRows.map((row) => [row.slug, row]));
  return entries.map((entry) => {
    const current = currentBySlug.get(entry.slug);
    const unchanged = current?.publishAt.getTime() === entry.publishAt.getTime() && current.status === entry.status;
    return {
      slug: entry.slug,
      disposition: unchanged ? "unchanged" as const : current ? "update" as const : "create" as const,
      previousStatus: current?.status ?? null,
      nextStatus: entry.status,
      previous: current ? { publishAt: current.publishAt.toISOString(), status: current.status } : null,
      entry,
    };
  });
}

export function getPreviousPublicationState(summary: string): { publishAt: Date; status: string } | null | undefined {
  try {
    const value: unknown = JSON.parse(summary);
    if (typeof value !== "object" || value === null || !("source" in value) || value.source !== "publish-state-admin" || !("previous" in value)) {
      return undefined;
    }
    if (value.previous === null) return null;
    if (
      typeof value.previous === "object" &&
      value.previous !== null &&
      "publishAt" in value.previous &&
      typeof value.previous.publishAt === "string" &&
      "status" in value.previous &&
      typeof value.previous.status === "string" &&
      !Number.isNaN(Date.parse(value.previous.publishAt))
    ) {
      return { publishAt: new Date(value.previous.publishAt), status: value.previous.status };
    }
    return undefined;
  } catch {
    return undefined;
  }
}
