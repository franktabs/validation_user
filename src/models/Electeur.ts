import {
  CollectionReference,
  Timestamp,
  addDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

export interface TypeElecteur {
  id?: string;
  nom: string;
  prenom?: string;
  sexe: "M" | "F";
  date_naissance: Date | string | Timestamp;
  tel: number;
  residence?: string;
  bureau_vote?: string;
  valider: "OUI" | "NON";
}

export class Electeur {
  static collectionElecteur = collection(
    db,
    "electeur"
  ) as CollectionReference<TypeElecteur>;

  static clearData: TypeElecteur = {
    id: "-1",
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

  async save(): Promise<TypeElecteur> {
    let copyData = { ...this.data };
    if(copyData.id) delete copyData.id;
    if (typeof copyData.date_naissance === "string") {
      copyData.date_naissance = new Date(copyData.date_naissance);
    }
    if (copyData.date_naissance instanceof Date) {
      copyData.date_naissance = Timestamp.fromDate(copyData.date_naissance);
    }

    let electeurRef = await addDoc<TypeElecteur>(
      Electeur.collectionElecteur,
      copyData
    );
    if (electeurRef.id) {
      this.data.id = electeurRef.id;
      console.log("Sauvegarde reussi");
    }
    return this.data;
  }

  static async getAll(): Promise<TypeElecteur[]> {
    let electeur: TypeElecteur[] = [];
    const snapshot = await getDocs(Electeur.collectionElecteur);
    snapshot.forEach((doc) => {
      console.log('doc.data', doc.data())
      let dataElecteur = { ...Electeur.clearData, ...doc.data() };
      dataElecteur.id = doc.id;
      if (dataElecteur.date_naissance instanceof Timestamp) {
        dataElecteur.date_naissance = dataElecteur.date_naissance.toDate().toLocaleDateString();
      }
      electeur.push(dataElecteur);
    });
    return electeur;
  }
}
