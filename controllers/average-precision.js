var express = require('express');
var router = express.Router();
var pool = require('../db/database');


router.get('/', ((req, res, next) => {
	const params = req.query['model'] ?req.query['model'].toString().trim():"";
	const model = params.replace(/['"]+/g, '');

	if(!model || !isNaN((model))){
		res.status(400);
		res.send(JSON.stringify({"status": 400, "error": 'Bad Request - Model must contain a valid string', "response": null}));
		next();
		return;	
	}
	const query = `select true_class as 'True Class', avg(iou) as 'Average precision' from main WHERE "${model}" and  true_class != "None"  group by true_class
    union all
    select "MAP" as 'True Class', sum_ap/_count as 'Average precision'
        from (
    
        select count(*) as _count, sum('Average precision') as sum_ap 
        from
            (select true_class as class, avg(iou) as 'Average precision' from main WHERE "${model}" and true_class != "None"  group by true_class )  level1
            ) level2`

	pool.promise().query(query).then(([rows,fields])=>{
		res.send(JSON.stringify({"status": 200, "error": null, "response": rows}));
    })
	.catch((err)=>{
	  console.log();
	});
}));
module.exports = router;
