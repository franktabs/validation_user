

export interface Electeur{
    nom:string;
    prenom?:string;
    sexe: "M" | "F";
    Date_naissance:Date;
    tel:number;
    residence?:string;
    bureau_vote?:string;
}
