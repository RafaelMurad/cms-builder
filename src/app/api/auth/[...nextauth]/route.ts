/**
 * NextAuth.js API Route
 *
 * Handles all authentication requests:
 * - OAuth callbacks
 * - Session management
 * - CSRF protection
 */

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/config";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
