import Nav from 'react-bootstrap/Nav'

function MainMenu() {
    return (
        <>
            <div style={{ display:"flex",flexDirection:"row-reverse", width: "100%", textAlign: "right", marginTop: "10px", }}>
                <div>
                    <a href="/">
                        <div style={{ width: "150px", height: "45px", backgroundColor: "#F99F8C", borderRadius: "1px solid red", textAlign: "center", fontFamily: "georgia", verticalAlign: "middle", paddingTop: "10px", color: "#ffffff" }}>
                            Dashboard
                        </div>
                    </a>
                </div>
            </div>
        </>
    )
}

export default MainMenu;