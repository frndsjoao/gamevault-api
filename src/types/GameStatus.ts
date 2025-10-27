export const GameStatus = [
  "Backlog",
  "Replay",
  "Playing",
  "Abandoned",
  "Finished",
]

export type GameStatusType = (typeof GameStatus)[number]
