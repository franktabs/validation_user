export interface TypeElecteur {
  id: number;
  nom: string;
  prenom?: string;
  sexe: "M" | "F";
  date_naissance: Date | string;
  tel: number;
  residence?: string;
  bureau_vote?: string;
}

export class Electeur {
  static clearData: TypeElecteur = {
    id: -1,
    nom: "",
    prenom: "",
    sexe: "M",
    date_naissance: "",
    tel: 0,
    residence: "",
    bureau_vote: "",
  };

  constructor(public data: TypeElecteur) {}
}

export const dataTest: Electeur[] = [
  new Electeur({
    ...Electeur.clearData,
    nom: "frank",
    date_naissance: new Date(),
    tel: 645342312,
    residence: "Yaoundé",
    bureau_vote: "Yaoundé-Manguier",
    id: 1,
  }),
  new Electeur({
    ...Electeur.clearData,
    nom: "Junior",
    date_naissance: new Date(),
    tel: 645342312,
    residence: "Yaoundé",
    bureau_vote: "Yaoundé-Manguier",
    sexe:"F",
    id: 2,
  }),
  new Electeur({
    ...Electeur.clearData,
    nom: "Arthur",
    date_naissance: new Date(),
    tel: 645342312,
    residence: "Yaoundé",
    bureau_vote: "Yaoundé-Manguier",
    id: 3,
  }),
  new Electeur({
    ...Electeur.clearData,
    nom: "Jean",
    date_naissance: new Date(),
    tel: 645342312,
    residence: "Yaoundé",
    bureau_vote: "Yaoundé-Manguier",
    id: 4,
  }),
  new Electeur({
    ...Electeur.clearData,
    nom: "Rosie",
    date_naissance: new Date(),
    tel: 645342312,
    residence: "Yaoundé",
    bureau_vote: "Yaoundé-Manguier",
    id: 5,
  }),
  new Electeur({
    ...Electeur.clearData,
    nom: "André",
    date_naissance: new Date(),
    tel: 645342312,
    residence: "Yaoundé",
    bureau_vote: "Yaoundé-Manguier",
    id: 6,
  }),
  new Electeur({
    ...Electeur.clearData,
    nom: "Estelle",
    date_naissance: new Date(),
    tel: 645342312,
    residence: "Yaoundé",
    bureau_vote: "Yaoundé-Manguier",
    id: 7,
  }),
];
