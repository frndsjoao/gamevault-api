export const GameStatus = [
  "Backlog",
  "Replay",
  "Playing",
  "Abandoned",
  "Completed",
]

export type GameStatusType = (typeof GameStatus)[number]
