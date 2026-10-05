export function shouldSeedDefaultSchedule(
  nodeEnv: string | undefined = process.env.NODE_ENV,
  allowDefaultScheduleSeed: string | undefined =
    process.env.NEWSROOM_ALLOW_DEFAULT_SCHEDULE_SEED,
): boolean {
  return (
    nodeEnv === "test" ||
    (nodeEnv === "development" && allowDefaultScheduleSeed === "true")
  );
}
