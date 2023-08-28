const express = require('express');
const router = express.Router();
const pool =  require('../config/db.js');

router.get('/data', async (req, res) => {
    pool.getConnection( (err, conn) => {
        if (err) throw err;

        try {
            const qry = `SELECT name, voting_choice, casted_at FROM votes`;
            conn.query(qry, (err, result) => {
                conn.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        } catch (err) {
            console.log(err);
            res.end();
        }
    });
});

router.post('/vote', async (req, res) => {
    const name = req.body.inputName;
    const voting_choice = req.body.inputVote;
    const casted_at = new Date();
    pool.getConnection( (err, conn) => {
        if (err) throw err;

        const qry = `INSERT INTO votes(name, voting_choice,casted_at) VALUES(?,?,?)`;
        conn.query(qry, [name, voting_choice, casted_at], (err, result) => {
            conn.release();
            if (err) throw err;
        });

        res.redirect('/data');
        res.end();
    });
});

router.get('/countstrue', async (req, res) => {
    pool.getConnection( (err, conn) => {
        if (err) throw err;

        const qry = `SELECT COUNT(*) as count,casted_at FROM votes WHERE voting_choice=1 GROUP BY casted_at`;
        conn.query(qry, (err, result) => {
            conn.release();
            if (err) throw err;
            res.send(JSON.stringify({data:result}));
        });
    });
});

router.get('/countsfalse', async (req, res) => {
    pool.getConnection( (err, conn) => {
        if (err) throw err;

        const qry = `SELECT COUNT(*) as count,casted_at FROM votes WHERE voting_choice=0 GROUP BY casted_at`;
        conn.query(qry, (err, result) => {
            conn.release();
            if (err) throw err;
            res.send(JSON.stringify({data:result}));
        });
    });
});

router.get('/results', async (req, res) => {
    pool.getConnection( (err, conn) => {
        if (err) throw err;

        try {
            const qry = `SELECT voting_choice,COUNT(*) as count FROM votes GROUP BY voting_choice`;
            conn.query(qry, (err, result) => {
                conn.release();
                if (err) throw err;
                res.send(JSON.stringify({data:[{count:result[0]["count"],voting_choice:result[0]["voting_choice"]},{count:result[1]["count"],voting_choice:result[1]["voting_choice"]}]}));
            });
        } catch (err) {
            console.log(err);
            res.end();
        }
    });
});

module.exports = router;