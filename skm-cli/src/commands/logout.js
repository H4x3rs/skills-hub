import { Command } from 'commander';
import { clearAuth, getApiUrl, getRefreshToken } from '../lib/auth.js';
import axios from 'axios';

const logoutCommand = new Command('logout');
logoutCommand
  .description('Logout from BotSkill')
  .action(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await axios.post(`${getApiUrl()}/auth/logout`, { refreshToken });
      } catch (_) {}
    }
    clearAuth();
    console.log('Logged out successfully.');
  });

export { logoutCommand };
