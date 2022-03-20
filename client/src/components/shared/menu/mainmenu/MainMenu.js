import Nav from 'react-bootstrap/Nav'

function MainMenu(){
    return(
        <>
            <Nav className="justify-content-end">
                <Nav.Item>
                    <Nav.Link href="/">
                        <div style={{width:"150px",height:"45px",backgroundColor:"#F99F8C",borderRadius:"1px solid red",textAlign:"center",fontFamily:"georgia",verticalAlign:"middle",paddingTop:"10px",color:"#ffffff"}}>
                        Dashboard
                        </div>
                        </Nav.Link>
                </Nav.Item>
                {/* <Nav.Item>
                    <Nav.Link href="/IssueMessage">Page2</Nav.Link>
                </Nav.Item> */}
                {/* <Nav.Item>
                    <Nav.Link>Page3</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link>Page4</Nav.Link>
                </Nav.Item> */}
            </Nav>
        </>
    )
}

export default MainMenu;