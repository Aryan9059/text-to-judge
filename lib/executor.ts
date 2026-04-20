import axios from "axios";

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  compilationError: string | null;
  executionTimeMs: number;
}

const JUDGE0_URL = "https://ce.judge0.com";

const LANGUAGE_MAP = {
  cpp: 54,
};

function encode(str: string): string {
  return Buffer.from(str || "").toString("base64");
}

function decode(str: string | null): string {
  if (!str) return "";
  return Buffer.from(str, "base64").toString("utf-8");
}

async function submitCode(code: string, input: string) {
  const response = await axios.post(
    `${JUDGE0_URL}/submissions?base64_encoded=true&wait=false`,
    {
      source_code: encode(code),
      stdin: encode(input),
      language_id: LANGUAGE_MAP.cpp,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.token;
}

async function getResult(token: string) {
  let attempts = 0;
  const MAX_ATTEMPTS = 50;

  while (attempts < MAX_ATTEMPTS) {
    const res = await axios.get(
      `${JUDGE0_URL}/submissions/${token}?base64_encoded=true`
    );

    const result = res.data;

    if (result.status && result.status.id >= 3) {
      return result;
    }

    attempts++;

    // smoother polling (faster UX)
    await new Promise((r) =>
      setTimeout(r, Math.min(800, 200 + attempts * 100))
    );
  }

  throw new Error("Execution timed out (polling limit reached)");
}

export async function compileAndRun(
  code: string,
  input: string
): Promise<ExecutionResult> {
  try {
    const token = await submitCode(code, input);
    const result = await getResult(token);

    return {
      stdout: decode(result.stdout),
      stderr: decode(result.stderr),
      exitCode: result.status.id === 3 ? 0 : 1,
      timedOut: result.status.id === 5,
      compilationError: result.compile_output
        ? decode(result.compile_output)
        : null,
      executionTimeMs: result.time
        ? parseFloat(result.time) * 1000
        : 0,
    };
  } catch (err: any) {
    console.error("Executor error:", err.response?.data || err.message);

    return {
      stdout: "",
      stderr: `Judge API Error: ${
        err.response?.data?.message || err.message
      }`,
      exitCode: 1,
      timedOut: false,
      compilationError: null,
      executionTimeMs: 0,
    };
  }
}