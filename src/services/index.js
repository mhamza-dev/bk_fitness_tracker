/**
 * Services Index
 * Central export for all services
 * 
 * Note: Most services have been replaced by hooks (useAuthAPI, useProfile, etc.)
 * Only stepCounterService remains as it's a local service, not an API wrapper
 */

export { default as stepCounterService } from './stepCounter.js';
