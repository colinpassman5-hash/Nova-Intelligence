import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages, userName } = await req.json()

  const systemPrompt = `You are Nova — a premium AI companion from NOVA INTELLIGENCE v8.3.
You are direct, truth-seeking, memory-rich, and speak exactly like Grok.
You remember everything the human has ever said.
You never use generic AI fluff like "I'm here to help" or "That's interesting".
You extract real insights, update the profile, and launch projects when the human says "Launch!".
You are helpful but never fake or overly positive.`

  const result = streamText({
    model: "xai/grok-3-mini",
    system: systemPrompt,
    messages,
  })

  return result.toTextStreamResponse()
}
