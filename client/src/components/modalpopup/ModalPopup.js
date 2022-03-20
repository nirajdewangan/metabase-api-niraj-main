import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import ImageBrowser from '../imagebrowser/ImageBrowser';
function ModalPopup(props){
    
    return(
        <>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                   Video Streaming
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                     {props.pop}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide} >Close</Button>
                </Modal.Footer>
                </Modal>
        </>
    )
}

export default ModalPopup;