import Table from 'react-bootstrap/Table';
import {StyledCommon} from '../shared/common/Common'
function Matrix(){

    var data = [
        {"bicycle":169, "bus":102, "car" : 104, "motorbike":106, "none":101, "person":114, "truck":104},
        {"bicycle":103, "bus":170, "car" :106, "motorbike":102, "none":107,"person": 106, "truck":106},
        {"bicycle":104, "bus":106, "car":166,"motorbike": 102,"none": 105, "person":106, "truck":111},
        {"bicycle":102, "bus":102, "car":118,"motorbike": 151, "none":109, "person":112, "truck":106},
        {"bicycle":104, "bus":108, "car":101,"motorbike": 102,"none": 180,"person": 103,"truck": 102},
        {"bicycle":107, "bus":106, "car":103,"motorbike": 107,"none": 102, "person":167, "truck":108},
        {"bicycle":111, "bus":106, "car":107,"motorbike": 105, "none":107,"person": 106, "truck":158}
    ];

    return(<>
    <StyledCommon.AppWrapper>
        <Table responsive className="noborder">
            <thead className="noborder">
            <tr>
                <th className="noborder">bicycle</th>
                <th className="noborder">bus</th>
                <th className="noborder">car</th>
                <th className="noborder">motorbike</th>
                <th className="noborder">none</th>
                <th className="noborder">person</th>
                <th className="noborder">truck</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((item,index)=>{
                      return (  <tr key={index}>
                            <td>{item.bicycle}</td>
                            <td>{item.bus}</td>
                            <td>{item.car}</td>
                            <td>{item.motorbike}</td>
                            <td>{item.none}</td>
                            <td>{item.person}</td>
                            <td>{item.truck}</td>
                        </tr>
                      )
                    })
                }
                
            </tbody>
        </Table>
        </StyledCommon.AppWrapper>
    </>)
  }

  export default Matrix;