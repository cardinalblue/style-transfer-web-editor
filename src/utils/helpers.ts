export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
    reader.onabort = (error) => reject(error)
  })
}

export const compressImage = (file: File, quality: number = 0.5, maxSize = 1080): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const img = new Image()
      img.src = reader.result as string
      img.onload = () => {
        // resize image first
        let width = img.naturalWidth || img.width
        let height = img.naturalHeight || img.height
        // set max width or height to maxSize
        const ratio = Math.min(1, maxSize / width, maxSize / height)
        width = width * ratio
        height = height * ratio
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        // add white bg to canvas
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            const newFile = new File([blob as Blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            resolve(newFile)
          },
          'image/jpeg',
          quality
        )
      }
      img.onerror = (error) => {
        reject(error)
      }
    }
  })
}
