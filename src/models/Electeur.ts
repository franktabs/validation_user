import {
	CollectionReference,
	Query,
	QueryDocumentSnapshot,
	Timestamp,
	addDoc,
	and,
	collection,
	deleteDoc,
	doc,
	endBefore,
	getCountFromServer,
	getDocs,
	limit,
	or,
	orderBy,
	query,
	startAfter,
	updateDoc,
	where,
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
	adresse1?: string;
	adresse2?: string;
	leader?: string;
}

export class Electeur {
	static collectionElecteur = collection(db, "electeur") as CollectionReference<TypeElecteur>;

	static clearData: TypeElecteur = {
		id: "-1",
		nom: "",
		prenom: "",
		sexe: "M",
		date_naissance: "01/01/2000",
		tel: 0,
		residence: "",
		adresse1: "",
		adresse2: "",
		bureau_vote: "",
		leader: "",
		valider: "NON",
	};

	static totalElecteur: number = 0;

	static lastVisibleDoc: QueryDocumentSnapshot<TypeElecteur>;
	static firstVisibleDoc: QueryDocumentSnapshot<TypeElecteur>;
	static lastQuery: Query<TypeElecteur>;
	static countLastRequest: number = 0;
	static lastDoingOrderBy: boolean = false;

	constructor(public data: TypeElecteur) {}

	async save(): Promise<boolean> {
		let copyData = { ...this.data };
		if (copyData.id) delete copyData.id;
		if (typeof copyData.date_naissance === "string") {
			copyData.date_naissance = new Date(copyData.date_naissance);
		}
		if (copyData.date_naissance instanceof Date) {
			copyData.date_naissance = Timestamp.fromDate(copyData.date_naissance);
		}

		let electeurRef = await addDoc<TypeElecteur>(Electeur.collectionElecteur, copyData);
		if (electeurRef.id) {
			this.data.id = electeurRef.id;
			console.log("Sauvegarde reussi");
			return true;
		}
		return false;
	}

	static async update(data: TypeElecteur | { valider: "OUI" | "NON"; id: string }) {
		let copyData = { ...data };
		let electeurRef = doc(Electeur.collectionElecteur, data.id);
		delete copyData.id;
		let result = await updateDoc(electeurRef, copyData);
	}

	static async getAllData(): Promise<TypeElecteur[]> {
		let electeur: TypeElecteur[] = [];
		const queryElecteur = query(Electeur.collectionElecteur);
		const snapshot = await getDocs(queryElecteur);
		const snapCount = await getCountFromServer(Electeur.collectionElecteur);
		Electeur.totalElecteur = snapCount.data().count;
		snapshot.forEach((doc) => {
			let dataElecteur = { ...Electeur.clearData, ...doc.data() };
			dataElecteur.id = doc.id;
			if (dataElecteur.date_naissance instanceof Timestamp) {
				dataElecteur.date_naissance = dataElecteur.date_naissance.toDate().toLocaleDateString();
			}
			electeur.push(dataElecteur);
		});
		return electeur;
	}

	static async getAllLimit(): Promise<TypeElecteur[]> {
		let electeur: TypeElecteur[] = [];
		const queryNoLimit = query(Electeur.collectionElecteur);
		const queryElecteur = query(queryNoLimit, limit(20));
		const snapshot = await getDocs(queryElecteur);
		const snapCount = await getCountFromServer(Electeur.collectionElecteur);
		Electeur.totalElecteur = snapCount.data().count;
		Electeur.countLastRequest = Electeur.totalElecteur;
		// const q = query(Electeur.collectionElecteur, limit(25));
		// const snapshot = await getDocs(q);
		snapshot.forEach((doc) => {
			let dataElecteur = { ...Electeur.clearData, ...doc.data() };
			dataElecteur.id = doc.id;
			if (dataElecteur.date_naissance instanceof Timestamp) {
				dataElecteur.date_naissance = dataElecteur.date_naissance.toDate().toLocaleDateString();
			}
			electeur.push(dataElecteur);
		});
		Electeur.firstVisibleDoc = snapshot.docs[0];
		Electeur.lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
		Electeur.lastQuery = queryNoLimit;
    console.log("resultat retourner de getAllLimit", electeur);
		return electeur;
	}

