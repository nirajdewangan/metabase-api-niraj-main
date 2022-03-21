var express = require('express');
var router = express.Router();
var axios = require('axios');


router.get("/get_all_configurations", function (req, res) {

    var data = '';
    var config = {
        method: 'post',
        url: 'http://3.6.67.248:3000/api/card/72/query',
        headers: {
            'Content-Type': 'application/json',
            'X-Metabase-Session': '952913c5-d6d5-4e69-a75e-8a5657c22b6f',
            'Cookie': 'metabase.DEVICE=e1d7eb17-5324-4eb6-a564-81ffd1ac7c8d'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            res.json({
                status: "success",
                payload: response.data
            })
        })
        .catch(function (error) {
            console.log(error);
            res.json({
                status: "error",
                payload: error
            })
        });

})

router.get("/get_all_issues", function (req, res) {

    var config = {
        method: 'post',
        url: 'http://3.6.67.248:3000/api/card/69/query',
        headers: {
            'Content-Type': 'application/json',
            'X-Metabase-Session': '952913c5-d6d5-4e69-a75e-8a5657c22b6f',
            'Cookie': 'metabase.DEVICE=e1d7eb17-5324-4eb6-a564-81ffd1ac7c8d'
        }
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            res.json({
                status: "success",
                payload: response.data
            })
        })
        .catch(function (error) {
            console.log(error);
            res.json({
                status: "error",
                payload: error
            })
        });
})

router.get("/get_next_image/:id/:name", function (req, res) {
    var id = req.params.id;
    var name = req.params.name;
    console.log(`id : ${id} and name : ${name}`)
    var data = JSON.stringify({
        "ignore_cache": false,
        "parameters": [
            {
                "type": "category",
                "value": [
                    "yoloV3_tiny-v0"
                ],
                "target": [
                    "dimension",
                    [
                        "template-tag",
                        "model"
                    ]
                ]
            },
            {
                "type": "category",
                "value": "1",
                "target": [
                    "variable",
                    [
                        "template-tag",
                        "configuration"
                    ]
                ]
            },
            {
                "type": "category",
                "value": id,
                "target": [
                    "variable",
                    [
                        "template-tag",
                        "id"
                    ]
                ]
            },
            {
                "type": "category",
                "value": name,
                "target": [
                    "variable",
                    [
                        "template-tag",
                        "cur_image"
                    ]
                ]
            }
        ]
    });

    var config = {
        method: 'post',
        url: 'http://3.6.67.248:3000/api/card/92/query',
        headers: {
            'Content-Type': 'application/json',
            'X-Metabase-Session': '952913c5-d6d5-4e69-a75e-8a5657c22b6f',
            'Cookie': 'metabase.DEVICE=e1d7eb17-5324-4eb6-a564-81ffd1ac7c8d'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            res.json({
                status : "success",
                payload : response.data
            })
        })
        .catch(function (error) {
            console.log(error);
            res.json({
                status : "error",
                payload : error
            })
        });

})


module.exports = router;
