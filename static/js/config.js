const urlParams = new URLSearchParams(window.location.search);
const debugParam = urlParams.get('debug');

export const DEBUG = ['true', '1', 'on', 'yes'].includes(debugParam?.toLowerCase()) || false;

export function print(message) {
  if (DEBUG) {
    console.log(message)
  }
}
