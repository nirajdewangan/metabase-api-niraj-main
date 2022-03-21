var express = require('express');
var router = express.Router();
var axios = require('axios');


router.get("/get_all_configurations", function (req, res) {
    var promiseObj = new Promise((resolve, reject) => {
        axios.post("http://3.6.67.248:3000/api/card/72/query", {
            headers: {
                "Content-Type": "application/json",
                "X-Metabase-Session": "952913c5-d6d5-4e69-a75e-8a5657c22b6f"
            }
        }, {}).then((res) => {
            console.log("The configuration res is ", res)
            resolve(res);
        })
            .catch((err) => {
                console.log('The configuration err is ', err);
                reject(err);
            })
    })
    return promiseObj;
});
module.exports = router;
