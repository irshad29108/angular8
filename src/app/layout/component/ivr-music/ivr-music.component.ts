import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IvrService } from 'src/app/servies/ivr/ivr-service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-ivr-music',
  templateUrl: './ivr-music.component.html',
  styleUrls: ['./ivr-music.component.css']
})
export class IvrMusicComponent implements OnInit {

  public popoverTitle: string = 'Title';
  public popoverMessage: string = 'Are you really sure you want to do this?';
  public popoverClass: string = 'custompop';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;
  public filetePanel:boolean=false;
  addmusic: boolean = false
  submitbutton: boolean = true;
  button: string = 'Add'
  ivrmusicData: any = []
  data:any
  editData:any=[]
  submitted = false;
  messageheader: boolean = false;
  messageheadererror: boolean = false;
  FormgroupClass = new FormGroup({
    Displayname: new FormControl('', Validators.required),
    musicFile: new FormControl('', Validators.required),
    Description: new FormControl(),
  });
  filename: any
  displayname:any
  filestring: any
  filenameserch:any
  fileUplaod:boolean=false
  playurlname: any;
  get f() {
    return this.FormgroupClass.controls;
  }

  constructor(private toaster: ToastrService, private IVRService: IvrService,public sideNavService: ServiceService) {
    this.sideNavService.currentNameSubject.subscribe(val => {
      this.playurlname = val;
    })
   }

  ngOnInit() {
    this.getAllIVRMusic();
  }

  

  clickFilter(){
      this.filetePanel =!this.filetePanel;
  }

  resetfilter(){
    this.displayname = '';
    this.filenameserch = '';
  }

  getAllIVRMusic() {
    this.IVRService.getAllmusics().subscribe((res: Response) => {
      let Data = res;
      if (Data['statusCode'] == '200') {
        this.data = Data['data'];
      }

    })
  }

  clicktoAddMusic() {
    this.FormgroupClass.reset();
    this.addmusic = !this.addmusic
  }

  editMusic(id){
      this.editData = this.data.filter(item=>item.id == id);
      this.FormgroupClass= new FormGroup({
        Displayname: new FormControl(this.editData[0].displayname, Validators.required),
        musicFile: new FormControl('', Validators.required),
        Description: new FormControl(this.editData[0].description),
      });
      this.addmusic = !this.addmusic;
      this.button = 'Edit'
  }

  onUploadMusic(event) {
    this.readThis(event.target);
    this.filename = '';
    this.filename = <File>event.target.files[0];

  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.filestring = myReader.result;
    }
    myReader.readAsDataURL(file);
  }

  
  onSubmit() {
    this.submitted = true
    if (this.FormgroupClass.invalid) {
      return;
    }
    this.fileUplaod = true;
    let ivrPostData = {
      'displayname': this.FormgroupClass.controls.Displayname.value,
      'filename': this.filename.name,
      'description': this.FormgroupClass.controls.Description.value,
      'fcode': 0,
      'fcode_pass': "",
    }
    let ivrPostDataDirct = {
      'name': this.filename.name,
      'file': this.filestring,
    }
    this.IVRService.addIvrMusicDirect(ivrPostDataDirct).subscribe((Dirct: Response) => {

      if (Dirct['statusCode'] == "200") {
        this.IVRService.addIvrMusic(ivrPostData).subscribe((client: Response) => {
          if (client['statusCode'] == "200") {
            this.fileUplaod = false;
            this.addmusic = !this.addmusic
            this.getAllIVRMusic();
            this.toaster.success('music', 'Music File added successfully')
          } else {
            this.toaster.error('music', client['message'])
            this.clicktoAddMusic()
          }
        })
      }else{
        this.toaster.error('music', 'Music File not uploaded somthing went wrong'+Dirct['message'])
        this.clicktoAddMusic()
      }

    })

  }

  delete(id) {

    this.IVRService.deleteIvrMusic(id).subscribe((res: Response) => {
      let respose = res;
      if (respose['statusCode'] == '200') {
        this.toaster.success('Succes', 'IVR music deleted succesfully')
        this.getAllIVRMusic();
      } else {
        this.toaster.error('Error', 'Something went wrog')
      }

    })
  }


  closefiltr(num) {
    if (num == 'filtr1') {
      this.displayname = '';
    }

    if (num == 'filtr2') {
      this.filenameserch = '';
    }
    this.getAllIVRMusic();
  }
  playfor(filename){
    let data='http://34.206.124.151/pbxapis/NodeApis/getPath?filename=' + filename;
    this.sideNavService.currentNameSubject.next(data)
    this.sideNavService.mplay()
  }

}
