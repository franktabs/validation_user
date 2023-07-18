import { CollectionReference, Timestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

export interface TypeElecteur {
  id: number;
  nom: string;
  prenom?: string;
  sexe: "M" | "F";
  date_naissance: Date | string |Timestamp;
  tel: number;
  residence?: string;
  bureau_vote?: string;
  valider: "OUI" | "NON";
}

export class Electeur {
  collectionElecteur = collection(
    db,
    "electeur"
  ) as CollectionReference<TypeElecteur>;


  static clearData: TypeElecteur = {
    id: -1,
    nom: "",
    prenom: "",
    sexe: "M",
    date_naissance: "",
    tel: 0,
    residence: "",
    bureau_vote: "",
    valider: "NON",
  };

  constructor(public data: TypeElecteur) {}

  async save() {
    let copyData = { ...this.data };
    if (typeof copyData.date_naissance === "string") {
      copyData.date_naissance = new Date(copyData.date_naissance);
    }
    if (copyData.date_naissance instanceof Date) {
      copyData.date_naissance = Timestamp.fromDate(copyData.date_naissance);
    }
    try {
      let electeurRef = await addDoc<TypeElecteur>(
        this.collectionElecteur,
        copyData
      );
    } catch (e) {
      console.log("Une erreur s'est produite ");
    }
  }
}

export const dataTest: TypeElecteur[] = [
  {
    ...Electeur.clearData,
    nom: "frank",
    date_naissance: new Date().toLocaleDateString(),
    tel: 645342312,
    residence: "Yaoundé",
    bureau_vote: "Yaoundé-Manguier",
    id: 1,
  },
  {
    ...Electeur.clearData,
    nom: "Junior",
    date_naissance: new Date().toLocaleDateString(),
    tel: 645342312,
    residence: "Yaoundé",
    bureau_vote: "Yaoundé-Manguier",
    sexe: "F",
    id: 2,
  },
  {
    ...Electeur.clearData,
    nom: "Arthur",
    date_naissance: new Date().toLocaleDateString(),
    tel: 645342312,
    residence: "Yaoundé",
    bureau_vote: "Yaoundé-Manguier",
    valider: "OUI",
    id: 3,
  },
  {
    ...Electeur.clearData,
    nom: "Jean",
    date_naissance: new Date().toLocaleDateString(),
    tel: 645342312,
    residence: "Yaoundé",
    bureau_vote: "Yaoundé-Manguier",
    id: 4,
  },
  {
    ...Electeur.clearData,
    nom: "Rosie",
    date_naissance: new Date().toLocaleDateString(),
    tel: 645342312,
    residence: "Yaoundé",
    bureau_vote: "Yaoundé-Manguier",
    id: 5,
  },
  {
    ...Electeur.clearData,
    nom: "André",
    date_naissance: new Date().toLocaleDateString(),
    tel: 645342312,
    residence: "Yaoundé",
    bureau_vote: "Yaoundé-Manguier",
    id: 6,
  },
  {
    ...Electeur.clearData,
    nom: "Estelle",
    date_naissance: new Date().toLocaleDateString(),
    tel: 645342312,
    residence: "Yaoundé",
    bureau_vote: "Yaoundé-Manguier",
    id: 7,
  },
];
