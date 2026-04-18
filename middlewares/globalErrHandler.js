const globalErrHandler = (err, req, res, next) => {
    const stack = err.stack;
    const message = err.messgae;
    const status = err.status ? err.status : "failed";
    const statusCode = err.statusCode ? err.statusCode : 500;
    res.status(statusCode).json(
        {
            status,
            message,
            stack,
        }
    )
}

const notFoundError = (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on the server`);
    next(err);
}

module.exports = { globalErrHandler, notFoundError };