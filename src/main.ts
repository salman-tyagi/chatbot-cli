import readline from 'node:readline/promises';

import { ChatOllama } from '@langchain/ollama';

async function main() {
  const llm = new ChatOllama({
    model: process.env.OLLAMA_MODEL!,
    temperature: 0.3,
  });

  const context: string[] = [];

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  while (true) {
    try {
      const query = await rl.question('You: ');

      if (query === '/exit') {
        rl.close();
        process.exit(1);
      }

      context.push(`User: ${query}`);

      const stream = await llm.stream([
        ['system', process.env.SYSTEM_PROMPT!],
        ['human', context.join('\n')],
      ]);

      for await (const chunk of stream) {
        const chunkContent = chunk.content;

        if (typeof chunkContent === 'string') {
          context.push(`AI: ${chunkContent}`);
          process.stdout.write(chunkContent);
        }
      }

      process.stdout.write('\n');
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    }
  }
}

main();
