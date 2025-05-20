import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { GraphQLClient, gql } from 'graphql-request';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

//////////////////////////////////////////////////////////////////////
// INTERFACES
//////////////////////////////////////////////////////////////////////

interface dbUser {
  email: string;
  givenName: string;
  familyName: string;
  userId: string;
  role: string;
}

//////////////////////////////////////////////////////////////////////
// CREATE USER
//////////////////////////////////////////////////////////////////////

async function createUser({ email, givenName, familyName, userId }: dbUser) {
  const endpoint_login = process.env.DB_USERS_ENDPOINT;
  const graphQLClient = new GraphQLClient(endpoint_login, {
    headers: {
      'X-Hasura-Admin-Secret': process.env.DB_USERS_SECRET,
    },
  });

  const mutation = gql`
    mutation MyMutation(
      $email: String!
      $givenName: String!
      $familyName: String!
      $userId: String!
      $role: String!
    ) {
      insert_users(
        objects: {
          email: $email
          givenName: $givenName
          familyName: $familyName
          userId: $userId
          role: $role
        }
      ) {
        returning {
          userId
        }
      }
    }
  `;
  await graphQLClient.request(mutation, {
    email,
    givenName,
    familyName,
    userId,
    role: 'user',
  });
}

//////////////////////////////////////////////////////////////////////
// NEXT AUTH OPTIONS
//////////////////////////////////////////////////////////////////////

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const SessionWithUserId = {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };

      return SessionWithUserId;
    },
  },
  events: {
    signIn: async (user: any) => {
      const { id, name, email } = user.user;

      const endpoint_login = process.env['DB_USERS_ENDPOINT'];

      const graphQLClient = new GraphQLClient(endpoint_login, {
        headers: {
          'X-Hasura-Admin-Secret': process.env.DB_USERS_SECRET,
        },
      });

      const query = gql`
        query verifyUserProfile($email: String!) {
          users(where: { email: { _eq: $email } }) {
            givenName
            email
            userId
          }
        }
      `;
      let variables = {
        email,
      };

      interface Users {
        users: User[];
      }

      interface User {
        givenName: string;
        email: string;
        userId: string;
      }

      const data: Users = await graphQLClient.request(query, variables);

      let { users } = data;

      if (users.length === 0) {
        await createUser({
          email,
          givenName: name,
          familyName: name,
          userId: id,
          role: 'user',
        });
      }

      // create hasura jwt

      const secret = process.env.HASURA_GRAPHQL_JWT_SECRET;

      const hasuraClaims = {
        'https://hasura.io/jwt/claims': {
          'x-hasura-default-role': 'user',
          'x-hasura-allowed-roles': ['user'],
          'x-hasura-user-id': id,
        },
      };

      if (!secret) {
        throw new Error(
          'Secret key is undefined. Make sure it is properly set.'
        );
      }

      const token = jwt.sign(hasuraClaims, secret, { expiresIn: '10y' });

      // set cookie

      await cookies().set({
        name: 'hasura-jwt',
        value: token,
        httpOnly: true,
        path: '/',
      });
    },
  },
};

//////////////////////////////////////////////////////////////////////
// THE END
//////////////////////////////////////////////////////////////////////
