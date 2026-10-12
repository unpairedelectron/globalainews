export function shouldSeedDefaultSchedule(
  nodeEnv?: string,
  allowDefaultScheduleSeed?: string,
): boolean {
  const resolvedNodeEnv =
    arguments.length >= 1 ? nodeEnv : process.env.NODE_ENV;
  const resolvedAllowDefaultScheduleSeed =
    arguments.length >= 2
      ? allowDefaultScheduleSeed
      : process.env.NEWSROOM_ALLOW_DEFAULT_SCHEDULE_SEED;
  return (
    resolvedNodeEnv === "test" ||
    (resolvedNodeEnv === "development" &&
      resolvedAllowDefaultScheduleSeed === "true")
  );
}
