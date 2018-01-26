/**
 * @apiDefine version @apiVersion 2.1.0
 */

/**
 * @api {post} /api/profile/modify 修改用户资料
 * @apiName profileModify
 * @apiGroup Profile
 * @apiPermission user
 * @apiUse version
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
 * @apiUse version
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

/**
 * @api {post} /api/profile/query 修改用户资料
 * @apiName profileModify
 * @apiGroup Profile
 * @apiPermission user
 * @apiUse version
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
router.post('/query', function (req, res, next) {
  // parse req data
  if (typeof req.body.request === 'object') {
    if (req.body.request.cur_class) {
      req.body.where = {
        cur_class: req.body.request.cur_class,
        school_id: {
          $gt: 999999 // student
        },
      }
      req.body.include = [
        {
          model: Plan,
          attributes: ['start', 'deadline', 'content', 'status'],
        },
        {
          model: Meeting,
          attributes: ['date', 'content'],
        },
        {
          model: Final,
          attributes: ['cswk_id', 'cswk_src', 'rate', 'remark', 'updated_at'],
        },
      ]
    }
    next()
  } else if (req.body.request === 'all') {
    req.body.where = {
      school_id: {
        $gt: 9999999 // student
      },
    }
    next()
  } else {
    req.body.where = {
      school_id: req.body.request,
    }
    next()
  }
})

router.post('/query', function (req, res, next) {
  // standard query
  if (req.body.include !== undefined || req.body.request.details === true) {
    next()
  } else {
    Profile.findAll({
      where: req.body.where,
    }).then(function (profile) {
      if (profile === null) {
        res.json(statusLib.PROFILE_FETCH_FAILED)
        console.log('profile does not exist')
      } else {
        res.json(profile)
        console.log('profile fetch successful')
      }
    }).catch(function (e) {
      console.error(e)
      res.json(statusLib.CONNECTION_ERROR)
    })
  }
})

router.post('/query', function (req, res, next) {
  // class-based query
  if (req.body.request.details === true) {
    next()
  } else {
    Profile.findAll({
      where: req.body.where,
      include: req.body.include,
    }).then(function (profiles) {
      if (!profiles.length) {
        res.json(statusLib.PROFILE_FETCH_FAILED)
        console.log('profile does not exist')
      } else {
        for (let i = 0; i < profiles.length; i++) {
          let profile = profiles[i].dataValues
          let plansLength = profile.plans.length - 1
          let meetingsLength = profile.meetings.length - 1
          profiles[i].dataValues.newest_plan = profile.plans[plansLength]
            ? profile.plans[plansLength]
            : null
          profiles[i].dataValues.newest_meeting = profile.meetings[meetingsLength]
            ? profile.meetings[meetingsLength]
            : null
          if (profile.finals.length) {
            profiles[i].dataValues.cswk_id = profile.finals[0].cswk_id
            profiles[i].dataValues.cswk_src = profile.finals[0].cswk_src
            profiles[i].dataValues.rate = profile.finals[0].rate
            profiles[i].dataValues.remark = profile.finals[0].remark
            profiles[i].dataValues.cswk_time = profile.finals[0].updated_at
          }
          delete profiles[i].dataValues.plans
          delete profiles[i].dataValues.meetings
          delete profiles[i].dataValues.finals
        }
        res.json(profiles)
        console.log('profile fetch successful')
      }
    }).catch(function (e) {
      console.error(e)
      res.json(statusLib.CONNECTION_ERROR)
    })
  }
})

router.post('/query', function (req, res) {
  // advanced query
  const stuId = req.body.request.school_id
  const clsId = req.body.request.cur_class
  let flag = 0
  let resData = {
    profile: {},
    plans: [],
    meetings: [],
  }

  Profile.findOne({
    where: {
      school_id: stuId,
    },
  }).then(function (profile) {
    if (profile === null) {
      res.json(statusLib.PROFILE_FETCH_FAILED)
      console.log('profile does not exist')
    } else {
      resData.profile = profile.dataValues
      flag = flag + 1
      if (flag === 3) {
        res.json(resData)
        console.log('profile fetch successful')
      }
    }
  }).catch(function (e) {
    console.error(e)
    res.json(statusLib.CONNECTION_ERROR)
  })
  Plan.findAll({
    where: {
      student_id: stuId,
      class_id: clsId,
    },
    order: [
      ['created_at', 'DESC'],
    ],
  }).then(function (plans) {
    let plansArr = []
    for (let i = 0; i < plans.length; i++) {
      plansArr.push(plans[i].dataValues)
    }
    resData.plans = plansArr
    flag = flag + 1
    if (flag === 3) {
      res.json(resData)
      console.log('profile fetch successful')
    }
  }).catch(function (e) {
    console.error(e)
    res.json(statusLib.CONNECTION_ERROR)
  })

  Meeting.findAll({
    where: {
      student_id: stuId,
      class_id: clsId,
    },
    order: [
      ['created_at', 'DESC'],
    ],
  }).then(function (meetings) {
    let meetingsArr = []
    for (let i = 0; i < meetings.length; i++) {
      meetingsArr.push(meetings[i].dataValues)
    }
    resData.meetings = meetingsArr
    flag = flag + 1
    if (flag === 3) {
      res.json(resData)
      console.log('profile fetch successful')
    }
  }).catch(function (e) {
    console.error(e)
    console.log('error')
    res.json(statusLib.CONNECTION_ERROR)
  })
})

module.exports = router