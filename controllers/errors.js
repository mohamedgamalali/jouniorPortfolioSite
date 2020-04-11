exports.get404 = (req,res,next)=>{
    return res.status(404).render('404',{
        isLoggedIn:req.session.isLoggedIn
    });
};

exports.get500 = (req,res,next)=>{
    return res.status(500).render('500',{
        isLoggedIn:req.session.isLoggedIn
    });
};