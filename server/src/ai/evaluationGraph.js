import { StateGraph, START, END, MemorySaver } from '@langchain/langgraph';
import { InterviewEvaluationState } from './graphState.js';
import { generateQuestionNode } from './agents/questionGenerator.js';
import { evaluateContentNode } from './agents/contentEvaluator.js';
import { evaluateDeliveryNode } from './agents/deliveryEvaluator.js';
import { synthesizeCoachingNode } from './agents/coachSynthesis.js';

// Initialize the StateGraph with our strictly typed schema
const builder = new StateGraph(InterviewEvaluationState);

// 1. Register all the agents as nodes
builder.addNode('questionGenerator', generateQuestionNode);
builder.addNode('contentEvaluator', evaluateContentNode);
builder.addNode('deliveryEvaluator', evaluateDeliveryNode);
builder.addNode('coachSynthesis', synthesizeCoachingNode);

// 2. Define the execution flow (Edges)
builder.addEdge(START, 'questionGenerator');

// FAN-OUT: After the question is generated, the pipeline diverges.
// Both evaluators will be triggered in parallel.
builder.addEdge('questionGenerator', 'contentEvaluator');
builder.addEdge('questionGenerator', 'deliveryEvaluator');

// FAN-IN: Both the content and delivery evaluators must complete
// before their results are funneled into the synthesis node.
builder.addEdge('contentEvaluator', 'coachSynthesis');
builder.addEdge('deliveryEvaluator', 'coachSynthesis');

// End the pipeline
builder.addEdge('coachSynthesis', END);

// 3. Setup Checkpointing for Human-in-the-loop and multi-turn sessions
// MemorySaver persists the state across API requests so we can pause and resume the graph
const checkpointer = new MemorySaver();

// 4. Compile the graph
export const evaluationGraph = builder.compile({
  checkpointer,
  // CRITICAL: We pause the graph execution right before the evaluators run.
  // This allows us to return the generated question to the client, wait for the user
  // to record their audio, and then resume the graph with the transcription data.
  interruptBefore: ['contentEvaluator', 'deliveryEvaluator'],
});
