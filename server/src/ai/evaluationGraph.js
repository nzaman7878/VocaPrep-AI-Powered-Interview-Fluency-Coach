import { StateGraph, START, END } from '@langchain/langgraph';
import { InterviewEvaluationState } from './graphState.js';
import { evaluateContentNode } from './agents/contentEvaluator.js';
import { evaluateDeliveryNode } from './agents/deliveryEvaluator.js';
import { synthesizeCoachingNode } from './agents/coachSynthesis.js';

// Initialize the StateGraph with our strictly typed schema
const builder = new StateGraph(InterviewEvaluationState);

// 1. Register all the evaluation agents as nodes
builder.addNode('contentEvaluator', evaluateContentNode);
builder.addNode('deliveryEvaluator', evaluateDeliveryNode);
builder.addNode('coachSynthesis', synthesizeCoachingNode);

// 2. Define the execution flow (Edges)
// FAN-OUT: The pipeline diverges immediately.
// Both evaluators will be triggered in parallel.
builder.addEdge(START, 'contentEvaluator');
builder.addEdge(START, 'deliveryEvaluator');

// FAN-IN: Both the content and delivery evaluators must complete
// before their results are funneled into the synthesis node.
builder.addEdge('contentEvaluator', 'coachSynthesis');
builder.addEdge('deliveryEvaluator', 'coachSynthesis');

// End the pipeline
builder.addEdge('coachSynthesis', END);

// 4. Compile the graph
// Executed statelessly in one turn (no checkpointer required)
export const evaluationGraph = builder.compile();
