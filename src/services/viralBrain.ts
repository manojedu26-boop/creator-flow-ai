import { supabase } from "../lib/supabase";

export interface ViralHookResponse {
  hooks: string[];
  metadata?: {
    originalTitle: string;
    timestamp: string;
    status: string;
  };
  error?: string;
}

/**
 * Invokes the 'generate-hook' edge function to synthesize viral hooks 
 * from a specific YouTube video target.
 */
export const generateViralHooks = async (videoId: string): Promise<ViralHookResponse> => {
  if (!supabase) {
    return { 
      hooks: [], 
      error: "Intelligence Link Severed: Supabase client is not initialized." 
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-hook', {
      body: { videoId }
    });

    if (error) {
      console.error("Viral Brain Invocation Failed:", error);
      return { 
        hooks: [], 
        error: error.message || "Failed to establish a neural handshake with the Viral Brain." 
      };
    }

    return data as ViralHookResponse;
  } catch (err: any) {
    console.error("Critical Failure in Viral Brain Service:", err);
    return { 
      hooks: [], 
      error: err.message || "An unexpected error occurred during intelligence synthesis." 
    };
  }
};
