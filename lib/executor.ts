import { exec, spawn } from "child_process";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomBytes } from "crypto";

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  compilationError: string | null;
  executionTimeMs: number;
}

const MAX_OUTPUT_SIZE = 1024 * 64; // 64KB max output
const DEFAULT_TIMEOUT = 5000; // 5 seconds

function generateId(): string {
  return randomBytes(8).toString("hex");
}

async function ensureTempDir(): Promise<string> {
  const dir = join(tmpdir(), "text-to-judge");
  await mkdir(dir, { recursive: true });
  return dir;
}

async function cleanup(...files: string[]): Promise<void> {
  for (const file of files) {
    try {
      await unlink(file);
    } catch {
      // Ignore cleanup errors
    }
  }
}

function compileCode(
  sourcePath: string,
  outputPath: string
): Promise<{ success: boolean; error: string }> {
  return new Promise((resolve) => {
    exec(
      `g++ -std=c++17 -O2 -o "${outputPath}" "${sourcePath}"`,
      { timeout: 15000 },
      (error, _stdout, stderr) => {
        if (error) {
          resolve({ success: false, error: stderr || error.message });
        } else {
          resolve({ success: true, error: "" });
        }
      }
    );
  });
}

function runExecutable(
  exePath: string,
  input: string,
  timeoutMs: number
): Promise<{ stdout: string; stderr: string; exitCode: number | null; timedOut: boolean; executionTimeMs: number }> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let settled = false;

    const child = spawn(exePath, [], {
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
    });

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
      // On Windows, also try taskkill
      try {
        exec(`taskkill /PID ${child.pid} /T /F`, { windowsHide: true });
      } catch {
        // Ignore
      }
    }, timeoutMs);

    child.stdout.on("data", (data: Buffer) => {
      if (stdout.length < MAX_OUTPUT_SIZE) {
        stdout += data.toString();
      }
    });

    child.stderr.on("data", (data: Buffer) => {
      if (stderr.length < MAX_OUTPUT_SIZE) {
        stderr += data.toString();
      }
    });

    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({
        stdout: stdout.substring(0, MAX_OUTPUT_SIZE),
        stderr: stderr.substring(0, MAX_OUTPUT_SIZE),
        exitCode: code,
        timedOut,
        executionTimeMs: Date.now() - startTime,
      });
    });

    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({
        stdout: "",
        stderr: err.message,
        exitCode: 1,
        timedOut: false,
        executionTimeMs: Date.now() - startTime,
      });
    });

    // Write input to stdin
    if (input) {
      child.stdin.write(input);
    }
    child.stdin.end();
  });
}

export async function compileAndRun(
  code: string,
  input: string,
  timeoutMs: number = DEFAULT_TIMEOUT
): Promise<ExecutionResult> {
  const tempDir = await ensureTempDir();
  const id = generateId();
  const sourcePath = join(tempDir, `${id}.cpp`);
  const exePath = join(tempDir, `${id}.exe`);

  try {
    // Write source code
    await writeFile(sourcePath, code, "utf-8");

    // Compile
    const compilation = await compileCode(sourcePath, exePath);
    if (!compilation.success) {
      return {
        stdout: "",
        stderr: "",
        exitCode: 1,
        timedOut: false,
        compilationError: compilation.error,
        executionTimeMs: 0,
      };
    }

    // Run
    const result = await runExecutable(exePath, input, timeoutMs);

    return {
      ...result,
      compilationError: null,
    };
  } finally {
    await cleanup(sourcePath, exePath);
  }
}
