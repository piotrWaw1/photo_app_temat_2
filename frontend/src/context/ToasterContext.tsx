import {createContext, ReactNode, useCallback, useState} from "react";
import {Toast, ToastContainer} from "react-bootstrap";

interface Toaster {
  show: (object: MessageObject) => void;
}

interface MessageObject {
  title: string | undefined;
  description: string;
  bg: string;
}

export const ToasterContext = createContext<Toaster>({
  show: () => {
  }
})

export const ToasterProvider = ({children, delay = 3000}: { children: ReactNode, delay: number }) => {
  const [toastData, setToastData] = useState<null | MessageObject>(null)

  const show = useCallback((object: MessageObject) => {
    setToastData(object)
  }, [])

  return (
      <ToasterContext.Provider value={{show}}>
        {children}
        <ToastContainer
            className="p-3"
            position='bottom-end'
            style={{zIndex: 1}}
        >
          <Toast onClose={() => setToastData(null)} show={!!toastData} delay={delay} autohide bg={toastData?.bg}>
            <Toast.Header>
              <strong className="me-auto">{toastData?.title}</strong>
            </Toast.Header>
            <Toast.Body className='text-light'>{toastData?.description}</Toast.Body>
          </Toast>
        </ToastContainer>
      </ToasterContext.Provider>
  )
}