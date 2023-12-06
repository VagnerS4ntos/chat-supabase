import { userT } from "@/typescript/types";

export function getUserNameById(id: string, users: userT[]) {
  const data = users
    .filter((user) => user.id == id)
    .map((user) => user.name)[0];
  return data;
}

export function converterTimeStamp(date: any) {
  const dateUTC = new Date(date);

  const formatedDate =
    dateUTC.toLocaleDateString("pt-BR") +
    " - " +
    dateUTC.toLocaleTimeString("pt-BR");

  return formatedDate;
}
