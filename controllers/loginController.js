const getLoginPage = (req, res, next) => {
    res.render("login", {
        "title": "Login - Chat App"
    })
}

module.exports = {
    getLoginPage
}