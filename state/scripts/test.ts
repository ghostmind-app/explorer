import type { CustomArgs, CustomOptions } from 'jsr:@ghostmind/run';
import { $, sleep } from 'npm:zx@8.1.3';
import { gql, GraphQLClient } from 'npm:graphql-request@7.1.0';

export default async function (_arg: CustomArgs, opts: CustomOptions) {
  const endpoint_login = Deno.env.get('DB_POTION_ENDPOINT') as string;

  const endpoint_secret = Deno.env.get('DB_POTION_SECRET') as string;

  const graphQLClient = new GraphQLClient(endpoint_login, {
    headers: {
      'X-Hasura-Admin-Secret': endpoint_secret,
    },
  });

  const sendRequest = gql`
    query MyQuery {
      articles(limit: 1) {
        id
      }
    }
  `;

  const response = await graphQLClient.request(sendRequest);

  console.log(response);
}
