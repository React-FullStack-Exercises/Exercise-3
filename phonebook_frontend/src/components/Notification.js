const Notification = ({ type, message }) => {
    if (message === null || message === '') {
        return null
    }
    if (type === 'error') {
        return (
            <div className="error">
                {message}
            </div>
        )
    }
    else {
        return (
            <div className="success">
                {message}
            </div>
        )
    }
}

export default Notification