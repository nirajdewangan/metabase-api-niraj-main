import Nav from 'react-bootstrap/Nav'
function MainMenu() {
    return (
        <>
            <div style={{ display: "flex", flexDirection: "row", width: "100%", textAlign: "right", marginTop: "10px", justifyContent: "space-between" }}>

                <div style={{ display: "flex", marginTop: "10px" }}>
                    <div style={{ marginTop: "5px", marginRight: "10px", width: "30px", height: "30px", color: 'red' }}>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">
                            <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
                            <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
                        </svg> */}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{display:"flex"}}>
                            <strong id="desId" style={{ textAlign: "left", fontFamily: "georgia", fontSize: "20px", color: "#000000" }}></strong>
                        </div>
                        <div>
                            <span id="desTxt" style={{ textAlign: "left",fontFamily: "georgia", fontSize: "15px", color: "#000000" }}></span>
                        </div>
                    </div>
                </div>

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