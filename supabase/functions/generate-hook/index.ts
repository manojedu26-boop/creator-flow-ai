import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { videoId } = await req.json()
    const GOOGLE_KEY = Deno.env.get('GOOGLE_API_KEY')

    if (!GOOGLE_KEY) {
      return new Response(
        JSON.stringify({ error: "Intelligence Protocol Failure: GOOGLE_API_KEY not configured in Edge Secrets." }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // 1. Fetch Video Title from YouTube Data API v3
    // Note: The key provided must have YouTube Data API v3 enabled in Google Cloud Console
    const ytResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${GOOGLE_KEY}&part=snippet`
    )
    const ytData = await ytResponse.json()
    
    if (!ytData.items || ytData.items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Target Node Not Found: YouTube returned no metadata for this Video ID." }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }
    
    const originalTitle = ytData.items[0]?.snippet?.title || "Unknown Title"

    // 2. Interface with Gemini Intelligence
    const genAI = new GoogleGenerativeAI(GOOGLE_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `You are a viral content strategist. 
    Here is a YouTube video title: "${originalTitle}". 
    Rewrite it into 3 "Viral Hooks" for a YouTube Short. 
    Make them punchy, curiosity-driven, and high-CTR. 
    Output should be a clear list of 3 items. No preamble.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Clean up response into array
    const hooks = text
      .split('\n')
      .map(line => line.replace(/^[\d\.\-\s]+/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 3)

    return new Response(
      JSON.stringify({ 
        hooks,
        metadata: {
          originalTitle,
          timestamp: new Date().toISOString(),
          status: "Intelligence Synthesized"
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
