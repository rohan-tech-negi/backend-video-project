class ApiError extends Error{
    constructor(
        statusCode,
        message="SOmething went wrong",
        error=[],
        stack=""
    ){
        super(message),
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false,
        this.errors = this.errors
    }
}