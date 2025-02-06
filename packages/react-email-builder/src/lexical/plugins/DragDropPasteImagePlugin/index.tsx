import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $insertNodes, COMMAND_PRIORITY_LOW } from 'lexical'
import { DRAG_DROP_PASTE } from '@lexical/rich-text'
import { useEffect, useRef } from 'react'
import { $createImageNode } from '../../nodes/ImageNode'
import type { FileUploadFunction } from '../../../types'

export function DragDropPasteImagePlugin({
  upload
}: {
  upload: FileUploadFunction
}) {
  const [editor] = useLexicalComposerContext()
  const ref = useRef({ upload })

  useEffect(() => {
    ref.current.upload = upload
  }, [ref, upload])

  useEffect(() => {
    return editor.registerCommand(
      DRAG_DROP_PASTE,
      (files) => {
        const uploadImage = ref.current.upload

        if (uploadImage && files.length) {
          const insertImage = (file: File) => {
            if (file.type.startsWith('image/')) {
              editor.update(() => {
                const loading = $createImageNode('')

                $insertNodes([loading])

                uploadImage(file)
                  .then(({ url }) => {
                    editor.update(() => {
                      if (loading.isAttached()) {
                        loading.replace($createImageNode(url, file.name))
                      }
                    })
                  })
                  .catch(() => {
                    editor.update(() => {
                      if (loading.isAttached()) {
                        loading.remove()
                      }
                    })
                  })
              })
            }
          }

          for (let i = 0; i < files.length; i += 1) {
            insertImage(files[i])
          }

          return true
        }

        return false
      },
      COMMAND_PRIORITY_LOW
    )
  }, [ref, editor])

  return null
}
