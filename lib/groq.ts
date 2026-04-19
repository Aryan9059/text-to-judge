import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface TestCase {
  input: string;
  output: string;
}

export interface GeneratedProblem {
  title: string;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  sampleCases: TestCase[];
  hiddenCases: TestCase[];
  hints: string[];
}

const SYSTEM_PROMPT = `You are an expert competitive programming problem setter. Given a vague coding idea, generate a complete, well-structured coding problem.

You MUST respond with ONLY valid JSON (no markdown, no code fences, no explanation) in this exact format:
{
  "title": "Short descriptive title",
  "statement": "Full problem statement in plain text. Use \\n for line breaks. Be clear and unambiguous.",
  "inputFormat": "Description of the input format",
  "outputFormat": "Description of the expected output format",
  "constraints": ["1 <= N <= 10^5", "1 <= A[i] <= 10^9"],
  "difficulty": "Easy" | "Medium" | "Hard",
  "sampleCases": [
    { "input": "actual input text", "output": "expected output text" }
  ],
  "hiddenCases": [
    { "input": "actual input text", "output": "expected output text" }
  ],
  "hints": ["Optional hint 1", "Optional hint 2"]
}

Rules:
- Generate 2-3 sample cases (visible to user)
- Generate 3-5 hidden cases (for judging, include edge cases and stress tests)
- All inputs/outputs must be newline-separated plain text (stdin/stdout style)
- Constraints must be precise with ranges
- Statement must be self-contained and unambiguous
- Make sure all test case outputs are EXACTLY correct
- Difficulty should match the complexity of the problem
- Use competitive programming style formatting`;

export async function generateProblem(
  idea: string
): Promise<GeneratedProblem> {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Generate a coding problem based on this idea: "${idea}"`,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 4096,
  });

  const content = chatCompletion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from Groq");
  }

  // Try to parse JSON, handling potential markdown code fences
  let jsonStr = content.trim();

  // Strip markdown code fences if present
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }

  try {
    const parsed = JSON.parse(jsonStr);

    // Validate required fields
    if (!parsed.title || !parsed.statement || !parsed.sampleCases) {
      throw new Error("Missing required fields in generated problem");
    }

    return parsed as GeneratedProblem;
  } catch (parseError) {
    // Attempt to extract JSON from the response
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const extracted = JSON.parse(jsonMatch[0]);
        return extracted as GeneratedProblem;
      } catch {
        // Fall through
      }
    }
    throw new Error(
      `Failed to parse LLM response as JSON: ${(parseError as Error).message}`
    );
  }
}

const REGEN_SYSTEM_PROMPT = `You are an expert competitive programming judge. Given a problem description and its constraints, generate a fresh, harder set of test cases.

You MUST respond with ONLY valid JSON (no markdown, no code fences) in this exact format:
{
  "sampleCases": [
    { "input": "actual input text", "output": "expected output text" }
  ],
  "hiddenCases": [
    { "input": "actual input text", "output": "expected output text" }
  ]
}

Rules:
- Generate 2 new sample cases (simple, visible to the user)
- Generate 6-8 hidden cases following this breakdown:
  * 2 edge cases (minimum/maximum single values, empty sequences, etc.)
  * 2 large stress tests AT THE CONSTRAINT LIMIT (N = 10^5 or whatever the max is) with random data. These should expose TLE in O(N^2) or worse solutions.
  * 1-2 cases with values that maximise memory usage (very long strings, large arrays) to expose MLE.
  * 1-2 adversarial / tricky cases (sorted input, reverse-sorted, all-same values, etc.)
- All inputs/outputs must be newline-separated plain text (stdin/stdout style)
- Outputs MUST be exactly correct for the given problem — double-check arithmetic
- Do NOT include any explanation outside the JSON`;

export async function regenerateTestCases(
  problem: GeneratedProblem
): Promise<{ sampleCases: TestCase[]; hiddenCases: TestCase[] }> {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: REGEN_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Problem title: ${problem.title}

Statement: ${problem.statement}

Input format: ${problem.inputFormat}
Output format: ${problem.outputFormat}
Constraints: ${problem.constraints.join(", ")}

Generate fresh test cases including stress/TLE/MLE cases.`,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.8,
    max_tokens: 4096,
  });

  const content = chatCompletion.choices[0]?.message?.content;
  if (!content) throw new Error("No response from Groq");

  let jsonStr = content.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }

  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed.sampleCases || !parsed.hiddenCases) {
      throw new Error("Missing sampleCases or hiddenCases in response");
    }
    return parsed as { sampleCases: TestCase[]; hiddenCases: TestCase[] };
  } catch {
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const extracted = JSON.parse(jsonMatch[0]);
      return extracted as { sampleCases: TestCase[]; hiddenCases: TestCase[] };
    }
    throw new Error("Failed to parse regenerated test cases from LLM response");
  }
}

export async function reviewCode(
  code: string,
  problem: GeneratedProblem
): Promise<string> {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an expert C++ code reviewer. Analyze the code for:
1. **Correctness**: Does it solve the problem correctly?
2. **Mistakes**: Any bugs or logical errors?
3. **Improvements**: Better approaches, cleaner code?
4. **Complexity**: Time and space complexity analysis.

Format your response in clean markdown with headers. Be concise but thorough.`,
      },
      {
        role: "user",
        content: `Problem: ${problem.title}\n\nStatement: ${problem.statement}\n\nConstraints: ${problem.constraints.join(", ")}\n\nCode:\n\`\`\`cpp\n${code}\n\`\`\``,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
    max_tokens: 2048,
  });

  return chatCompletion.choices[0]?.message?.content || "No review generated.";
}
