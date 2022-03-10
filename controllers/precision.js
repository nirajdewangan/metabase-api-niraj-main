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
	const query = `SELECT
    source.sumTruePositive / (source.sumTruePositive + source.sumFalsePositive) as 'precision123'
FROM (
        SELECT *,
            sum(isTruePositive) as sumTruePositive,
            sum(isTrueNegative) as sumTrueNegative,
            sum(isFalsePositive) as sumFalsePositive,
            sum(isFalseNegative) as sumFalseNegative
        FROM
            main WHERE "${model}"
    ) as source`;

	pool.promise().query(query).then(([rows,fields])=>{
		res.send(JSON.stringify({"status": 200, "error": null, "response": rows}));
    })
	.catch((err)=>{
	  console.log();
	});
}));
module.exports = router;
