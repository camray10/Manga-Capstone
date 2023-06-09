const { BadRequestError } = require("../expressError");

/**
 * Helper for making selective update queries.
 *
 * The calling function can use it to make the SET clause of an SQL UPDATE
 * statement.
 *
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // Add "registration_date" to the jsToSql object
  const updatedJsToSql = { ...jsToSql, registrationDate: "registration_date" };

  // {firstName: 'Cameron', age: 26, registrationDate: '2023-05-01'} => ['"first_name"=$1', '"age"=$2', '"registration_date"=$3']
  const cols = keys.map((colName, idx) =>
      `"${updatedJsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
