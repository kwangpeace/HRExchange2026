import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { buildContextForChat } from "@/lib/lectures";

export const runtime = "nodejs";

const DEFAULT_MODEL = "gemini-2.0-flash";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY가 설정되어 있지 않습니다." },
      { status: 503 },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 본문입니다." }, { status: 400 });
  }

  const messages = body.messages?.filter(
    (m) =>
      m &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string",
  ) as ChatMessage[] | undefined;

  if (!messages?.length) {
    return NextResponse.json({ error: "messages가 필요합니다." }, { status: 400 });
  }

  const last = messages[messages.length - 1];
  if (last.role !== "user") {
    return NextResponse.json(
      { error: "마지막 메시지는 user여야 합니다." },
      { status: 400 },
    );
  }

  const context = buildContextForChat();
  const systemInstruction = [
    "당신은 HR Exchange 2026 컨퍼런스 요약 페이지 전용 도우미입니다.",
    "아래 [컨텍스트]에 있는 정보만 근거로 답하세요.",
    "컨텍스트에 없는 내용은 추측하지 말고, 한국어로 '제공된 요약에는 해당 내용이 없습니다'라고 짧게 알리세요.",
    "답변은 한국어로 하며, 가능하면 어떤 강연(제목)과 관련 있는지 짧게 언급하세요.",
    "",
    "[컨텍스트]",
    context,
  ].join("\n");

  const modelName = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction,
    });

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("model" as const),
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.4,
      },
    });

    const result = await chat.sendMessage(last.content);
    const text = result.response.text();
    return NextResponse.json({ reply: text });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "알 수 없는 오류";
    console.error("[api/chat]", msg);
    return NextResponse.json(
      { error: `Gemini 호출 실패: ${msg}` },
      { status: 502 },
    );
  }
}