	static async getByColumn(column: { field: string; sort: "asc" | "desc" }): Promise<TypeElecteur[]> {
		let electeur: TypeElecteur[] = [];

		const queryNoLimit = query(Electeur.collectionElecteur, orderBy(column.field, column.sort));
		const queryElecteur = query(queryNoLimit, limit(20));
		const snapshot = await getDocs(queryElecteur);
		const snapCount = await getCountFromServer(Electeur.collectionElecteur);
		Electeur.totalElecteur = snapCount.data().count;
		const snapCountNoLimit = await getCountFromServer(queryNoLimit);
		Electeur.countLastRequest = snapCountNoLimit.data().count;
		// const q = query(Electeur.collectionElecteur, limit(25));
		// const snapshot = await getDocs(q);
		snapshot.forEach((doc) => {
			let dataElecteur = { ...Electeur.clearData, ...doc.data() };
			dataElecteur.id = doc.id;
			if (dataElecteur.date_naissance instanceof Timestamp) {
				dataElecteur.date_naissance = dataElecteur.date_naissance.toDate().toLocaleDateString();
			}
			electeur.push(dataElecteur);
		});
		Electeur.firstVisibleDoc = snapshot.docs[0];
		Electeur.lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
		Electeur.lastQuery = queryNoLimit;
		return electeur;
	}

	static async getNextDataLimit() {
		let electeur: TypeElecteur[] = [];
		const queryNoLimit = query(Electeur.lastQuery, startAfter(Electeur.lastVisibleDoc));
		const queryElecteur = query(queryNoLimit, limit(20));
		const snapshot = await getDocs(queryElecteur);
		const snapCount = await getCountFromServer(Electeur.collectionElecteur);
		Electeur.totalElecteur = snapCount.data().count;
		// const q = query(Electeur.collectionElecteur, limit(25));
		// const snapshot = await getDocs(q);
		snapshot.forEach((doc) => {
			let dataElecteur = { ...Electeur.clearData, ...doc.data() };
			dataElecteur.id = doc.id;
			if (dataElecteur.date_naissance instanceof Timestamp) {
				dataElecteur.date_naissance = dataElecteur.date_naissance.toDate().toLocaleDateString();
			}
			electeur.push(dataElecteur);
		});
		Electeur.firstVisibleDoc = snapshot.docs[0];
		Electeur.lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
		return electeur;
	}

	static async getPreviousDataLimit() {
		let electeur: TypeElecteur[] = [];
		const queryElecteur = query(Electeur.lastQuery, endBefore(Electeur.firstVisibleDoc), limit(20));
		const snapshot = await getDocs(queryElecteur);
		const snapCount = await getCountFromServer(Electeur.collectionElecteur);
		Electeur.totalElecteur = snapCount.data().count;
		// const q = query(Electeur.collectionElecteur, limit(25));
		// const snapshot = await getDocs(q);
		snapshot.forEach((doc) => {
			let dataElecteur = { ...Electeur.clearData, ...doc.data() };
			dataElecteur.id = doc.id;
			if (dataElecteur.date_naissance instanceof Timestamp) {
				dataElecteur.date_naissance = dataElecteur.date_naissance.toDate().toLocaleDateString();
			}
			electeur.push(dataElecteur);
		});
		Electeur.firstVisibleDoc = snapshot.docs[0];
		Electeur.lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
		return electeur;
	}

	static async getFilter(column: { field: string; value: string }) {
		let electeur: TypeElecteur[] = [];
		console.log("voici le filtre reçu =>", column);

		// --------------------------------------------------------------------------//
		// let searchTerm = column.value.toLowerCase();
		// let strlength = searchTerm.length;
		// let strFrontCode = searchTerm.slice(0, strlength - 1);
		// let strEndCode = searchTerm.slice(strlength - 1, searchTerm.length);
		// // This is an important bit..
		// let endCode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
		// const queryNoLimit = query(Electeur.collectionElecteur, or(where(column.field, ">", column.value+ '\uf8ff'), where(column.field, "==", column.value)));

		// --------------------------------------------------------------------------//

		const queryNoLimit = query(
			Electeur.collectionElecteur,
			or(and(where(column.field, ">=", column.value), where(column.field, "<", column.value + "\uf8ff")), where(column.field, "==", column.value))
		);
		const queryElecteur = query(queryNoLimit, limit(20));
		const snapshot = await getDocs(queryElecteur);
		const snapCount = await getCountFromServer(Electeur.collectionElecteur);
		Electeur.totalElecteur = snapCount.data().count;
		const snapCountNoLimit = await getCountFromServer(queryNoLimit);
		Electeur.countLastRequest = snapCountNoLimit.data().count;
		// const q = query(Electeur.collectionElecteur, limit(25));
		// const snapshot = await getDocs(q);
		snapshot.forEach((doc) => {
			let dataElecteur = { ...Electeur.clearData, ...doc.data() };
			dataElecteur.id = doc.id;
			if (dataElecteur.date_naissance instanceof Timestamp) {
				dataElecteur.date_naissance = dataElecteur.date_naissance.toDate().toLocaleDateString();
			}
			electeur.push(dataElecteur);
		});
		console.log("resutat filtre ", electeur);
		Electeur.firstVisibleDoc = snapshot.docs[0];
		Electeur.lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
		Electeur.lastQuery = queryNoLimit;
		return electeur;
	}

	static async delete(data: TypeElecteur) {
		if (data.id) {
			await deleteDoc(doc(Electeur.collectionElecteur, data.id));
		}
	}
}
