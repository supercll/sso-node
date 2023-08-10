const Router = require('koa-router')

const router = new Router()

const { v4: uuid } = require('uuid')

router.get('/view/login', async (ctx, next) => {
  let { originUrl } = ctx.request.query
  await ctx.render('login', {
    originUrl,
  })
})
router.get('/logout', async (ctx, next) => {
  let token = ctx.cookies.get('token')
  ctx.session[token] = ''
  ctx.cookies.set('token', '', {
    maxAge: 0,
    httpOnly: false,
    path: '/',
  })
  console.log(ctx.cookies)
})

router.post('/login', async (ctx, next) => {
  let { username, password, originUrl } = ctx.request.body

  let userInfo = {
    username: 'lc',
    password: '103358',
  }

  if (username === userInfo.username && password === userInfo.password) {
    let tk = uuid().replace(new RegExp('-', 'g'), '').toLocaleLowerCase()
    let token = uuid().replace(new RegExp('-', 'g'), '').toLocaleLowerCase()
    ctx.tickets[tk] = userInfo.username
    ctx.session[token] = tk
    ctx.cookies.set('token', token, {
      maxAge: 60 * 1000, //有效时间，单位毫秒
      httpOnly: false,
      path: '/',
    })
    ctx.response.redirect(`${originUrl}?tk=${tk}`)
  } else {
    //todo 登录失败
  }
})

router.get('/validate', async (ctx, next) => {
  let { tk, originUrl } = ctx.request.query
  let token = ctx.cookies.get('token')
  if (ctx.tickets.hasOwnProperty(tk)) {
    ctx.body = ctx.tickets[tk]
  }
  //else if (token) {
  //   let tk = ctx.session[token]
  //   ctx.body = tk
  // }
  else {
    ctx.body = null
  }
})

module.exports = router
