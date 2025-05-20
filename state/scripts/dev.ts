import type { CustomArgs, CustomOptions } from 'jsr:@ghostmind/run';
import { dockerComposeBuild, dockerComposeUp } from 'jsr:@ghostmind/run';
import { $, cd, within } from 'npm:zx';

export default async function (_args: CustomArgs, opts: CustomOptions) {
  const { run, start, currentPath } = opts;

  await start({
    build: {
      command: dockerComposeBuild,
      priority: 998,
    },
    up: {
      command: dockerComposeUp,
      options: {
        infer: true,
        component: 'default',
      },
    },
    console: async () => {
      const SRC = Deno.env.get('SRC');

      $.cwd = `${SRC}/state/app/state`;

      const PORT = Deno.env.get('PORT');

      await $`${run} misc wait http://host.docker.internal:${PORT}`;

      await $`hasura console --no-browser`;
    },
  });
}
