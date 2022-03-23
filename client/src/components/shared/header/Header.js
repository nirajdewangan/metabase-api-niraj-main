import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MainMenu from "../menu/mainmenu/MainMenu";


function Header(){
    return(<>
                <MainMenu/>
        <div style={{marginTop:"20px"}}></div>
        <hr/>
        </>
    )
}

export default Header;