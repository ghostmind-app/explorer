import type { CustomArgs, CustomOptions } from 'jsr:@ghostmind/run';
import { dockerRegister, terraformActivate } from 'jsr:@ghostmind/run';

export default async function (_arg: CustomArgs, opts: CustomOptions) {
  const { start } = opts;

  await start({
    register: {
      command: dockerRegister,
      priority: 998,
      options: {
        amd64: true,
      },
    },
    activate: {
      command: terraformActivate,
      options: {
        component: 'core',
        arch: 'amd64',
      },
    },
  });
}
