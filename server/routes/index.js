const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    username: ctx.state.username
  })
})

module.exports = router
