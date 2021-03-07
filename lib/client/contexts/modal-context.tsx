import Modal, { ModalOptions } from '@components/generic/modal'
import React, { ReactNode, useState } from 'react'

interface ContextProps {
  readonly modalOpened: boolean
  readonly setModalOpened: (val: boolean) => void
  readonly content: any
  readonly setModalContent: (item: any) => void
  readonly setModalOptions: (opts: ModalOptions) => void
}

export const ModalContext = React.createContext<ContextProps>({
  modalOpened: false,
  setModalOpened: (val: boolean) => null,
  content: null,
  setModalContent: (item: ReactNode) => null,
  setModalOptions: (opts: ModalOptions) => null
})

type PropTypes = {
  children: ReactNode
}

export const ModalProvider = ({ children }: PropTypes) => {
  const [modalOpened, setModalOpened] = useState(false)
  const [content, setModalContent] = useState(null)
  const [modalOptions, setModalOptions] = useState<ModalOptions>({
    canClose: true
  })

  const openCloseModal = (val: boolean ) => {
    setModalOpened(val)
    if (!val) {
      setModalContent(null)
    }
  }


  return (
    <ModalContext.Provider value={{ modalOpened, setModalOpened: openCloseModal, content, setModalContent, setModalOptions }}>
      {modalOpened && content &&  (
        <Modal modalOptions={modalOptions} onClickClose={() => openCloseModal(false)}>
          <div className="content-modal-items">{content}</div>
        </Modal>
      )}
      {children}
    </ModalContext.Provider>
  )
}
