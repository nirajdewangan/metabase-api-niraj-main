var express = require('express');
var router = express.Router();
var pool = require('../db/database');


router.get('/', ((req, res, next) => {
	const model_params = req.query['model'] ?req.query['model'].toString().trim():"";
	const model = model_params.replace(/['"]+/g, '');

	// const start_time_params = req.query['start_time'] ?req.query['start_time'].toString().trim():"";
	// const end_time_params = req.query['end_time'] ?req.query['end_time'].toString().trim():"";
	// const current_time_params = req.query['current_time'] ?req.query['current_time'].toString().trim():"";
	// const st_time = start_time_params.replace(/['"]+/g, '');
	// const end_time = end_time_params.replace(/['"]+/g, '');
	// const current_time = current_time_params.replace(/['"]+/g, '');

	let date1_params = req.query['date'] ?req.query['date'].toString().trim():"";
	let date1 = date1_params.replace(/['"]+/g, '');
	let date2 = date1_params.replace(/['"]+/g, '');

	if(date1==0 ){ //one day + as data is old so this static logic applied
		date1='2022-01-15' 
	} else if (date1==7){
		date1 = '2022-01-09'
	}

	let date3 = '2022-01-15';
	
    let query;
    if(!model){
		if(date2 == '0'){
		query = `SELECT timeSlice as timestamp, bin_count as uptime, model_name, health, needs_retraining, drift AS drift, num_instances,
		(confidence/bin_count) AS confidence,(data_drift/bin_count) AS data_drift, 
		(infer_time/bin_count) AS infer_time FROM (SELECT FROM_UNIXTIME(TIMESTAMP), (
    CASE 
    WHEN TIME_FORMAT(FROM_UNIXTIME(TIMESTAMP), '%H:%i') >= '00:00' AND TIME_FORMAT(FROM_UNIXTIME(TIMESTAMP), '%H:%i') <= '04:00' THEN 4
    WHEN TIME_FORMAT(FROM_UNIXTIME(TIMESTAMP), '%H:%i') > '04:00' AND TIME_FORMAT(FROM_UNIXTIME(TIMESTAMP), '%H:%i') <= '08:00' THEN 8
    WHEN TIME_FORMAT(FROM_UNIXTIME(TIMESTAMP), '%H:%i') > '08:00' AND TIME_FORMAT(FROM_UNIXTIME(TIMESTAMP), '%H:%i') <= '12:00' THEN 12
    WHEN TIME_FORMAT(FROM_UNIXTIME(TIMESTAMP), '%H:%i') > '12:00' AND TIME_FORMAT(FROM_UNIXTIME(TIMESTAMP), '%H:%i') <= '16:00' THEN 16
    WHEN TIME_FORMAT(FROM_UNIXTIME(TIMESTAMP), '%H:%i') > '16:00' AND TIME_FORMAT(FROM_UNIXTIME(TIMESTAMP), '%H:%i') <= '20:00' THEN 20
    WHEN TIME_FORMAT(FROM_UNIXTIME(TIMESTAMP), '%H:%i') > '20:00' AND TIME_FORMAT(FROM_UNIXTIME(TIMESTAMP), '%H:%i') <= '24:00' THEN 24
    END) AS timeSlice, COUNT(*) bin_count,ms.model_name, health, needs_retraining, drift AS drift, num_instances,
		SUM(confidence) AS confidence,SUM(mts.data_drift) AS data_drift, 
		SUM(infer_time) AS infer_time FROM model_timeseries_summary mts JOIN model_summary ms ON mts.model_name = ms.model_name WHERE DATE(FROM_UNIXTIME(TIMESTAMP)) = "2022-01-15"
  GROUP BY 
	timeSlice,
   ms.model_name) AS a`;
		}		else {
			query = `SELECT a.*,mus.uptime FROM (SELECT  ms.model_name, FROM_UNIXTIME(TIMESTAMP) AS timestamp, health, needs_retraining, drift AS drift, num_instances,
		SUM(confidence) AS confidence,SUM(mts.data_drift) AS data_drift, 
		SUM(infer_time) AS infer_time, row_number() over (partition by ms.model_name) as day
		FROM model_summary ms 
		JOIN model_timeseries_summary mts ON mts.model_name = ms.model_name
		 WHERE DATE(FROM_UNIXTIME(TIMESTAMP)) >= "${date1}" AND DATE(FROM_UNIXTIME(TIMESTAMP)) <= "${date3}" 
		GROUP BY ms.model_name,DATE(FROM_UNIXTIME(TIMESTAMP))) AS a LEFT JOIN model_uptime_summary mus ON (mus.day = a.day AND a.model_name = mus.model_name)`;
		}

    }else{
        query = `SELECT DISTINCT * FROM main WHERE model="${model}"`;
		if(st_time && end_time ){
			query = `SELECT DISTINCT * FROM main WHERE model="${model}" && start_time = "${st_time}" and end_time = "${end_time}"`;
		}
		
    }

	//console.log("query",query);

	pool.promise().query(query).then( ([rows,fields])=>{
		var objectWithGroupByName = [];
		let objectWithGroupByName_arr = {};
		if(date2 == '0'){

		var objectWithGroupByName1 =  resolveResponseData(rows);

		function resolveResponseData(responseData) {
		
			var responseMap = new Map();
		
			if(responseData && responseData.length > 0) {
		
				responseData.map(row => {
					if(responseMap.get(row.model_name)) {
						let prevRows = responseMap.get(row.model_name);
						prevRows.push(row);
						responseMap.set(row.model_name,prevRows);
					} else {
						let model_array = [];
							model_array.push(row);
							responseMap.set(row.model_name,model_array);
						}
					});
		
					let dummyArray = [4,8,12,16,20,24];
		
					for (let [key, value] of responseMap) {
						let actualArray = value.map(a => a.timestamp);
						let difference = dummyArray.filter(x => !actualArray.includes(x));
						if(difference.length > 0) {
							difference.map(timestamp => {
								value.push(createObject(timestamp,  value[0]));
							}) 
						}
		
						value.sort( compare );
						responseMap.set(key, value);
					}
		
		
				const responseInArray = Array.from(responseMap.values());
		
				// console.log(responseInArray);
				return responseInArray;
		
		
			} else {
				return [];
			}
		
		}
		
		function createObject(timestamp, obj) {
			return {
				timestamp: timestamp,
				uptime: 0,
				model_name: obj.model_name,
				health: obj.health,
				needs_retraining: obj.needs_retraining,
				drift: obj.drift,
				num_instances: obj.num_instances,
				confidence: 0,
				data_drift: 0,
				infer_time: 0
			}
		}
		
		function compare( a, b ) {
		  if ( a.timestamp < b.timestamp ){
			return -1;
		  }
		  if ( a.timestamp > b.timestamp ){
			return 1;
		  }
		  return 0;
		}

console.log("objectWithGroupByName1",objectWithGroupByName1.length)


let abc = [];
for (let i=0; i<objectWithGroupByName1.length; i++) {
	abc.push(objectWithGroupByName1.slice(1,0));
}

	console.log("abc", abc)
		 objectWithGroupByName
		 = Object.values(objectWithGroupByName1[0].reduce((a, { timestamp, uptime, model_name, health, needs_retraining, drift, num_instances, confidence, data_drift,  infer_time  }) => {
			
			if (!a[model_name]) { 
				a[model_name] = { model_name, timestamp:[], health, needs_retraining, drift, num_instances, confidence:[], data_drift:[], infer_time:[], uptime:[] };
			}
			
			 a[model_name].timestamp.push(timestamp);
			 a[model_name].confidence.push(confidence);
			 a[model_name].data_drift.push(data_drift);
			 a[model_name].infer_time.push(infer_time);
			 a[model_name].uptime.push(uptime);
			//  a[model_name].day.push(day);
			//  a[model_name].timestamp.sort(function(a, b) {
			// 	return a - b;
			//   });
			 return a;
		  }, {}));

		
		

		}
		else if (date2 == '7'){
			//console.log("inside date1 equal 7")
			objectWithGroupByName = Object.values(rows.reduce((a, { model_name, timestamp, health, needs_retraining, drift, num_instances, confidence, data_drift, infer_time, day, uptime  }) => {
			
				if (!a[model_name]) { 
					a[model_name] = { model_name, timestamp:[], health, needs_retraining, drift, num_instances, confidence:[], data_drift:[], infer_time:[], day:[], uptime:[] };
				}
				
				 a[model_name].timestamp.push(new Date(timestamp).getDate());
				 a[model_name].confidence.push(confidence/uptime);
				 a[model_name].data_drift.push(data_drift/uptime);
				 a[model_name].infer_time.push(infer_time/uptime);
				 a[model_name].uptime.push(uptime);
				 a[model_name].day.push(day);
				//  a[model_name].timestamp.sort(function(a, b) {
				// 	return a - b;
				//   });
				 return a;
			  }, {}));
	
		}


		res.send(JSON.stringify({"status": 200, "error": null, "response": objectWithGroupByName}));
    })
	.catch((err)=>{
		
	  console.log(err);
	});
}));
module.exports = router;
