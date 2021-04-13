import { Injectable } from '@angular/core';
import { CameraResultType, CameraSource, Capacitor, CameraPhoto, FilesystemDirectory, Plugins} from '@capacitor/core';
import { Platform } from '@ionic/angular';

const { Camera, Filesystem, Storage } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class GvarService {
 public dataFoto : Photo[] = [];
 public notes : note[] = [];
 public idnote;
  private keyFoto : string = "foto";

  public pos;
  constructor() { }

  public setId(idd){
    this.idnote = idd;
  }
  public getId(){
    return this.idnote;
  }

  public addNote(iId,iJudul, iIsi, iTanggal, iNilai, iLink){
    this.notes.push({
      id : iId,
      judul : iJudul,
      isi : iIsi,
      tanggal : iTanggal,
      nilai : iNilai,
      link : iLink
    })
  }


  public async tambahFoto(){


	  const  Foto = await Camera.getPhoto({
		resultType : CameraResultType.Uri,
		source : CameraSource.Camera,
		quality : 100
	  })
	  console.log(Foto);


	  const fileFoto = await this.simpanFoto(Foto);
	  
	  
	  this.dataFoto.unshift(fileFoto);

	  Storage.set({
		key : this.keyFoto,
		value: JSON.stringify(this.dataFoto)
	  })

	  this.simpanFoto(Foto);
  
  }

  public setPos(pos){
    this.pos = pos;
  }
  public getPos(){
    return this.pos;
  }

  public async hapusFoto(){
	Storage.clear();
	Filesystem.deleteFile;
}




  public async simpanFoto(foto : CameraPhoto){
	const base64Data = await this.readAsBase64(foto);
	const namaFile = new Date().getTime()+'.jpeg';
	const simpanFile = await Filesystem.writeFile({
		path : namaFile,
		data : base64Data,
		directory : FilesystemDirectory.Data
	});

	const response = await fetch(foto.webPath);
	const blob = await response.blob();
	const dataFoto = new File([blob],foto.path,{
		type: "image/jpeg"
	});
	


		return{
			filePath : namaFile,
			webviewPath : foto.webPath,
			dataImage : dataFoto
		}
	

  }





  private async readAsBase64(foto : CameraPhoto){

  	const response = await fetch(foto.webPath);
		const blob = await response.blob();
		return await this.convertBlobToBase64(blob) as string;
	
  }




  convertBlobToBase64 = (blob : Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });







  public async loadFoto(){
	const listFoto = await Storage.get({key: this.keyFoto});
	this.dataFoto = JSON.parse(listFoto.value) || [];


		for (let foto of this.dataFoto) {
			const readFile = await Filesystem.readFile({
				path : foto.filePath,
				directory : FilesystemDirectory.Data
			});
			foto.webviewPath = `data:image/jpeg:base64,${readFile.data}`;

			const response = await fetch(foto.webviewPath);
			const blob = await response.blob();
			foto.dataImage = new File([blob],foto.filePath,{
				type: "image/jpeg"
			})
		}
	
  }

}

export interface Photo{
  filePath : string;
	webviewPath : string;
	dataImage : File
}

export interface note{
  id : string,
  judul : string,
  isi : string,
  tanggal : string,
  nilai : string,
  link : string
}