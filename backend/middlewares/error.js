const errorHandler = (err,req,res,next) =>{

    
    let message = 'Internal Server Error'
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
   
    res.status(statusCode)
     err.message = err.message || message
    res.json({
        success:false,
        message:err.message,
        error:err
    })  
}

module.exports = errorHandler;