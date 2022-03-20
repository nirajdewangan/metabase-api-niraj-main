var express = require('express');
var router = express.Router();
var pool = require('../db/database');


router.get('/', ((req, res, next) => {
	const model_params = req.query['model'] ?req.query['model'].toString().trim():"";
	const model = model_params.replace(/['"]+/g, '');

	const start_time_params = req.query['start_time'] ?req.query['start_time'].toString().trim():"";
	const end_time_params = req.query['end_time'] ?req.query['end_time'].toString().trim():"";
	const current_time_params = req.query['current_time'] ?req.query['current_time'].toString().trim():"";

	const st_time = start_time_params.replace(/['"]+/g, '');
	const end_time = end_time_params.replace(/['"]+/g, '');
	const current_time = current_time_params.replace(/['"]+/g, '');

	
    let query;
    if(!model){
        

		query = `SELECT a.*,mus.uptime FROM (SELECT  ms.model_name, FROM_UNIXTIME(TIMESTAMP) AS timestamp, health, needs_retraining, drift AS drift, num_instances,
		SUM(confidence) AS confidence,SUM(mts.data_drift) AS data_drift, 
		SUM(infer_time) AS infer_time, row_number() over (partition by ms.model_name) as day
		FROM model_summary ms 
		JOIN model_timeseries_summary mts ON mts.model_name = ms.model_name
		 WHERE DATE(FROM_UNIXTIME(TIMESTAMP)) >= "2022-01-09" AND DATE(FROM_UNIXTIME(TIMESTAMP)) <= "2022-01-15" 
		GROUP BY ms.model_name,DATE(FROM_UNIXTIME(TIMESTAMP))) AS a LEFT JOIN model_uptime_summary mus ON (mus.day = a.day AND a.model_name = mus.model_name)`;

    }else{
        query = `SELECT DISTINCT * FROM main WHERE model="${model}"`;
		if(st_time && end_time ){
			query = `SELECT DISTINCT * FROM main WHERE model="${model}" && start_time = "${st_time}" and end_time = "${end_time}"`;
		}
		
    }

	console.log(query);

	pool.promise().query(query).then(([rows,fields])=>{
		


		  var objectWithGroupByName = Object.values(rows.reduce((a, { model_name, timestamp, health, needs_retraining, drift, num_instances, confidence, data_drift, infer_time, day, uptime  }) => {
			
			if (!a[model_name]) { 
				a[model_name] = { model_name, timestamp:[], health, needs_retraining, drift, num_instances, confidence:[], data_drift:[], infer_time:[], day:[], uptime:[] };
			}
			
			 a[model_name].timestamp.push(new Date(timestamp).getDate());
			 a[model_name].confidence.push(confidence/uptime);
			 a[model_name].data_drift.push(data_drift/uptime);
			 a[model_name].infer_time.push(infer_time/uptime);
			 a[model_name].uptime.push(uptime);
			 a[model_name].day.push(day);

			 return a;
		  }, {}));

		 

		res.send(JSON.stringify({"status": 200, "error": null, "response": objectWithGroupByName}));
    })
	.catch((err)=>{
		
	  console.log(err);
	});
}));
module.exports = router;
