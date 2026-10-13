import readline from 'node:readline/promises';

import { ChatOllama } from '@langchain/ollama';
import { SYSTEM_PROMPT } from './constants.js';

async function main() {
  const llm = new ChatOllama({
    model: process.env.OLLAMA_MODEL!,
    temperature: 0.5,
  });

  const context: string[] = [];

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  while (true) {
    try {
      const query = await rl.question('You: ');

      context.push(`User: ${query}`);

      if (query === '/exit') {
        rl.close();
        process.exit(1);
      }

      const res = await llm.invoke([
        ['system', SYSTEM_PROMPT],
        ['human', context.join('\n')],
      ]);

      const assistant = res.content;

      context.push(`Assistant: ${assistant}`);

      console.log('Assistant:', assistant);
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    }
  }
}

main();
