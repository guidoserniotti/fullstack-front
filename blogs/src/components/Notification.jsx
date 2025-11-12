function Notification({ text, type }) {
    if (text === '') {
        return null;
    }
    return <div className={type}>{text}</div>;
}

export default Notification;
