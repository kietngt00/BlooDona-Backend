export default () => ({
  port: process.env.PORT || 3000,
  isSwagger: process.env.SWAGGER || false
})