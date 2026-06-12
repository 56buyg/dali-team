/**
 * 轮询 Runninghub 任务状态直到完成或失败
 *
 * 用法:
 *   const { taskId } = await submitResponse.json();
 *   pollTaskStatus(taskId, setFiles, setError, setLoading);
 */
export function pollTaskStatus(
  taskId: string,
  onComplete: (files: string[]) => void,
  onError: (error: string) => void,
  onDone: () => void,
  options?: { pollIntervalMs?: number; maxWaitMs?: number },
) {
  const pollIntervalMs = options?.pollIntervalMs ?? 2000;
  const maxWaitMs = options?.maxWaitMs ?? 180_000; // 3 分钟
  const start = Date.now();

  const poll = setInterval(async () => {
    try {
      // 超时检查
      if (Date.now() - start > maxWaitMs) {
        clearInterval(poll);
        onError("任务超时（超过 3 分钟），请重试");
        onDone();
        return;
      }

      const res = await fetch(`/api/tools/status?taskId=${taskId}`);
      const status = await res.json();

      if (status.status === "completed") {
        clearInterval(poll);
        onComplete(status.result?.files ?? []);
        onDone();
      } else if (status.status === "failed") {
        clearInterval(poll);
        onError(status.error ?? "任务执行失败，请重试");
        onDone();
      }
      // pending / running: 继续轮询
    } catch {
      // 网络错误时继续重试，不立即失败
    }
  }, pollIntervalMs);
}
