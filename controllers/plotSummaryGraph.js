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
        query = `SELECT DISTINCT(ms.id) AS id,
		    ms.model,
			ms.model_name,
			ms.health,
			ms.needs_training,
			ms.drift, GROUP_CONCAT(mts.timestamp) AS tmstamp, GROUP_CONCAT(mts.confidence) AS confidence,GROUP_CONCAT(mts.data_drift) AS data_drift, GROUP_CONCAT(mts.infer_time) AS infer_time,GROUP_CONCAT(mts.uptime) as uptime, ms.num_instances
			FROM model_summary ms 
			LEFT JOIN model_timeseries_summary mts ON mts.model_summary_id = ms.id
			LEFT JOIN model_uptime_summary mus ON mus.model_summary_id = ms.id GROUP BY ms.id`;
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

		res.send(JSON.stringify({"status": 200, "error": null, "response": rows}));
    })
	.catch((err)=>{
		
	  console.log(err);
	});
}));
module.exports = router;
