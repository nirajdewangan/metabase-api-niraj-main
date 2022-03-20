import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MainMenu from "../menu/mainmenu/MainMenu";


function Header(){
    return(
        <Row style={{height:'120px'}}>
            <Col></Col>
            <Col>
                <MainMenu/>
            </Col>
        </Row>
    )
}

export default Header;