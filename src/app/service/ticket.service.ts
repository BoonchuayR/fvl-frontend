import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  addDoc, collection, collectionData, CollectionReference, deleteDoc,
  doc, docData, DocumentData, Firestore, Timestamp, updateDoc
} from '@angular/fire/firestore'


interface Tickets {
  id: string;
  TICKET_ID: string;
  CREATE_DATE: Timestamp;
  HEADLINE: string;
  DETAIL: string;
  CATEGORY: string;
  OPENER_USER_ID: string;
  CURRENT_HANDLER_USER_ID: string;
  STATUS: string;
  DUE_DATE: Timestamp;
  LOG: string;
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
}
