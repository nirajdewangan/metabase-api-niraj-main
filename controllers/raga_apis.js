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

router.get("/get_next_image/:id/:name/:configId/:selectedModel", function (req, res) {
    var id = req.params.id;
    var name = req.params.name;
    console.log(`id : ${id} and name : ${name}`)
    var data = JSON.stringify({
        "ignore_cache": false,
        "parameters": [
            {
                "type": "category",
                "value": [
                    req.params.selectedModel
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
                "value": req.params.configId,
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
    console.log("next img data : ",data)

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
            console.log("sus : ",JSON.stringify(response.data));
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

router.get("/get_pre_image/:id/:name/:configId/:selectedModel", function (req, res) {
    var id = req.params.id;
    var name = req.params.name;
    console.log(`id : ${id} and name : ${name} and ${req.params.configId} and ${req.params.selectedModel}`)
    var data = JSON.stringify({
        "ignore_cache": false,
        "parameters": [
            {
                "type": "category",
                "value": [
                    req.params.selectedModel
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
                "value": req.params.configId,
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
    console.log("get pre image : ",data)

    var config = {
        method: 'post',
        url: 'http://3.6.67.248:3000/api/card/90/query',
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

router.post("/create_jira_issue",function(req,res){
    var data = JSON.stringify({
        "fields": {
          "project": {
            "key": "PROJECT11"
          },
          "summary": req.body.issueTitle,
          "description": req.body.issueDes,
          "issuetype": {
            "name": "Bug"
          }
        }
      });
      console.log("jira server issue : ",data)
      
      var config = {
        method: 'post',
        url: 'https://vineetnandan.atlassian.net/rest/api/2/issue',
        headers: { 
          'Authorization': 'Basic cHJhZGVlcC5weWRhaEByYWdhLmFpOkJmem5XMFpnU0l4ZnRpYzNJZTVQQ0M1NQ==', 
          'Content-Type': 'application/json', 
          'Cookie': 'atlassian.xsrf.token=2fd4216d-5387-4517-906f-d1834a1e8776_da8da59d2f500f77ca206cce64c72158baaf84c6_lin'
        },
        data : data
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
