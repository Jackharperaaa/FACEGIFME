import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface FaceSwapRequest {
  image_url: string;
  gif_url: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405 
        }
      )
    }

    const { image_url, gif_url }: FaceSwapRequest = await req.json()

    console.log('🚀 Edge Function received request')
    console.log('📸 Image URL:', image_url ? `${image_url.substring(0, 50)}...` : 'null')
    console.log('🎭 GIF URL:', gif_url)

    // Handle test connection requests
    if (image_url === 'test' && gif_url === 'test') {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Supabase Edge Function is working',
          function_status: 'online'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (!image_url || !gif_url) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Both image_url and gif_url are required' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Get Segmind API key from environment
    const segmindApiKey = Deno.env.get('SEGMIND_API_KEY')
    if (!segmindApiKey) {
      console.error('❌ SEGMIND_API_KEY not configured')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'SEGMIND_API_KEY not configured in Supabase Environment Variables' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    console.log('🤖 Calling Segmind API...')

    // Call Segmind face swap API
    const segmindResponse = await fetch('https://api.segmind.com/v1/face-swap-v2', {
      method: 'POST',
      headers: {
        'x-api-key': segmindApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        face_image: image_url,
        target_image: gif_url,
        face_restore: true,
        face_upsample: true,
        upscale: 1,
        codeformer_fidelity: 0.8
      }),
    })

    console.log('📡 Segmind response status:', segmindResponse.status)

    if (!segmindResponse.ok) {
      const errorText = await segmindResponse.text()
      console.error('❌ Segmind API error:', segmindResponse.status, errorText)
      
      let errorMessage = 'Face swap processing failed'
      if (segmindResponse.status === 401) {
        errorMessage = '❌ Invalid Segmind API key'
      } else if (segmindResponse.status === 402) {
        errorMessage = '❌ Insufficient credits in Segmind account'
      } else if (segmindResponse.status === 422) {
        errorMessage = '❌ Invalid input - check if images contain clear faces'
      } else if (segmindResponse.status === 429) {
        errorMessage = '❌ Rate limit exceeded - please wait and try again'
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: errorMessage,
          details: errorText
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: segmindResponse.status,
        }
      )
    }

    // Get the result as blob
    const segmindResult = await segmindResponse.blob()
    
    // Convert blob to base64 for easier handling
    const arrayBuffer = await segmindResult.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const resultImageUrl = `data:image/jpeg;base64,${base64}`

    console.log('✅ Face swap completed successfully')
    console.log('📊 Result size:', base64.length, 'characters')

    return new Response(
      JSON.stringify({
        success: true,
        image: resultImageUrl,
        message: 'Face swap completed successfully',
        processing_time: Date.now()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Error in faceswap-segmind function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})