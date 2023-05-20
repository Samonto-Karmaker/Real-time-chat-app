const getInboxInfo = (req, res, next) => {
    res.render("inbox", {
        "title": "Inbox - Chat App"
    })
}

module.exports = {
    getInboxInfo
}