let mysql = require("mysql");
let db = require("../config/db");

let pool = mysql.createPool(db);

exports.connectPool = sql => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      conn.query(sql, (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        conn.release();
        resolve(result);
      });
    });
  });
};
