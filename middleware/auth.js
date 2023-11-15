function isUserAuthenticated(req, res, next){
    
    res.status(401).redirect('/login')
    /* if(req.session.user){
        next()
    }else{
        
    } */
}

module.exports = isUserAuthenticated