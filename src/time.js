/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */

/**
 * 获取当前时间并返回表示该时间的字符串
 *
 * @api
 * @param time
 * @returns {string}
 */

function getDate (time) {
  let curTime = null

  if (!time) {
    curTime = new Date()
  } else if (typeof time === 'object') {
    curTime = new Date(time)
  } else {
    return 'time: argument format error'
  }

  let convert = (digit) => {
    if (digit < 10) return '0' + digit
    else return digit.toString()
  }

  let year = curTime.getFullYear()
  let month = convert(curTime.getMonth() + 1)
  let day = convert(curTime.getDate())
  let hour = convert(curTime.getHours())
  let minute = convert(curTime.getMinutes())
  let second = convert(curTime.getSeconds())

  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' +
    second
}

module.exports = {
  now () {
    return getDate()
  },
  getTimeString (time) {
    return getDate(time)
  },
}