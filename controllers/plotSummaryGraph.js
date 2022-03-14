var express = require('express');
var router = express.Router();
var pool = require('../db/database');


router.get('/', ((req, res, next) => {
	const model_params = req.query['model'] ?req.query['model'].toString().trim():"";
	const model = model_params.replace(/['"]+/g, '');

	const start_time_params = req.query['start_time'] ?req.query['start_time'].toString().trim():"";
	const end_time_params = req.query['end_time'] ?req.query['end_time'].toString().trim():"";

	const st_time = start_time_params.replace(/['"]+/g, '');
	const end_time = end_time_params.replace(/['"]+/g, '');

	// if(!isNaN((model))){
	// 	res.status(400);
	// 	res.send(JSON.stringify({"status": 400, "error": 'Bad Request - Model must contain a valid string', "response": null}));
	// 	next();
	// 	return;	
	// }
    let query;
    if(!model){
        query = `SELECT model, health, modelname, needstraining, drift, numinstances, DAY, musuptime, GROUP_CONCAT(TIMESTAMP) AS TIMESTAMP, GROUP_CONCAT(confidence) AS confidence, 
		GROUP_CONCAT(datadraft) AS datadraft,  GROUP_CONCAT(infertime) AS infertime, GROUP_CONCAT(mtsuptime) AS mtsuptime
		FROM (SELECT ms.model,mts.timestamp, 
		CAST(SUM(mts.confidence) AS DECIMAL(12,4)) AS confidence ,CAST(SUM(mts.data_drift) AS DECIMAL(12,4)) AS datadraft, 
		CAST(SUM(mts.infer_time) AS DECIMAL(12,4)) AS infertime,  CAST(SUM(mts.uptime) AS DECIMAL(12,4)) AS mtsuptime,
		ms.health AS health, ms.model_name AS modelname, ms.needs_training AS needstraining,
		ms.drift AS drift, ms.num_instances AS numinstances, mus.day AS DAY, mus.uptime AS musuptime
		FROM model_summary ms 
		LEFT JOIN model_timeseries_summary mts ON mts.model = ms.model
		LEFT JOIN model_uptime_summary mus ON mus.model = ms.model GROUP BY ms.model,mts.timestamp) AS a GROUP BY a.model`;
    }else{
        query = `SELECT DISTINCT * FROM main WHERE model="${model}"`;
		if(st_time && end_time ){
			query = `SELECT DISTINCT * FROM main WHERE model="${model}" && start_time = "${st_time}" and end_time = "${end_time}"`;
		}
		
    }

	console.log(query);

	pool.promise().query(query).then(([rows,fields])=>{
		// rows.map( (item) => {
		// 	item.capture_date = new Date(item.capture_date).getDate();
		// })
       //health  --> good and bad, 

		res.send(JSON.stringify({"status": 200, "error": null, "response": rows}));
    })
	.catch((err)=>{
		
	  console.log(err);
	});
}));
module.exports = router;
