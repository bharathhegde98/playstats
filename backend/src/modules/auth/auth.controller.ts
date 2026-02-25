import { Context } from 'hono';
import { authService } from './auth.service';
import { ResponseHelper } from '../../shared/utils/response';
import type { AuthContext } from '../../shared/middleware/auth.middleware';

export class AuthController {
  /**
   * POST /auth/signup
   */
  async signUp(c: Context) {
    const body = c.get('validatedBody');
    const result = await authService.signUp(body);

    return ResponseHelper.created(c, {
      user: result.user,
      accessToken: result.session?.access_token,
      refreshToken: result.session?.refresh_token,
    });
  }

  /**
   * POST /auth/signin
   */
  async signIn(c: Context) {
    const body = c.get('validatedBody');
    const result = await authService.signIn(body);

    return ResponseHelper.success(c, {
      user: result.user,
      accessToken: result.session?.access_token,
      refreshToken: result.session?.refresh_token,
    });
  }

  /**
   * GET /auth/me
   */
  async getProfile(c: Context) {
    const auth = c.get('auth') as AuthContext;
    const profile = await authService.getProfile(auth.userId);

    return ResponseHelper.success(c, profile);
  }

  /**
   * PATCH /auth/profile
   */
  async updateProfile(c: Context) {
    const auth = c.get('auth') as AuthContext;
    const body = c.get('validatedBody');

    const profile = await authService.updateProfile(auth.userId, body);

    return ResponseHelper.success(c, profile);
  }

  /**
   * POST /auth/signout
   */
  async signOut(c: Context) {
    const token = c.req.header('Authorization')?.substring(7) || '';
    await authService.signOut(token);

    return ResponseHelper.success(c, { message: 'Signed out successfully' });
  }
}

export const authController = new AuthController();
