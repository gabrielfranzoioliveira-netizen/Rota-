export function sleep(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function simulateRequest<T>(
  payload: T,
  options?: { delay?: number; failRate?: number; errorMessage?: string }
) {
  await sleep(options?.delay ?? 550);
  if (options?.failRate && Math.random() < options.failRate) {
    throw new Error(options.errorMessage ?? "Nao foi possivel concluir a acao.");
  }
  return payload;
}
