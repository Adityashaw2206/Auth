// export const errorMiddleware = (err,req,res,next) => {
//     if(res.headersSent){
//         return next(err);
//     }
//     const statusCode = err.statusCode || 500;
//     return res.status(statusCode).json({
//         success: false,
//         message: err.message || "Internal Server Error",
//         error: err.errors || [],
//         data: err.data || null,
//         stack: process.env.NODE_ENV === "production" ? null : err.stack,
//     })
// }

export const errorMiddleware = (err, req, res, next) => {
  console.log("🔥 ERROR STATUS:", err.statusCode);
  console.log("🔥 ERROR MESSAGE:", err.message);
  console.log("🔥 ERROR STACK:", err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};