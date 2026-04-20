import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.24.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { action, inputData, targetAesthetic, niche, platforms, creatorName, brandName, month, format, duration, audience } = await req.json()
    const apiKey = Deno.env.get('GOOGLE_API_KEY')
    
    const genAI = new GoogleGenerativeAI(apiKey!)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    let prompt = ""
    let isJson = false

    switch (action) {
      case "TONE_ARCHITECT":
        prompt = `Rewrite this social media caption: "${inputData}" to sound ${targetAesthetic}. Maintain the core message but optimize for extreme engagement and a premium feel. Return only the rewritten text.`
        break;

      case "HOOK_GENERATOR":
        prompt = `Generate 5 viral, high-velocity hooks for: "${inputData}". Each hook should be designed to stop the scroll in under 1.5 seconds. Return as a plain text list.`
        break;

      case "DAILY_POST":
        isJson = true;
        prompt = `
          You are a world-class strategist for elite creators in the ${niche} niche.
          Platforms: ${platforms?.join(", ") || "Instagram"}
          Task: Create ONE high-fidelity post idea for TODAY.
          Return STRICT JSON format:
          {
            "type": "Reel" | "Carousel" | "Story" | "Long-form",
            "topic": "Specific actionable topic",
            "bestTime": "Optimal time (e.g., 6:30 PM)",
            "caption": "Full professional caption",
            "hashtags": ["list", "of", "15", "tags"],
            "hook": "Powerful 3-second hook",
            "reason": "Technical logic for engagement"
          }
        `;
        break;

      case "MONTH_STRATEGY":
        isJson = true;
        prompt = `
          Create a 30-day content calendar for the ${niche} niche for the month of ${month}.
          Platforms: ${platforms?.join(", ") || "Instagram"}
          Return a JSON array of exactly 30 items:
          [
            { "day": 1, "type": "Reel", "platform": "ig", "topic": "Topic Name", "time": "10:00 AM" },
            ...
          ]
        `;
        break;

      case "BRAND_PITCH":
        prompt = `Write a high-conversion, professional brand partnership pitch for ${creatorName} to the brand "${brandName}". Niche: ${niche}. Focus on ROI and audience alignment. Keep it under 150 words. Return only the pitch text.`
        break;

      case "HASHTAG_ENGINE":
        prompt = `Generate a viral cluster of 15 hashtags for: "${inputData}". Include a mix of broad, mid-tier, and hyper-niche tags. Return as a plain text list separated by # signs.`
        break;

      case "BIO_OPTIMIZER":
        prompt = `Optimize an Instagram bio for a ${niche} creator. Include a hook, credibility booster, and CTA. Return 3 variants separated by "---".`
        break;

      case "SCRIPT_GENERATOR":
        isJson = true;
        prompt = `
          Write a cinematic script for: "${inputData}".
          Format: ${format}, Duration: ${duration}, Audience: ${audience}.
          Return a JSON array of script sections:
          [
            { "act": "HOOK (0-3s)", "text": "Visual/Audio description + speech" },
            { "act": "BUILD (3-15s)", "text": "..." },
            { "act": "PAYOFF", "text": "..." },
            { "act": "CTA", "text": "..." }
          ]
        `;
        break;

      case "REEL_IDEAS":
        isJson = true;
        prompt = `
          Generate 3 viral Reel concepts for the ${niche} niche focusing on "${inputData}".
          Return a JSON array:
          [
            { "title": "Catchy Title", "concept": "Brief explanation", "audio": "Trending sound name/type" },
            ...
          ]
        `;
        break;

      case "CAROUSEL_BUILDER":
        isJson = true;
        prompt = `
          Create a 5-slide educational carousel framework for: "${inputData}".
          Return a JSON array:
          [
            { "slide": 1, "title": "The Hook", "content": "Bold statement" },
            ...
          ]
        `;
        break;

      case "THUMBNAIL_ORACLE":
        prompt = `Generate a strategic thumbnail composition for a creator in the ${niche} niche for the topic: "${inputData}". Include Background, Subject, Overlay Text, and Composition recommendations. Return only the directive text.`;
        break;

      default:
        throw new Error("Action node not recognized by terminal.");
    }

    const result = await model.generateContent(prompt)
    let text = result.response.text()

    if (isJson) {
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    }

    return new Response(JSON.stringify({ output: isJson ? JSON.parse(text) : text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
