/**
 * @api {post} /api/profile/modify 修改用户资料
 * @apiName profileModify
 * @apiGroup Profile
 * @apiPermission user
 * @apiVersion 2.1.0
 *
 * @apiDescription 提供用户资料修改接口
 * 用户可修改的资料有：
 * 性别、出生日期、手机号码、自述
 *
 * @apiSampleRequest /api/profile/modify
 *
 * @apiParam {Number} school_id  用户学号
 * @apiParam {String} sex 用户性别
 * @apiParam {String} birth_date 用户出生日期
 * @apiParam {String} phone_num 用户手机号码
 * @apiParam {String} description 用户自述
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *      	"school_id": 14051531,
 *      	"sex": "男",
 *      	"birth_date": "1996-4-29",
 *      	"phone_num": "135xxxx6570",
 *      	"description": "A dream pursuer"
 *     }
 *
 * @apiSuccess {json} data Response data.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 2000,
 *       "msg": "档案更新成功"
 *     }
 *
 * @apiError profileModifyFailed 用户档案更新失败
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 2001,
 *       "msg": "档案更新失败"
 *     }
 */

router.post('/modify', function (req, res) {
  // modify a profile
  const {
    school_id,
    sex,
    birth_date,
    phone_num,
    description,
  } = req.body
  const modData = {
    sex: sex,
    birth_date: birth_date,
    phone_num: phone_num,
    description: description,
  }

  Profile.update(modData, {
    where: {
      school_id: school_id,
    },
  }).then(function () {
    res.json(statusLib.PROFILE_MOD_SUCCESSFUL)
    console.log('modify successful')
  }).catch(function (e) {
    console.error(e)
    res.json(statusLib.CONNECTION_ERROR)
  })
})

/**
 * @api {post} /api/profile/avatar 上传用户头像
 * @apiName profileAvatar
 * @apiGroup Profile
 * @apiPermission user
 * @apiVersion 2.1.0
 *
 * @apiDescription 提供用户头像图片上传接口
 *
 * @apiSampleRequest /api/profile/modify
 *
 * @apiParam {Object} file 用户头像图片
 * @apiParam {Number} school_id 用户学号
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *        "file": "avatar.jpg"
 *      	"school_id": 14051531
 *     }
 *
 * @apiSuccess {json} data Response data.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 2100,
 *       "msg": "头像更新成功"
 *     }
 *
 * @apiError avatarModifyFailed 头像更新失败
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 2101,
 *       "msg": "头像更新失败"
 *     }
 */

router.post('/avatar', objMulter.any(), function (req, res, next) {
  // upload an avatar
  const schoolId = req.body.school_id // id is schoolId
  const url = pathLib.join(path.avatars, schoolId + '.jpg')
  req.avatarURL = url
  console.log('avatar upload successful')

  // check existance of previous avatar file
  Profile.findOne({
    where: {
      avatar: '/api/download?avatar=' + schoolId + '.jpg',
    },
  }).then(function (user) {
    if (user !== null) { // exists previous avatar file: delete first
      fs.unlink(url, function (err) {
        if (err) throw err
        else {
          console.log('previous avatar file deleted')
          next()
        }
      })
    } else {
      next()
    }
  }).catch(function (e) {
    console.error(e)
    res.json(statusLib.CONNECTION_ERROR)
  })
})

router.post('/avatar', function (req, res, next) {
  // rename avatar file
  fs.rename(req.files[0].path, req.avatarURL, function (err) {
    if (err) {
      console.log('avatar file rename error')
      res.json(statusLib.FILE_RENAME_FAILED)
    } else { next() }
  })
})

router.post('/avatar', function (req, res) {
  // update database record
  Profile.update({
    avatar: '/api/download?avatar=' + req.body.school_id + '.jpg',
  }, {
    where: {
      school_id: req.body.school_id,
    },
  }).then(function () {
    console.log('avatar modify successful')
    res.json(statusLib.PROFILE_MOD_SUCCESSFUL)
  }).catch(function (e) {
    console.error(e)
    res.json(statusLib.CONNECTION_ERROR)
  })
})

module.exports = router