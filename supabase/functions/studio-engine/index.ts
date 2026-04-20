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
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" })

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

      // ── BRAND DEALS ENGINE ────────────────────────────────────────────────────

      case "DEAL_INSIGHT":
        isJson = true;
        prompt = `
          You are an elite brand partnership strategist with deep expertise in creator economy deals.
          Analyze this deal:
          - Brand: ${brandName}
          - Campaign Type: ${inputData}
          - Creator Niche: ${niche}
          - Deal Value: ${format}
          
          Return a JSON object with this EXACT structure:
          {
            "matchScore": 94,
            "engagementEstimate": "5.2%",
            "riskLevel": "Low",
            "riskColor": "emerald",
            "negotiationTip": "One sharp, actionable negotiation tactic for this specific deal",
            "brandProfile": "2-sentence summary of who this brand is and what they truly want from creators",
            "creatorFit": "Why specifically this creator niche is a strong or weak match",
            "redFlags": ["Flag 1 if any", "Flag 2 if any"],
            "dealStrength": "Strong" | "Moderate" | "Weak",
            "recommendedAction": "The single most important next step to take right now"
          }
        `;
        break;

      case "BRAND_ANALYSIS":
        isJson = true;
        prompt = `
          You are a brand intelligence analyst for the creator economy.
          Provide a deep analysis of the brand "${brandName}" operating in the ${niche} niche.
          Campaign type they run: ${inputData}
          
          Return a JSON object:
          {
            "overview": "2-sentence brand overview",
            "targetCreatorProfile": "Exact description of their ideal creator partner",
            "campaignGoals": ["Goal 1", "Goal 2", "Goal 3"],
            "negotiationLeverage": "Key leverage point for the creator in negotiations",
            "redFlags": ["Potential red flag 1", "Potential red flag 2"],
            "pitchAngle": "The most compelling angle to pitch this brand with",
            "idealContentFormats": ["Format 1", "Format 2"],
            "brandPersonality": "One word that defines this brand's personality"
          }
        `;
        break;

      case "CONTRACT_REVIEW":
        isJson = true;
        prompt = `
          You are a seasoned entertainment and creator economy lawyer.
          Review this contract clause or description: "${inputData}"
          Brand: ${brandName || "Unknown"}
          
          Return a JSON object:
          {
            "riskRating": "Low" | "Medium" | "High" | "Critical",
            "riskColor": "emerald" | "amber" | "orange" | "rose",
            "summary": "Plain English explanation of what this clause means",
            "redFlags": ["Specific red flag 1", "Specific red flag 2"],
            "suggestedRevision": "Exact suggested revision or counter-clause wording",
            "creatorProtections": ["Protection 1 to demand", "Protection 2 to demand"],
            "verdict": "Should Sign" | "Negotiate First" | "Do Not Sign"
          }
        `;
        break;

      case "ROI_FORECAST":
        isJson = true;
        prompt = `
          You are a financial strategist specializing in creator economy deals.
          Creator Niche: ${niche}
          Deal Fee: ₹${inputData}
          Target Reach: ${format} people
          Creator's typical Engagement Rate: ${duration || "4.5%"}
          
          Return a detailed JSON object:
          {
            "fairMarketValue": "₹X - ₹Y (range)",
            "roiMultiple": "2.3x",
            "breakdownInsight": "2-sentence analysis of the deal's financial health",
            "benchmarkComparison": "How this compares to industry standard for this niche",
            "negotiationFloor": "₹X minimum to accept",
            "optimisticRevenue": "₹X if deal performs above average",
            "recommendation": "Accept" | "Negotiate Up" | "Walk Away",
            "recommendationReason": "Why this recommendation makes sense for this creator"
          }
        `;
        break;

      case "PITCH_REFINER":
        prompt = `
          You are an elite brand partnership copywriter.
          Improve and refine this existing pitch to be more compelling, professional, and conversion-focused.
          Keep the same tone but make it sharper, more specific, and persuasive.
          
          Original Pitch:
          "${inputData}"
          
          Brand: ${brandName || "the brand"}
          Creator Niche: ${niche || "content creation"}
          
          Return ONLY the improved pitch text. No explanations, no headers. Just the refined pitch.
        `;
        break;

      case "COLLAB_SCOUT":
        prompt = `
          Write a compelling, personalized creator-to-creator collaboration pitch.
          From: A ${niche} creator
          To: ${brandName} (creator in: ${inputData})
          Collaboration Goal: ${format || "Content series collaboration"}
          
          Write a short, direct, friendly pitch (under 120 words) that shows genuine interest in collaborating, highlights mutual audience benefits, and proposes a specific collab format.
          Return only the pitch text.
        `;
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
    const errorMsg = error.message || String(error)
    let statusCode = 500
    if (errorMsg.includes("429") || errorMsg.includes("quota")) {
      statusCode = 429
    } else if (errorMsg.includes("403") || errorMsg.includes("leaked")) {
      statusCode = 403
    }
    
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
