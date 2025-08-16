export enum GameState {
  Start = 'start',
  Playing = 'playing',
  End = 'end',
  Chat = 'chat',
  ChatHistory = 'chatHistory'
}

export interface Scenario {
  storyText: string;
  choices: string[];
}
