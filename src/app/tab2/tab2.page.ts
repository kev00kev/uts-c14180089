import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { GvarService } from '../gvar.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  idd;
  isiData : Observable<data[]>;
  isiDataColl : AngularFirestoreCollection<data>;
  urlImageStorage : string[] = [];
  iddd;
  co : number = 0;
  constructor(
    afs : AngularFirestore,
    private afStorage : AngularFireStorage,
    public gvarService : GvarService
  ) {
    this.isiDataColl = afs.collection('dataNote');
    this.isiData = this.isiDataColl.valueChanges();
    
  }
  
  async ionViewDidEnter(){
    await this.gvarService.loadFoto();
    this.tampilkanData();
    this.co = 0;
  }

  tampilkanData(){
    this.idd = this.gvarService.getId();
    this.urlImageStorage=[];
    var refImage = this.afStorage.storage.ref('imgStorage');
    refImage.listAll().then((res)=>{
      res.items.forEach((itemRef)=>{
        itemRef.getDownloadURL().then((url)=>{
          this.co = this.co + 1;
          if (this.co == this.idd) {
            this.iddd = url;
          }
          this.urlImageStorage.push(url);
        });
      });
    }).catch((error)=>{
      console.log(error);
    });
    console.log(this.iddd);
  }


}

export interface data{
  id : string,
  judul : string,
  isi : string,
  tanggal : string,
  nilai : string,
  link : string,
}
