export interface GameDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  active: boolean;
}

export const games: GameDef[] = [
  {
    id: "adivina-marca",
    title: "Adivina la Marca",
    description: "Adivina la marca con preguntas de Si y No",
    icon: "Gamepad2", // Lo mantendremos en data pero lo ignoraremos visualmente
    route: "/games/adivina-marca",
    active: true,
  }
];
