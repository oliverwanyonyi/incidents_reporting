import { useAuth } from '../../store/AuthProvider/AuthProvider'
import './modal.css'

const Modal = ({children, title}) => {
  const {modalOpen,closeModal }= useAuth()
  return (
    <div className={modalOpen? "modal modal-open": "modal"} onClick={()=>closeModal()}>
        
        <div className="modal-content" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-header">
                <h2 className="modal-title">{title}</h2>
                <button onClick={()=>closeModal()}> Close</button>
            </div>

            <div className="modal-body">
                {children}
            </div>
        </div>
    </div>
  )
}

export default Modal