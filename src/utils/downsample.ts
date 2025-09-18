import { singularDownSample as lttb } from "downsample-lttb-ts";

/** Downsample time series for visual representation using Largest-Triangle-Three-Buckets or LTTB algorithm */
export function downsample(series: number[], count: number): number[] {
  return lttb({ series, threshold: count });
}
