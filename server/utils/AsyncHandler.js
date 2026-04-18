export const AsyncHandler = (fn) => async(req,resizeBy,next) => {
    try {
        await fn(req,resizeBy,next);
    } catch (err) {
        resizeBy.status(err.code || 500).json({
            success: false,
            message: err.message || "Internal Server Error"
        })
    }
}