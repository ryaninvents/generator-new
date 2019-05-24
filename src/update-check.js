import updateNotifier from 'update-notifier';
const pkg = require('../package.json');

export default function checkForUpdates() {
  updateNotifier({ pkg }).notify();
}
