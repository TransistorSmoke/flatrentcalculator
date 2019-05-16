var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var Moment = require('moment');
var momentRange = require('moment-range');
var moment = momentRange.extendMoment(Moment);
var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'my_db'
});

/* ------------------ HOME SECTION --------------*/
app.get('/', function(req, res) {
  res.render('home');
});

/* --------------------------------------------- */

/* ----- SHOW AND REGISTER MONTHLY PUB COST -----*/
app.get('/register', function(req, res) {
  res.render('register');
});
/* --------------------------------------------- */

/* ------------ SHOW PUB RECORDS --------------- */
app.get('/pub-records', function(req, res) {
  var queryPUBRecords = 'SELECT * FROM tbl_pub';
  connection.query(queryPUBRecords, function(err, results) {
    if (err) throw err;
    res.render('pub-records', { result: results, moment: moment });
  });
});
/* --------------------------------------------- */

/* ----- CALCULATE SECTION: Get the PUB cost for a specific duration, in preparation for the calculation * -----*/
app.get('/calculate', function(req, res) {
  var q = 'SELECT * FROM tbl_pub ORDER BY date_from';
  connection.query(q, function(err, results) {
    if (err) throw err;
    res.render('calculate', { result: results, moment: moment });
  });
});

/* --- SHOW PUB AND RENT SHARE PER HEAD ---*/
app.post('/shares', function(req, res) {
  var calcShareArgs = req.body.pub_date_duration.split(',');
  var queryShareCalc =
    'SELECT * FROM tbl_room_info AS room LEFT JOIN tbl_tenants AS tenants ON room.room_no = tenants.room_no';

  connection.query(queryShareCalc, function(err, results) {
    if (err) {
      res.render('error', { error: err });
    }
    res.render('shares', {
      shareArgs: calcShareArgs,
      moment: moment,
      result: results
    });
  });
});

/*---------- SAVE RENT SHARE INFO TO DATABASE -----*/
app.post('/save-shares-db', function(req, res) {
  var rentPeriod = req.body.rent_period;
  var totalPayable = req.body.total_payable;
  var rentPerHead = req.body.rent_per_head.split(',');
  var rentRecordData = {
    rent_period: rentPeriod,
    total_rent: totalPayable,
    room_01_master: rentPerHead[0],
    room_02_common: rentPerHead[1],
    room_03_common: rentPerHead[2],
    room_04_common: rentPerHead[3]
  };

  var queryInsertShareData = 'INSERT INTO tbl_rent_records SET?';
  connection.query(queryInsertShareData, rentRecordData, function(
    err,
    results
  ) {
    if (err) {
      res.render('error', { error: err });
    } else {
      console.log('Insertion of share data successful...');

      var queryGetInsertedData =
        'SELECT * FROM tbl_rent_records WHERE rent_period = "' +
        rentPeriod +
        '"';
      var queryGetRoomInfo = 'SELECT * FROM tbl_tenants';
      connection.query(queryGetRoomInfo, function(err, roomResults) {
        if (err) {
          res.render('error', { error: err });
        } else {
          connection.query(queryGetInsertedData, function(
            err,
            insertedDataResults
          ) {
            if (err) {
              res.render('error', { error: err });
            } else {
              res.render('save-shares-db', {
                insertedData: insertedDataResults,
                roomTenantData: roomResults
              });
            }
          });
        }
      });
    }
  });
});
/* ----------------------------------------------- */

/* ------ REGISTER NEW MONTHLY PUB COST ---------*/
app.post('/register_pub', function(req, res) {
  var billingYear = req.body.pubYear;
  var dateFrom = req.body.dateFrom;
  var dateTo = req.body.dateTo;
  var pubCost = req.body.cost;
  var pubRegData = {
    billing_year: billingYear,
    date_from: dateFrom,
    date_to: dateTo,
    pub_cost: pubCost
  };

  //Modify this program to prevent multiple insertion of data
  var queryRegister = 'INSERT INTO tbl_pub SET?';

  connection.query(queryRegister, pubRegData, function(err, results) {
    //  if (err) throw err;
    if (err) {
      res.render('error', { error: err });
    } else {
      console.log('Registration successful...');
      var queryUpdatedPubData = 'SELECT * FROM tbl_pub ORDER BY date_from';

      connection.query(queryUpdatedPubData, function(err, results) {
        res.render('register-success', {
          result: results,
          moment: moment,
          year: billingYear,
          dateFrom: dateFrom,
          dateTo: dateTo,
          cost: pubCost
        });
      });
    }
  });
});

/* -------------- RETRIEVE ALL TENANT RECORDS -----------*/
app.get('/tenants', function(req, res) {
  // var tenantsQuery = "SELECT * FROM tbl_tenants";
  var tenantsQuery =
    'SELECT * FROM tbl_tenants AS tenants LEFT JOIN tbl_room_info as room ON room.room_no = tenants.room_no';

  connection.query(tenantsQuery, function(err, results) {
    if (err) throw err;
    res.render('tenants', { result: results, moment: moment });
  });
});
/* ----------------------------------------------- */

/* -------------- CHECK AND RESPOND TO NON-EXISTENT PAGES ----------------*/
app.get('*', function(req, res) {
  res.render('error');
});
/* ----------------------------------------------- */

app.listen(3000, function() {
  console.log('Rent Application System now listening to port 3000...');
});
