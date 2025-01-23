const configColor = (text) => {
    switch (text.toLowerCase()) {
        case 'bug':
            return 'badge-error'; // red badge
        case 'new feature':
            return 'badge-success'; // green badge
        case 'update':
            return 'badge-warning'; // yellow badge
        case 'others':
            return 'badge-secondary'; // gray badge
        case 'low':
            return 'badge-success'; // green badge
        case 'medium':
            return 'badge-warning'; // yellow color badge
        case 'high':
            return 'badge-error'; // info color badge
        case 'urgent':
            return 'badge-ghost'; // ghost color badge
        default:
            return 'badge-secondary'; // default gray badge
    }
}
module.exports = { configColor }