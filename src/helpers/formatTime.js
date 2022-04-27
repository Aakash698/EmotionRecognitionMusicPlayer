export default function formatTime(seconds) {
    var days = Math.floor(seconds / (24 * 60 * 60));
    seconds -= days * (24 * 60 * 60);
    var hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * (60 * 60);
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return minutes + ":" + parseInt(seconds);
}