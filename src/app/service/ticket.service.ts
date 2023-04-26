import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  addDoc, collection, collectionData, CollectionReference, deleteDoc,
  doc, docData, DocumentData, Firestore, Timestamp, updateDoc
} from '@angular/fire/firestore'


interface Tickets {
  CATEGORY: string;
  STATUS: string;
  DUE_DATE:string;
  CREATE_DATE:string;
  LOG:string;
  HEADLINE: string;
  CURRENT_HANDLER_USER_ID:string;
  TICKET_ID: string;
  DETAIL: string;
  OPENER_USER_ID: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private ticketCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.ticketCollection = collection(firestore, 'tickets');
  }

  create(tickets: Tickets) {
    return addDoc(this.ticketCollection, tickets);
  }
  getAll() {
    return collectionData(this.ticketCollection, {
      idField: 'id',
    }) as Observable<Tickets[]>;
  }

  get(id: string) {
    const ticketDocumentReference = doc(this.firestore, `tickets/${id}`);
    return docData(ticketDocumentReference, { idField: 'id' });
  }

  update(tickets: Tickets) {

    const ticketDocumentReference = doc(this.firestore, `tickets/${tickets.id}`);
    return updateDoc(ticketDocumentReference, { ...tickets });
  }

  delete(id: string) {
    const ticketDocumentReference = doc(this.firestore, `tickets/${id}`);
    return deleteDoc(ticketDocumentReference);
  }
  async getAllTicketFromAPI() {
    const response = await fetch("https://us-central1-fvl-app.cloudfunctions.net/api/service");
    const users = await response.json();
    return users.data;
  }
}
