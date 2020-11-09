import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-form-tutorial',
  templateUrl: './form-tutorial.component.html',
  styleUrls: ['./form-tutorial.component.css']
})
export class FormTutorialComponent implements OnInit {
  itemsRef: AngularFireList<any>;
  items: Observable<any>;
  checkoutForm: any;

  constructor(db: AngularFireDatabase, private formBuilder: FormBuilder) {
    this.itemsRef = db.list('list');
    this.checkoutForm = this.formBuilder.group({
      name: '',
      size: ''
    });
    // this.items = this.itemRef.valueChanges();
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  add(newName: string, newSize: string) {
    this.itemsRef.push({ name: newName, size: newSize });
  }

  updateItem(key: string, newName: string, newSize: string) {
    this.itemsRef.update(key, { name: newName, size: newSize });
  }

  deleteItem(key: string) {
    this.itemsRef.remove(key);
  }
  
  ngOnInit(): void {
  }

  onSubmit(itemData: any) {
    // Process checkout data here
    this.checkoutForm.reset();

    console.warn('Your order has been submitted', itemData);
    this.add(itemData.name, itemData.size)
  }

}