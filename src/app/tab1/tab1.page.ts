import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GvarService } from '../gvar.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  id : number = 0;
  judul : string;
  isi : string;
  tanggal = Date();
  nilai : string;
  link : string = "";
  urlImageStorage : string[] = [];
  isiData : Observable<data[]>;
  isiDataColl : AngularFirestoreCollection<data>;
  constructor(
    public gvarService : GvarService,
    private afStorage : AngularFireStorage,
    afs : AngularFirestore,
    public router : Router

  ) {
    this.isiDataColl = afs.collection('dataNote');
    this.isiData = this.isiDataColl.valueChanges();
  }
  
  TambahFoto(){
    this.gvarService.tambahFoto();
  }
  addNote(){
    
  }
  detail(idd){
    this.gvarService.setId(idd);
    this.router.navigateByUrl('tab2');
  }
  upload(){
    this.urlImageStorage=[];
    for(var index in this.gvarService.dataFoto){
        const imgFilepath = "imgStorage/"+(this.gvarService.dataFoto[index].filePath);
        this.afStorage.upload(imgFilepath, this.gvarService.dataFoto[index].dataImage).then(() => {
          this.afStorage.storage.ref().child(imgFilepath).getDownloadURL().then((url) => {
            this.urlImageStorage.unshift(url);
          });
        }); 
    }
    //jika menggunakan this.link = this.urlImageStorage[0] upload diblock
    this.link = "";

    this.gvarService.addNote(this.id, this.judul, this.isi, this.tanggal, this.nilai, this.link);
    for(var index in this.isiData){
      this.id = this.id + 1;
    }
    
    this.isiDataColl.doc(this.judul).set({
      id : this.id.toString(),
      judul : this.judul,
      isi : this.isi,
      tanggal : this.tanggal,
      nilai : this.nilai,
      link : this.link
    });
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
