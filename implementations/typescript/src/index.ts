import * as path from 'path';
import { loadMemoryGraph, loadAi17x } from './utils/fileLoader';
import { ConsolidatedMemory, MemoryGraph } from './Ai17x/models/memory';
import { selectRelevantMemories } from './utils/memorySelector';
import { generatePrompt } from './prompt';

/**
 * Generates a prompt that includes relevant memories based on user input.
 * @param userInput - User's input text.
 * @param maxMemories - Maximum number of memories to include.
 * @returns The generated prompt as a string.
 */
export async function generatePromptWithMemory(userInput: string, maxMemories: number = 5): Promise<string> {
  const Ai17xPath = path.join(__dirname, '../data/agent.soul');
  const memoriesPath = path.join(__dirname, '../data/memories.json');

  const Ai17xDefinition = await loadAi17x(Ai17xPath);
  const memoryGraph: MemoryGraph = await loadMemoryGraph(memoriesPath);
  const consolidatedMemories = Object.values(memoryGraph.memories);
  const relevantMemories: ConsolidatedMemory[] = selectRelevantMemories(consolidatedMemories, userInput, maxMemories);

  const formattedMemories = relevantMemories.map((mem) => (
    `[timestamp: ${mem.creation_date}] content: ${mem.core_memory}`)
  ).join('\n');

  const prompt = generatePrompt(Ai17xDefinition, formattedMemories);
  return prompt;
}

// Example Usage
(async () => {
    const userInput = "I've been feeling really down after my recent trades didn't go as planned.";
  
    try {
      const prompt = await generatePromptWithMemory(userInput, 5);
      console.log('=== Personality + Memory Prompt ===');
      console.log(prompt);
      console.log('=== End of Personality + Memory Prompt ===');
    } catch (error) {
      console.error('Error generating prompt with memory:', error);
    }
  })();
