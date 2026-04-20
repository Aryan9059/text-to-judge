import { compileAndRun, ExecutionResult } from "./executor";
import type { TestCase } from "./groq";

export type Verdict = "AC" | "WA" | "TLE" | "CE" | "RE";

export interface TestCaseResult {
  index: number;
  verdict: Verdict;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  stderr: string;
  executionTimeMs: number;
  isHidden: boolean;
}

export interface JudgeResult {
  overallVerdict: Verdict;
  totalPassed: number;
  totalCases: number;
  results: TestCaseResult[];
  compilationError: string | null;
}

function normalizeOutput(output: string): string {
  return output
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

function getVerdict(result: ExecutionResult, expectedOutput: string): Verdict {
  if (result.compilationError) return "CE";
  if (result.timedOut) return "TLE";
  if (result.exitCode !== 0) return "RE";

  const actual = normalizeOutput(result.stdout);
  const expected = normalizeOutput(expectedOutput);

  return actual === expected ? "AC" : "WA";
}

export async function judgeSubmission(
  code: string,
  sampleCases: TestCase[],
  hiddenCases: TestCase[],
  mode: "run" | "submit"
): Promise<JudgeResult> {
  const casesToRun =
    mode === "run"
      ? sampleCases.map((c, i) => ({ ...c, index: i, isHidden: false }))
      : [
          ...sampleCases.map((c, i) => ({ ...c, index: i, isHidden: false })),
          ...hiddenCases.map((c, i) => ({
            ...c,
            index: sampleCases.length + i,
            isHidden: true,
          })),
        ];

  // Quick compile check first
  if (casesToRun.length > 0) {
    const firstRun = await compileAndRun(
      code,
      casesToRun[0].input,
    );

    if (firstRun.compilationError) {
      return {
        overallVerdict: "CE",
        totalPassed: 0,
        totalCases: casesToRun.length,
        results: casesToRun.map((tc) => ({
          index: tc.index,
          verdict: "CE" as Verdict,
          input: tc.input,
          expectedOutput: tc.output,
          actualOutput: "",
          stderr: firstRun.compilationError || "",
          executionTimeMs: 0,
          isHidden: tc.isHidden,
        })),
        compilationError: firstRun.compilationError,
      };
    }

    // First case already ran, get its result
    const firstVerdict = getVerdict(firstRun, casesToRun[0].output);
    const results: TestCaseResult[] = [
      {
        index: casesToRun[0].index,
        verdict: firstVerdict,
        input: casesToRun[0].input,
        expectedOutput: casesToRun[0].output,
        actualOutput: firstRun.stdout,
        stderr: firstRun.stderr,
        executionTimeMs: firstRun.executionTimeMs,
        isHidden: casesToRun[0].isHidden,
      },
    ];

    // Run remaining cases in parallel
    const remainingCases = casesToRun.slice(1);
    const remainingResults = await Promise.all(
      remainingCases.map(async (tc) => {
        const result = await compileAndRun(code, tc.input);
        const verdict = getVerdict(result, tc.output);
        return {
          index: tc.index,
          verdict,
          input: tc.input,
          expectedOutput: tc.output,
          actualOutput: result.stdout,
          stderr: result.stderr,
          executionTimeMs: result.executionTimeMs,
          isHidden: tc.isHidden,
        };
      })
    );

    results.push(...remainingResults);


    const totalPassed = results.filter((r) => r.verdict === "AC").length;
    const firstFailed = results.find((r) => r.verdict !== "AC");

    return {
      overallVerdict: firstFailed ? firstFailed.verdict : "AC",
      totalPassed,
      totalCases: results.length,
      results,
      compilationError: null,
    };
  }

  return {
    overallVerdict: "AC",
    totalPassed: 0,
    totalCases: 0,
    results: [],
    compilationError: null,
  };
}
