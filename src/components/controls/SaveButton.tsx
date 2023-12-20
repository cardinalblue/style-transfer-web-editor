import { css } from '@styled-system/css'
import { useEditorStore } from '@/store'
import { Button } from '@/components/basic/Button'
import { DownloadIcon } from '@/components/icons/DownloadIcon'

export const SaveButton = () => {
  const { resultImage } = useEditorStore()

  const onSave = () => {
    if (!resultImage) {
      return
    }

    const link = document.createElement('a')
    link.href = resultImage
    link.download = 'style-trasfer.png'
    link.click()
  }
  return (
    <Button onClick={onSave} isDisabled={!resultImage}>
      <div className={iconWrapper}>
        <DownloadIcon />
      </div>
      Save
    </Button>
  )
}

const iconWrapper = css({
  w: '24px',
})
