import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.24.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle preflight requests (CORS)
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { action, inputData, targetAesthetic } = await req.json()
    const apiKey = Deno.env.get('GOOGLE_API_KEY')
    
    const genAI = new GoogleGenerativeAI(apiKey!)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    let prompt = ""

    // Logic for different buttons in your UI
    if (action === "TONE_ARCHITECT") {
      prompt = `Rewrite this caption: "${inputData}" to sound ${targetAesthetic}.`
    } else if (action === "HOOK_GENERATOR") {
      prompt = `Generate 3 viral hooks for: "${inputData}"`
    }

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    return new Response(JSON.stringify({ output: text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
