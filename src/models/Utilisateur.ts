import { CollectionReference, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export interface IUtilisateur {
    id?: string;
    type: "admin" | "user";
    nom: string;
    password: string;
}

export class Utilisateur {
    public data: IUtilisateur;


    static collectionUtilisateur = collection(
        db,
        "admin"
    ) as CollectionReference<IUtilisateur>;

    static readonly clearData: IUtilisateur = { type: "user", nom: "user", password: "user" }
    constructor(data: IUtilisateur) {
        this.data = data;
    }

    static async update(data: IUtilisateur | { password: string; id: string }) {
        let copyData = { ...data }
        let electeurRef = doc(Utilisateur.collectionUtilisateur, data.id);
        delete copyData.id;
        let result = await updateDoc(electeurRef, copyData);

    }

    static async getAll(): Promise<IUtilisateur[]> {
        let utilisateur: IUtilisateur[] = [];
        const snapshot = await getDocs(Utilisateur.collectionUtilisateur);
        snapshot.forEach((doc) => {
            let dataUtilisateur = { ...Utilisateur.clearData, ...doc.data() };
            dataUtilisateur.id = doc.id;
            utilisateur.push(dataUtilisateur);
        });
        return utilisateur;
    }
}