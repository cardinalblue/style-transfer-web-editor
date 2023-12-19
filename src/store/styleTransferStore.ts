import { create } from 'zustand'

type State = {
  styleTransferResult: string | null
}

type Actions = {
  applyStyleTransfer: (image: string) => Promise<string>
}

const initialState: State = {
  styleTransferResult: null,
}

export const useStyleTransferStore = create<State & Actions>((set, get) => ({
  ...initialState,

  applyStyleTransfer: async (image: string) => {
    // const config = style.config
    const config = {
      prompt:
        'highly detailed watercolor painting, clean brush stroke in beautiful colors, illustration, digital art, concept art, paint on canvas, masterpiece, extreme high quality, sharp focus, professional, 4k, max detail, highres, high detail, smooth, aesthetic, extremely detailed, 8k, uhd',
      negative_prompt:
        'blurry, abstract, disfigured, deformed, cartoon, animated, toy, figure, framed, 3d, badly drawn hands, nude, cartoon, bad art, poorly drawn, extra limb, close up, b&w, weird colors, watermark, blur haze',
      num_inference_steps: 8,
      strength: 0.8,
      guidance_scale: 10,
      controlnet_conditioning_scale: 1,
      face_mask_threshold: 0.98,
    }
    const initial_image_b64 = image ?? ''
    const res = await fetch('/api/style-transfer', {
      method: 'POST',
      body: JSON.stringify({ input: { initial_image_b64, config } }),
      // signal,
    })

    const data = await res.json()
    const newImage = data.output.stylized_image_b64
    return newImage
  },
}))
