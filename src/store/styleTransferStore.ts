import { create } from 'zustand'
import { useEditorStore } from './editorStore'

type State = {
  userPrompt: string
  styleTransferResult: string | null
  abortController: AbortController | null
}

type Actions = {
  applyStyleTransfer: () => Promise<string>
  updateStyleTransferResult: (url: string) => void
  updateUserPrompt: (prompt: string) => void
  updateAbortController: () => void
}

const initialState: State = {
  userPrompt: '',
  styleTransferResult: null,
  abortController: null,
}

export const useStyleTransferStore = create<State & Actions>((set, get) => ({
  ...initialState,

  applyStyleTransfer: async () => {
    get().updateAbortController()

    const { editorScreenshot } = useEditorStore.getState()
    const prompt = get().userPrompt
    const config = {
      prompt,
      negative_prompt:
        'blurry, abstract, disfigured, deformed, cartoon, animated, toy, figure, framed, 3d, badly drawn hands, nude, cartoon, bad art, poorly drawn, extra limb, close up, b&w, weird colors, watermark, blur haze',
      num_inference_steps: 8,
      strength: 0.8,
      guidance_scale: 10,
      controlnet_conditioning_scale: 1,
      face_mask_threshold: 0.98,
    }
    const initial_image_b64 = editorScreenshot

    // temp disable fetching in dev mode
    if (process.env.NODE_ENV === 'development') {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return editorScreenshot
    }

    const res = await fetch('/api/style-transfer', {
      method: 'POST',
      body: JSON.stringify({ input: { initial_image_b64, config } }),
      signal: get().abortController?.signal,
    })

    const data = await res.json()
    const newImage = data.output.stylized_image_b64
    return newImage
  },
  updateStyleTransferResult: (url) => set({ styleTransferResult: url }),
  updateUserPrompt: (prompt) => set({ userPrompt: prompt }),
  updateAbortController: () => {
    get().abortController?.abort() // cancel previous request
    set({ abortController: new AbortController() })
  },
}))
