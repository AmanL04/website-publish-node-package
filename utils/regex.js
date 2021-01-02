/**
 * @module
 * @description Contains all the regexes required for this project
 */

// Regex which can be used to extract the leftmost subdomain (when matched)
exports.subdomainCaptureRegex = /^https:\/\/([a-zA-Z0-9_-]+)\.publish\.amanlodha\.tech(\/)?$/;

// Regex which can be used to extract the entire domain (when matched) exluding "https://" and the trailing slashes
exports.fulldomainCaptureRegex = /^https:\/\/([a-zA-Z0-9_-]+\.publish\.amanlodha\.tech)(\/)?$/;
