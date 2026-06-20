import { graphql, setToken } from "./api";
import type { Role, User } from "@/types";

export { clearToken } from "./api";

export async function login(phone: string, password: string): Promise<void> {
  const data = await graphql<{ tokenAuth: { token: string } }>(
    `mutation ($phone: String!, $password: String!) {
      tokenAuth(phone: $phone, password: $password) { token }
    }`,
    { phone, password }
  );
  setToken(data.tokenAuth.token);
}

export interface RegisterInput {
  phone: string;
  email: string;
  password: string;
  role: Role;
  collectorType?: string;
}

export async function register(input: RegisterInput): Promise<User> {
  const data = await graphql<{ registerUser: { user: User } }>(
    `mutation ($phone: String!, $email: String!, $password: String!, $role: String!, $collectorType: String) {
      registerUser(phone: $phone, email: $email, password: $password, role: $role, collectorType: $collectorType) {
        user { id phone email role verified }
      }
    }`,
    input as unknown as Record<string, unknown>
  );
  return data.registerUser.user;
}

export async function requestOtp(phone: string): Promise<boolean> {
  const data = await graphql<{ requestOtp: { sent: boolean } }>(
    `mutation ($phone: String!) { requestOtp(phone: $phone) { sent } }`,
    { phone }
  );
  return data.requestOtp.sent;
}

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const data = await graphql<{ verifyOtp: { verified: boolean } }>(
    `mutation ($phone: String!, $code: String!) {
      verifyOtp(phone: $phone, code: $code) { verified }
    }`,
    { phone, code }
  );
  return data.verifyOtp.verified;
}

export async function requestPasswordReset(email: string): Promise<boolean> {
  const data = await graphql<{ requestPasswordReset: { sent: boolean } }>(
    `mutation ($email: String!) { requestPasswordReset(email: $email) { sent } }`,
    { email }
  );
  return data.requestPasswordReset.sent;
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<boolean> {
  const data = await graphql<{ resetPassword: { success: boolean } }>(
    `mutation ($email: String!, $code: String!, $newPassword: String!) {
      resetPassword(email: $email, code: $code, newPassword: $newPassword) { success }
    }`,
    { email, code, newPassword }
  );
  return data.resetPassword.success;
}

export async function fetchMe(): Promise<User | null> {
  const data = await graphql<{ me: User | null }>(
    `query {
      me { id phone email role verified collectorType rating ratingCount }
    }`
  );
  return data.me;
}
